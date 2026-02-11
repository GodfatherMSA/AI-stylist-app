import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#F27A1A' }}>
      
      {/*ASİSTAN*/}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Asistan',
          tabBarIcon: ({ color }) => <Ionicons name="sparkles-outline" size={24} color={color} />,
          headerShown: false,
        }}
      />

      {/*MAĞAZA*/}
      <Tabs.Screen
        name="magaza"
        options={{
          title: 'Mağaza',
          tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={24} color={color} />,
          headerShown: false,
        }}
      />

      {/*SEPETİM */}
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