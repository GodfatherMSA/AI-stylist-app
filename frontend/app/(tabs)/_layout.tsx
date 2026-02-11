import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F27A1A' }}>
      
      {/* 1. ASİSTAN (ESKİ HOME) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Asistan',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" size={24} color={color} />,
          headerShown: false,
        }}
      />

      {/* 2. MAĞAZA (YENİ VİTRİN) */}
      <Tabs.Screen
        name="magaza"
        options={{
          title: 'Mağaza',
          tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={24} color={color} />,
          headerShown: false,
        }}
      />

      {/* 3. SEPETİM */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Sepetim',
          tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}