import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

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
      {}
      <View style={styles.header}>
        <Text style={styles.headerText}>Kombinle</Text>
        <Text style={styles.subHeaderText}>Stilini Keşfet</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabButton, mod === 'foto' && styles.tabAktif]} onPress={() => setMod('foto')}>
            <Ionicons name="camera-outline" size={20} color={mod === 'foto' ? '#F27A1A' : '#999'} />
            <Text style={[styles.tabText, mod === 'foto' && styles.tabTextAktif]}>Fotoğraf</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, mod === 'link' && styles.tabAktif]} onPress={() => setMod('link')}>
            <Ionicons name="link-outline" size={20} color={mod === 'link' ? '#F27A1A' : '#999'} />
            <Text style={[styles.tabText, mod === 'link' && styles.tabTextAktif]}>Link</Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.cinsiyetContainer}>
            <Text style={styles.etiketBaslik}>Kime Bakıyoruz?</Text>
            <View style={styles.radioGroup}>
                <TouchableOpacity style={[styles.radioBtn, cinsiyet === 'Kadin' && styles.radioAktif]} onPress={() => setCinsiyet('Kadin')}>
                    <Text style={cinsiyet === 'Kadin' ? styles.radioTextAktif : styles.radioText}>Kadın</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.radioBtn, cinsiyet === 'Erkek' && styles.radioAktif]} onPress={() => setCinsiyet('Erkek')}>
                    <Text style={cinsiyet === 'Erkek' ? styles.radioTextAktif : styles.radioText}>Erkek</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.radioBtn, cinsiyet === 'Cocuk' && styles.radioAktif]} onPress={() => setCinsiyet('Cocuk')}>
                    <Text style={cinsiyet === 'Cocuk' ? styles.radioTextAktif : styles.radioText}>Çocuk</Text>
                </TouchableOpacity>
            </View>
        </View>

        {}
        <View style={styles.girisKutusu}>
            {mod === 'foto' ? (
                <TouchableOpacity onPress={fotografSec} style={styles.fotoAlan}>
                    {image ? 
                        <Image source={{ uri: image }} style={styles.gosterilenResim} /> 
                        : 
                        <View style={styles.fotoPlaceholder}>
                            <Ionicons name="cloud-upload-outline" size={50} color="#F27A1A" />
                            <Text style={styles.fotoYazi}>Fotoğraf Yüklemek İçin Dokun</Text>
                        </View>
                    }
                </TouchableOpacity>
            ) : (
                <View style={styles.linkAlan}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Trendyol ürün linkini buraya yapıştır..." 
                        placeholderTextColor="#999"
                        value={linkInput} 
                        onChangeText={setLinkInput} 
                        autoCapitalize="none" 
                    />
                </View>
            )}
            
            <TouchableOpacity style={[styles.buton, yukleniyor && styles.butonPasif]} onPress={() => analiziBaslat(cinsiyet)} disabled={yukleniyor}>
                {yukleniyor ? <ActivityIndicator color="white" /> : <Text style={styles.butonYazi}>✨ Kombin Önerisi Al</Text>}
            </TouchableOpacity>
        </View>

        {}
        {analizVerisi && analizVerisi.oneri_kategorileri ? ( 
          <View style={styles.sonucAlani}>
            <View style={styles.urunOzetKutu}>
                <Ionicons name="shirt-outline" size={24} color="#F27A1A" style={{marginRight: 10}}/>
                <Text style={styles.urunTanimi}>Analiz: {analizVerisi.secilen_urun}</Text>
            </View>
            
            {analizVerisi.oneri_kategorileri.map((kategori: any, index: number) => (
              <View key={index} style={styles.kategoriKart}>
                <Text style={styles.kategoriBaslik}>{kategori.baslik}</Text>
                <View style={styles.etiketGrubu}>
                  {kategori.arama_terimleri.map((terim: string, i: number) => (
                    <TouchableOpacity key={i} style={styles.etiket} onPress={() => Linking.openURL(`https://www.trendyol.com/sr?q=${terim.trim().replace(/\s+/g, '+')}`)}>
                      <Text style={styles.etiketYazi}>{terim}</Text>
                      <Ionicons name="chevron-forward" size={12} color="#666" style={{marginLeft: 4}}/>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {}
        <Image
            source={{ uri: 'https://cdn.dsmcdn.com/web/production/trendyol-logo-large.svg' }}
            style={styles.bottomLogo}
            resizeMode="contain"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  anaKapsayici: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  header: { 
    height: 100, 
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end', 
    paddingBottom: 15, 
    alignItems: 'center', 
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 0
  },
  headerText: { 
    color: '#F27A1A',
    fontSize: 24, 
    fontWeight: 'bold',
    letterSpacing: 1
  },
  subHeaderText: {
    color: '#999',
    fontSize: 12,
    marginTop: 2
  },
  scrollContainer: { 
    padding: 20, 
    paddingBottom: 50 
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F7F7F7',
    borderRadius: 12, 
    padding: 4, 
    marginBottom: 20, 
  },
  tabButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    borderRadius: 10 
  },
  tabAktif: { 
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { 
    marginLeft: 8, 
    fontWeight: '600', 
    color: '#999',
    fontSize: 14
  },
  tabTextAktif: { 
    color: '#F27A1A'
  },
  cinsiyetContainer: { 
    marginBottom: 20 
  },
  etiketBaslik: { 
    marginBottom: 10, 
    fontWeight: 'bold', 
    color: '#333', 
    marginLeft: 5,
    fontSize: 16
  },
  radioGroup: { 
    flexDirection: 'row', 
    gap: 12 
  },
  radioBtn: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 12, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#EEEEEE' 
  },
  radioAktif: { 
    backgroundColor: '#FFF3E0',
    borderColor: '#F27A1A' 
  },
  radioText: { 
    color: '#666', 
    fontWeight: '600', 
    fontSize: 14 
  },
  radioTextAktif: { 
    color: '#F27A1A',
    fontWeight: 'bold', 
    fontSize: 14 
  },
  girisKutusu: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 15, 
    marginBottom: 25,
  },
  fotoAlan: { 
    alignItems: 'center', 
    marginVertical: 10 
  },
  gosterilenResim: { 
    width: '100%', 
    height: 300, 
    borderRadius: 15, 
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  fotoPlaceholder: { 
    width: '100%', 
    height: 150, 
    borderWidth: 2, 
    borderColor: '#F27A1A',
    borderStyle: 'dashed', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFCF9'
  },
  fotoYazi: { 
    marginTop: 10, 
    color: '#F27A1A',
    fontWeight: '500' 
  },
  linkAlan: { 
    marginVertical: 15 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 12, 
    padding: 15, 
    backgroundColor: '#FAFAFA', 
    color: '#333',
    fontSize: 15
  },
  buton: { 
    backgroundColor: '#F27A1A', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  butonPasif: { 
    backgroundColor: '#FFCCAA' 
  },
  butonYazi: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  sonucAlani: { 
    marginTop: 10 
  },
  urunOzetKutu: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15, 
    backgroundColor: '#FFF3E0',
    borderRadius: 12, 
    marginBottom: 20, 
    borderLeftWidth: 0
  },
  urunTanimi: { 
    fontWeight: 'bold', 
    color: '#E65100',
    fontSize: 16
  },
  kategoriKart: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  kategoriBaslik: { 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 12,
    fontSize: 16
  },
  etiketGrubu: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  etiket: { 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    marginRight: 8, 
    marginBottom: 8, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center'
  },
  etiketYazi: { 
    color: '#555', 
    fontSize: 13,
    fontWeight: '500'
  },
  bottomLogo: {
      width: 100,
      height: 40,
      alignSelf: 'center',
      marginTop: 20,
      opacity: 0.5
  }
});