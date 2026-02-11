from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PIL import Image
from pydantic import BaseModel
import io
import json
import os
import requests
from bs4 import BeautifulSoup 
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

# MODEL LİST
MODELLER = [
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
]

class LinkIstegi(BaseModel):
    link: str
    cinsiyet_tercihi: str

def prompt_hazirla(kullanici_cinsiyeti, urun_metni=""):
    
    metin_kaniti = ""
    if urun_metni and len(urun_metni) > 2:
        metin_kaniti = f"LİNK BAŞLIĞI: '{urun_metni}'"

    return f"""
    Sen sadece UYUMLULUK KONTROLÜ yapan katı bir denetçisin.
    
    KULLANICI SEÇİMİ: {kullanici_cinsiyeti}
    {metin_kaniti}

    --- GÖREVİN ---
    Kullanıcının seçimi ile Görsel/Link uyuşuyor mu? Sadece buna bak.
    Eğer uyuşmuyorsa, "Şu kategoriye geç" diye öneri verme. Sadece REDDET.

    --- ADIM 1: UYUMLULUK DENETİMİ (TEK KURAL) ---

    A) KULLANICI 'ERKEK' SEÇTİ AMA:
       - Görselde/Linkte KADIN, ÇOCUK, KIZ, BEBEK, ERKEK ÇOCUK, ETEK, ELBİSE vb. var mı?
       -> {{ "hata": "kategori_hatasi", "mesaj": "Bu ürün ERKEK kategorisine uygun değil. Lütfen seçiminizi kontrol ediniz." }} DÖNDÜR VE DUR.

    B) KULLANICI 'KADIN' SEÇTİ AMA:
       - Görselde/Linkte ERKEK, ADAM, ÇOCUK, KIZ, KIZ ÇOCUK, BEBEK vb. var mı?
       -> {{ "hata": "kategori_hatasi", "mesaj": "Bu ürün KADIN kategorisine uygun değil. Lütfen seçiminizi kontrol ediniz." }} DÖNDÜR VE DUR.

    C) KULLANICI 'ÇOCUK' SEÇTİ AMA:
       - Görselde/Linkte YETİŞKİN (Kadın/Erkek) var mı?
       -> {{ "hata": "kategori_hatasi", "mesaj": "Bu ürün ÇOCUK kategorisine uygun değil. Lütfen seçiminizi kontrol ediniz." }} DÖNDÜR VE DUR.

    --- ADIM 2: DİĞER KONTROLLER ---
    - Görselde BİRDEN FAZLA İNSAN varsa -> {{ "hata": "coklu_kisi", "mesaj": "Lütfen tek kişilik fotoğraf seçiniz." }}
    - Moda dışıysa -> {{ "hata": "urun_yok" }}

    --- (HATA YOKSA STİLİST MODUNA GEÇ)(Sen moda terimlerine hakim, vizyoner bir asistansın.) ---
    Ürünü analiz et. Bu ürünün TARZINA, KUMAŞINA ve KULLANIM YERİNE en uygun tamamlayıcı parçaları öner.

    --- 3. ÇOCUK TESPİTİ (Eğer 'Cocuk' Seçildiyse) ---
    - Görseldeki çocuk 'Kız' mı 'Erkek' mi? Görseldeki kıyafet 'Kız kıyafeti' mi 'Erkek kıyafeti' mi? Aramalarda bunu kullan (Örn: "Kız Çocuk...").

    VİZYON KURALLARI:
    1. BAĞLAM (CONTEXT): Ürünün giyileceği ortamı tahmin et (Ev, Sokak, Ofis, Davet vb.) ve Giyim/ayakkabı/aksesuar önerilerini O ORTAMA GÖRE seç.
    2. UYUM: Rastgele parça önerme. Ana ürünün kumaş ve dokusuna yakışacak parçalar seç.
    3. MODERNLİK: Eski moda terimler kullanma. Güncel ve şık kombinler oluştur.

    --- 5. ARAMA FORMATI ---
    Format: [Cinsiyet] + [Renk] + [Kalıp/Tarz] + [Ürün]
    Örnekler: "Erkek Haki Baggy Pantolon", "Kadın Ekru Paraşüt Etek", "Kız Çocuk Pembe Tütü Etek", "Erkek Çocuk Siyah Baskılı Tişört"

    SENARYOLAR:
    - Üst Giyim -> Alt Giyim + Ayakkabı + Aksesuar/Dış Giyim
    - Alt Giyim -> Üst Giyim + Ayakkabı + Aksesuar/Dış Giyim

    YANIT FORMATI (JSON):
    {{
        "secilen_urun": "Ürünün net tanımı (Örn: Erkek Mavi Yüksek Bel Baggy pantolon)",
        "oneri_kategorileri": [
            {{ 
                "baslik": "Alt Giyim / Üst Giyim", 
                "arama_terimleri": ["Farklı Tarz 1", "Farklı Tarz 2"] 
            }},
            {{ 
                "baslik": "Ayakkabı", 
                "arama_terimleri": ["...", "..."] 
            }},
            {{ 
                "baslik": "Aksesuar", 
                "arama_terimleri": ["...", "..."] 
            }}
        ]
    }}
    """

# Model değiştirici: model hakkı bitmişse veya hata vermişse otomatik sıradakine geçer.
def gemini_analiz_et(image, cinsiyet, urun_metni=""):
    
    for model_ismi in MODELLER:
        try:
            print(f"🤖 Deneniyor: {model_ismi}") 
            
            model = genai.GenerativeModel(model_ismi)
            
            response = model.generate_content([
                prompt_hazirla(cinsiyet, urun_metni),
                image
            ])
            
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)

        except Exception as e:
            print(f"❌ {model_ismi} hatası: {e}")
            print("🔄 Sıradaki modele geçiliyor...")
            continue 

    return {"hata": "sunucu_hatasi", "detay": "Tüm modeller meşgul."}

@app.post("/analiz-foto")
async def analiz_foto(file: UploadFile = File(...), cinsiyet: str = Form(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    return gemini_analiz_et(image, cinsiyet, urun_metni="") 

@app.post("/analiz-link")
async def analiz_link(istek: LinkIstegi):
    url = istek.link
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        if "ty.gl" in url:
            resp = requests.get(url, headers=headers, allow_redirects=True)
            url = resp.url
        
        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.content, 'html.parser')
        
        meta_image = soup.find("meta", property="og:image")
        meta_title = soup.find("meta", property="og:title")
        urun_metni = meta_title["content"] if meta_title else ""
        
        if meta_image and meta_image["content"]:
            img_data = requests.get(meta_image["content"], headers=headers).content
            image = Image.open(io.BytesIO(img_data))
            return gemini_analiz_et(image, istek.cinsiyet_tercihi, urun_metni)
        else:
            return {"hata": "urun_yok", "mesaj": "Linkten fotoğraf alınamadı"}

    except Exception as e:
        return {"hata": "sunucu_hatasi", "detay": str(e)}