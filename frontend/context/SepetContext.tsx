import React, { createContext, useState, useContext } from 'react';

// Sepetteki ürünün kimliği
export interface Urun {
  id: string;
  resim: string; // URL veya base64
  baslik: string; // "Mavi Baggy Jean" vb.
  fiyat: number; // Rastgele fiyat ekleriz havalı dursun
  öneriler: any[]; // Yapay zekadan gelen o meşhur liste
}

interface SepetContextType {
  sepet: Urun[];
  sepeteEkle: (urun: Urun) => void;
  sepettenCikar: (id: string) => void;
}

const SepetContext = createContext<SepetContextType | undefined>(undefined);

export const SepetProvider = ({ children }: { children: React.ReactNode }) => {
  const [sepet, setSepet] = useState<Urun[]>([]);

  const sepeteEkle = (urun: Urun) => {
    setSepet([...sepet, urun]);
  };

  const sepettenCikar = (id: string) => {
    setSepet(sepet.filter((item) => item.id !== id));
  };

  return (
    <SepetContext.Provider value={{ sepet, sepeteEkle, sepettenCikar }}>
      {children}
    </SepetContext.Provider>
  );
};

export const useSepet = () => {
  const context = useContext(SepetContext);
  if (!context) throw new Error("useSepet, SepetProvider içinde kullanılmalı!");
  return context;
};