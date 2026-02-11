import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useSepet } from '../../context/SepetContext';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { sepet, sepettenCikar } = useSepet();

  if (sepet.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>Sepetin Henüz Boş</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Sepetim ({sepet.length})</Text>

      {sepet.map((urun) => (
        <View key={urun.id} style={styles.cartItem}>
          
          {/* ÜRÜN BİLGİSİ */}
          <View style={styles.productRow}>
            {/* ↓↓↓ DÜZELTME BURADA YAPILDI ↓↓↓ */}
            <Image 
              source={typeof urun.resim === 'string' ? { uri: urun.resim } : urun.resim} 
              style={styles.image} 
            />
            {/* ↑↑↑ ARTIK HEM LİNK HEM YEREL DOSYA ÇALIŞIR ↑↑↑ */}

            <View style={styles.info}>
              <Text style={styles.title}>{urun.baslik}</Text>
              <Text style={styles.price}>{urun.fiyat} TL</Text>
            </View>
            <TouchableOpacity onPress={() => sepettenCikar(urun.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>

          {/* ✨ YAPAY ZEKA ÖNERİLERİ (Burası Sihirli Kısım) */}
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={16} color="#8a2be2" />
              <Text style={styles.aiTitle}>AI Stilist Önerileri</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationList}>
              {urun.öneriler && urun.öneriler.map((kategori: any, index: number) => (
                <View key={index} style={{flexDirection: 'row'}}>
                   {kategori.arama_terimleri.map((terim: string, i: number) => (
                      <TouchableOpacity 
                        key={i} 
                        style={styles.recCard}
                        onPress={() => Linking.openURL(`https://www.trendyol.com/sr?q=${terim}`)}
                      >
                        <View style={styles.recIconBadge}>
                            <Ionicons name="search" size={12} color="white" />
                        </View>
                        <Text style={styles.recText}>{terim}</Text>
                        <Text style={styles.recSubText}>Tamamla ›</Text>
                      </TouchableOpacity>
                   ))}
                </View>
              ))}
            </ScrollView>
          </View>

        </View>
      ))}
      
      <View style={{height: 50}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyText: { marginTop: 10, fontSize: 18, color: '#999' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#333' },
  
  cartItem: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20, elevation: 3 },
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  image: { width: 70, height: 100, borderRadius: 8, resizeMode: 'cover' },
  info: { flex: 1, marginLeft: 15 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  price: { fontSize: 16, color: '#F27A1A', fontWeight: 'bold' },

  aiSection: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aiTitle: { fontSize: 14, fontWeight: 'bold', color: '#8a2be2', marginLeft: 5 },
  recommendationList: { flexDirection: 'row' },
  
  recCard: { 
    backgroundColor: '#f3e5f5', 
    width: 120, 
    height: 80, 
    borderRadius: 8, 
    padding: 10, 
    marginRight: 10, 
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e1bee7'
  },
  recIconBadge: { position: 'absolute', right: 5, top: 5, backgroundColor: '#8a2be2', borderRadius: 10, padding: 3 },
  recText: { fontSize: 11, color: '#4a148c', fontWeight: '600' },
  recSubText: { fontSize: 10, color: '#8a2be2', alignSelf: 'flex-end' }
});