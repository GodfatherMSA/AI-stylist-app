import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

//IP ADRESİ
const BILGISAYAR_IP = "192.168.1.XXX"; 

export default function HomeScreen() {
  const [mod, setMod] = useState<'foto' | 'link'>('foto');
  const [cinsiyet, setCinsiyet] = useState<'Kadin' | 'Erkek' | 'Cocuk'>('Kadin');
  const [image, setImage] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [analizVerisi, setAnalizVerisi] = useState<any>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  const fotografSec = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setAnalizVerisi(null);
    }
  };

  const analiziBaslat = async (kullanilacakCinsiyet: string) => {
    setYukleniyor(true);
    setAnalizVerisi(null);
    try {
      let response;
      if (mod === 'foto') {
        if (!image) { Alert.alert("Uyarı", "Fotoğraf seçmedin!"); setYukleniyor(false); return; }
        const formData = new FormData();
        formData.append('file', { uri: image, name: 'upload.jpg', type: 'image/jpeg' } as any);
        formData.append('cinsiyet', kullanilacakCinsiyet); 
        response = await axios.post(`http://${BILGISAYAR_IP}:8000/analiz-foto`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        if (!linkInput.includes("trendyol") && !linkInput.includes("ty.gl")) { 
            Alert.alert("Uyarı", "Geçerli bir Trendyol linki giriniz."); setYukleniyor(false); return; 
        }
        response = await axios.post(`http://${BILGISAYAR_IP}:8000/analiz-link`, { link: linkInput, cinsiyet_tercihi: kullanilacakCinsiyet });
      }

      const veri = response.data;
      if (veri.hata) {
        if (veri.hata === "urun_yok") Alert.alert("Ürün Bulunamadı 🚫", "Moda ürünü göremedim.");
        else if (veri.hata === "coklu_kisi") Alert.alert("Kalabalık Fotoğraf 👨‍👩‍👧", veri.mesaj);
        else if (veri.hata === "kategori_hatasi") Alert.alert("Yanlış Seçim ⚠️", veri.mesaj);
        else Alert.alert("Hata", veri.mesaj);
      } else {
        setAnalizVerisi(veri);
      }
    } catch (error) {
      Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamadı.");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <View style={styles.anaKapsayici}>
      <View style={styles.header}><Text style={styles.headerText}>Kombinle</Text></View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, mod === 'foto' && styles.tabAktif]} onPress={() => setMod('foto')}><Ionicons name="camera-outline" size={20} color={mod === 'foto' ? '#F27A1A' : '#666'} /><Text style={[styles.tabText, mod === 'foto' && styles.tabTextAktif]}>Fotoğraf</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, mod === 'link' && styles.tabAktif]} onPress={() => setMod('link')}><Ionicons name="link-outline" size={20} color={mod === 'link' ? '#F27A1A' : '#666'} /><Text style={[styles.tabText, mod === 'link' && styles.tabTextAktif]}>Link</Text></TouchableOpacity>
        </View>

        <View style={styles.cinsiyetContainer}>
            <Text style={styles.etiketBaslik}>Kime Bakıyoruz?</Text>
            <View style={styles.radioGroup}>
                <TouchableOpacity style={[styles.radioBtn, cinsiyet === 'Kadin' && styles.radioAktif]} onPress={() => setCinsiyet('Kadin')}><Text style={cinsiyet === 'Kadin' ? styles.radioTextAktif : styles.radioText}>Kadın</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.radioBtn, cinsiyet === 'Erkek' && styles.radioAktif]} onPress={() => setCinsiyet('Erkek')}><Text style={cinsiyet === 'Erkek' ? styles.radioTextAktif : styles.radioText}>Erkek</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.radioBtn, cinsiyet === 'Cocuk' && styles.radioAktif]} onPress={() => setCinsiyet('Cocuk')}><Text style={cinsiyet === 'Cocuk' ? styles.radioTextAktif : styles.radioText}>Çocuk</Text></TouchableOpacity>
            </View>
        </View>

        <View style={styles.girisKutusu}>
            {mod === 'foto' ? (
                <TouchableOpacity onPress={fotografSec} style={styles.fotoAlan}>
                    {image ? <Image source={{ uri: image }} style={styles.gosterilenResim} /> : <View style={styles.fotoPlaceholder}><Ionicons name="cloud-upload-outline" size={40} color="#F27A1A" /><Text style={styles.fotoYazi}>Fotoğraf Yükle</Text></View>}
                </TouchableOpacity>
            ) : (
                <View style={styles.linkAlan}><TextInput style={styles.input} placeholder="Trendyol Linki..." value={linkInput} onChangeText={setLinkInput} autoCapitalize="none" /></View>
            )}
            <TouchableOpacity style={[styles.buton, yukleniyor && styles.butonPasif]} onPress={() => analiziBaslat(cinsiyet)} disabled={yukleniyor}>
                {yukleniyor ? <ActivityIndicator color="white" /> : <Text style={styles.butonYazi}>✨ Analiz Et</Text>}
            </TouchableOpacity>
        </View>

        {analizVerisi && analizVerisi.oneri_kategorileri ? ( 
          <View style={styles.sonucAlani}>
            <View style={styles.urunOzetKutu}><Text style={styles.urunTanimi}>Analiz: {analizVerisi.secilen_urun}</Text></View>
            {analizVerisi.oneri_kategorileri.map((kategori: any, index: number) => (
              <View key={index} style={styles.kategoriKart}>
                <Text style={styles.kategoriBaslik}>{kategori.baslik}</Text>
                <View style={styles.etiketGrubu}>
                  {kategori.arama_terimleri.map((terim: string, i: number) => (
                    <TouchableOpacity key={i} style={styles.etiket} onPress={() => Linking.openURL(`https://www.trendyol.com/sr?q=${terim.trim().replace(/\s+/g, '+')}`)}>
                      <Text style={styles.etiketYazi}>{terim} ›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
// STYLES
const styles = StyleSheet.create({
  anaKapsayici: { flex: 1, backgroundColor: '#fafafa' },
  header: { height: 90, backgroundColor: '#F27A1A', justifyContent: 'flex-end', paddingBottom: 15, alignItems: 'center', elevation: 5 },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  scrollContainer: { padding: 15, paddingBottom: 50 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, padding: 5, marginBottom: 15, elevation: 1 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  tabAktif: { backgroundColor: '#fff3e0' },
  tabText: { marginLeft: 8, fontWeight: '600', color: '#666' },
  tabTextAktif: { color: '#F27A1A' },
  cinsiyetContainer: { marginBottom: 15 },
  etiketBaslik: { marginBottom: 8, fontWeight: 'bold', color: '#333', marginLeft: 5 },
  radioGroup: { flexDirection: 'row', gap: 10 },
  radioBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  radioAktif: { backgroundColor: '#F27A1A', borderColor: '#F27A1A' },
  radioText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  radioTextAktif: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  girisKutusu: { backgroundColor: 'white', padding: 15, borderRadius: 10, elevation: 2, marginBottom: 20 },
  fotoAlan: { alignItems: 'center', marginVertical: 10 },
  gosterilenResim: { width: 150, height: 200, borderRadius: 8, resizeMode: 'cover' },
  fotoPlaceholder: { width: '100%', height: 120, borderWidth: 2, borderColor: '#eee', borderStyle: 'dashed', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  fotoYazi: { marginTop: 10, color: '#999' },
  linkAlan: { marginVertical: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#f9f9f9', color: '#333' },
  buton: { backgroundColor: '#F27A1A', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  butonPasif: { backgroundColor: '#fabd85' },
  butonYazi: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  sonucAlani: { marginTop: 5 },
  urunOzetKutu: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#F27A1A' },
  urunTanimi: { fontWeight: 'bold', color: '#333' },
  kategoriKart: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 12, elevation: 1 },
  kategoriBaslik: { fontWeight: 'bold', color: '#F27A1A', marginBottom: 10 },
  etiketGrubu: { flexDirection: 'row', flexWrap: 'wrap' },
  etiket: { backgroundColor: '#f5f5f5', padding: 8, paddingHorizontal: 12, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  etiketYazi: { color: '#333', fontSize: 13 },
});