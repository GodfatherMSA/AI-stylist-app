import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useSepet } from '../../context/SepetContext'; 

//IP ADRESİ
const BILGISAYAR_IP = "192.168.1.XXX"; 

const HAZIR_URUNLER = [
  { 
    id: '1', 
    ad: 'Erkek Haki Kargo Pantolon', 
    cinsiyet: 'Erkek', 
    resim: require('../../assets/magaza/kargo.png'), 
    fiyat: 1200 
  },
  { 
    id: '2', 
    ad: 'Kadın Kırmızı Mini Elbise', 
    cinsiyet: 'Kadin', 
    resim: require('../../assets/magaza/elbise.png'), 
    fiyat: 730 
  },
  { 
    id: '3', 
    ad: 'Kız Çocuk Pembe Mont', 
    cinsiyet: 'Cocuk', 
    resim: require('../../assets/magaza/mont.png'), 
    fiyat: 1000 
  },
  { 
    id: '4', 
    ad: 'Erkek Mavi Oversize T-Shirt', 
    cinsiyet: 'Erkek', 
    resim: require('../../assets/magaza/tshirt.png'), 
    fiyat: 350 
  },
  { 
    id: '5', 
    ad: 'Erkek Çocuk Kot İkili Takım ', 
    cinsiyet: 'Cocuk', 
    resim: require('../../assets/magaza/kottakim.png'), 
    fiyat: 850 
  }, 
  { 
    id: '6', 
    ad: 'Kadın Lacivert Crop ', 
    cinsiyet: 'Kadin', 
    resim: require('../../assets/magaza/crop.png'), 
    fiyat: 150 
  },
];

export default function MagazaScreen() {
  const { sepeteEkle } = useSepet();
  const [linkInput, setLinkInput] = useState("");
  
  //Hem sayı hem yazı
  const [yukleniyorId, setYukleniyorId] = useState<string | number | null>(null);

  // Link ile ekleme
  const linkleSepeteEkle = async () => {
    if (!linkInput.includes("trendyol") && !linkInput.includes("ty.gl")) { 
        Alert.alert("Hata", "Geçerli bir Trendyol linki giriniz."); return; 
    }
    
    setYukleniyorId("link_btn"); 
    try {
      const response = await axios.post(`http://${BILGISAYAR_IP}:8000/analiz-link`, {
        link: linkInput,
        cinsiyet_tercihi: 'Genel' 
      });
      const veri = response.data;

      if (veri.hata) {
        Alert.alert("Uyarı ⚠️", veri.mesaj);
      } else {
        sepeteEkle({
          id: Date.now().toString(),
          baslik: veri.secilen_urun,
          //temsili resim
          resim: "https://cdn.dsmcdn.com/mnresize/1200/1800/ty995/product/media/images/20230825/16/426034638/100555678/1/1_org_zoom.jpg", 
          fiyat: 499.99,
          öneriler: veri.oneri_kategorileri
        });
        Alert.alert("Başarılı ✅", "Ürün sepete eklendi!");
        setLinkInput("");
      }
    } catch (e) { Alert.alert("Hata", "Sunucu hatası."); } 
    finally { setYukleniyorId(null); }
  };

  const hazirUrunuEkle = async (item: any) => {
    setYukleniyorId(item.id); 
    
    try {
      const assetSource = Image.resolveAssetSource(item.resim);
      const imageUri = assetSource.uri;

      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        name: 'urun.png',
        type: 'image/png',
      } as any);
      
      formData.append('cinsiyet', item.cinsiyet);

      const response = await axios.post(`http://${BILGISAYAR_IP}:8000/analiz-foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const veri = response.data;

      if (veri.hata) {
         Alert.alert("Uyarı", veri.mesaj);
      } else {
        sepeteEkle({
            id: item.id + "_" + Date.now(),
            baslik: item.ad, 
            resim: item.resim, 
            fiyat: item.fiyat,
            öneriler: veri.oneri_kategorileri 
        });

        Alert.alert("Başarılı ✅", "Ürün sepete eklendi!");
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Hata", "Yapay zeka şu an meşgul, lütfen tekrar deneyin.");
    } finally {
      setYukleniyorId(null); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Mağaza</Text></View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Linkten Sepete Ekle</Text>
          <View style={styles.linkBox}>
            <TextInput style={styles.input} placeholder="Trendyol linki yapıştır..." value={linkInput} onChangeText={setLinkInput}/>
            <TouchableOpacity style={styles.addButton} onPress={linkleSepeteEkle} disabled={!!yukleniyorId}>
              {yukleniyorId === "link_btn" ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Sepete Ekle</Text>}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>✨ Hazır Koleksiyon</Text>
        <View style={styles.grid}>
          {HAZIR_URUNLER.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.resim} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.ad}</Text>
                <Text style={styles.cardPrice}>{item.fiyat} TL</Text>
                
                <TouchableOpacity 
                  style={[styles.cardBtn, yukleniyorId === item.id && styles.disabledBtn]} 
                  onPress={() => hazirUrunuEkle(item)} 
                  disabled={!!yukleniyorId}
                >
                  {yukleniyorId === item.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.cardBtnText}>Sepete Ekle +</Text>
                  )}
                </TouchableOpacity>

              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingTop: 50, paddingBottom: 15, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#F27A1A' },
  scroll: { padding: 15 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  linkBox: { gap: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, backgroundColor: '#fafafa' },
  addButton: { backgroundColor: '#333', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 15, overflow: 'hidden', elevation: 2 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 13, color: '#333', height: 35 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#F27A1A', marginVertical: 5 },
  cardBtn: { backgroundColor: '#F27A1A', padding: 8, borderRadius: 5, alignItems: 'center', minHeight: 35, justifyContent: 'center' },
  disabledBtn: { backgroundColor: '#fab1a0' }, 
  cardBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});