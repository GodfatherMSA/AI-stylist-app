import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useSepet } from '../../context/SepetContext'; 
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen() {
  const { sepet, sepettenCikar } = useSepet();

  const toplamTutar = sepet.reduce((total, urun) => {
    const fiyatSayi = parseFloat(urun.fiyat.toString().replace(' TL', '').replace('.', '').replace(',', '.'));
    return total + (isNaN(fiyatSayi) ? 0 : fiyatSayi);
  }, 0);

  const siparisiTamamla = () => {
    Alert.alert("Sipariş Alındı 🚀", "Demo siparişiniz başarıyla oluşturuldu!");
  }

  if (sepet.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={60} color="#F27A1A" />
        </View>
        <Text style={styles.emptyTitle}>Sepetin Henüz Boş</Text>
        <Text style={styles.emptyText}>Hemen alışverişe başla, stilini yakala!</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
        {/* HEADER */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Sepetim</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{sepet.length} Ürün</Text>
            </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: 120}}>
        
        {sepet.map((urun, index) => (
            <View key={`${urun.id}-${index}`} style={styles.cartItem}>
            
            {}
            <View style={styles.productRow}>
                <Image 
                source={typeof urun.resim === 'string' ? { uri: urun.resim } : urun.resim} 
                style={styles.image} 
                />

                <View style={styles.info}>
                    <Text style={styles.brand}>TrendyolMilla</Text> 
                    <Text style={styles.title} numberOfLines={2}>{urun.baslik}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{urun.fiyat}</Text>
                        {}
                        <TouchableOpacity style={styles.deleteButton} onPress={() => sepettenCikar(urun.id)}>
                            <Ionicons name="trash-outline" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {}
            {urun.öneriler && urun.öneriler.length > 0 && (
                <View style={styles.aiSection}>
                    <View style={styles.aiHeader}>
                        <Ionicons name="sparkles" size={14} color="#8a2be2" />
                        <Text style={styles.aiTitle}>AI Stilist: "Bunu şunlarla tamamla"</Text>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationList}>
                    {urun.öneriler.map((kategori: any, kIndex: number) => (
                        <View key={kIndex} style={{flexDirection: 'row'}}>
                            {kategori.arama_terimleri.map((terim: string, tIndex: number) => (
                                <TouchableOpacity 
                                    key={tIndex} 
                                    style={styles.recCard}
                                    onPress={() => Linking.openURL(`https://www.trendyol.com/sr?q=${terim}`)}
                                >
                                    <View style={styles.recContent}>
                                        <Text style={styles.recText} numberOfLines={2}>{terim}</Text>
                                        <View style={styles.recArrow}>
                                            <Ionicons name="arrow-forward" size={12} color="#fff" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                    </ScrollView>
                </View>
            )}

            </View>
        ))}
        </ScrollView>

        {}
        <View style={styles.footer}>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Toplam Tutar</Text>
                <Text style={styles.totalPrice}>{toplamTutar.toLocaleString('tr-TR')} TL</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={siparisiTamamla}>
                <Text style={styles.checkoutText}>Sepeti Onayla</Text>
                <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    marginTop: 10
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  badge: { 
    backgroundColor: '#FFF3E0', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 10, 
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  badgeText: { fontSize: 12, color: '#F27A1A', fontWeight: 'bold' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  emptyIconCircle: { 
    width: 100, height: 100, backgroundColor: '#FFF3E0', borderRadius: 50, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20 
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  emptyText: { marginTop: 10, fontSize: 16, color: '#999' },

  scrollView: { flex: 1, padding: 15 },
  
  cartItem: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 12, 
    marginBottom: 20, 
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  productRow: { flexDirection: 'row', marginBottom: 15 },
  image: { width: 80, height: 110, borderRadius: 10, resizeMode: 'cover', backgroundColor: '#f9f9f9' },
  info: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 2 },
  brand: { fontSize: 12, color: '#999', fontWeight: '600' },
  title: { fontSize: 14, fontWeight: '600', color: '#333', lineHeight: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, color: '#F27A1A', fontWeight: 'bold' },
  deleteButton: { padding: 5 },

  aiSection: { 
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aiTitle: { fontSize: 13, fontWeight: 'bold', color: '#8a2be2', marginLeft: 6 },
  recommendationList: { flexDirection: 'row' },
  
  recCard: { 
    backgroundColor: '#FFFFFF', 
    width: 130, 
    height: 70, 
    borderRadius: 10, 
    padding: 10, 
    marginRight: 10, 
    borderWidth: 1,
    borderColor: '#E1BEE7',
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recContent: { flex: 1, justifyContent: 'space-between' },
  recText: { fontSize: 12, color: '#4a148c', fontWeight: '600' },
  recArrow: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#8a2be2', 
    borderRadius: 10, 
    width: 20, 
    height: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  footer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: '#666', fontWeight: '500' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  
  checkoutButton: {
    backgroundColor: '#F27A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#F27A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 5 }
});