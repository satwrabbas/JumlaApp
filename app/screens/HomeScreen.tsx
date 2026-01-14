import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown } from 'react-native-reanimated';

// تعريف نوع المنتج (Type Safety)
type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock_quantity: number;
};

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      // جلب المنتجات (الأحدث أولاً)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error:', error.message);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // تصميم بطاقة المنتج
  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden m-2 flex-1 h-64"
    >
      {/* صورة المنتج */}
      <View className="h-40 bg-slate-50 w-full relative">
        <Image
          source={item.image_url ? { uri: item.image_url } : require('../assets/placeholder.png')} // تأكد من وجود صورة بديلة أو سيظهر فارغاً إذا لم يوجد صورة
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={500}
        />
        {/* شارة السعر */}
        <View className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-lg">
          <Text className="text-white font-bold text-xs">{item.price} ر.س</Text>
        </View>
      </View>

      {/* تفاصيل المنتج */}
      <View className="p-3 justify-between flex-1">
        <Text className="text-slate-800 font-bold text-sm text-right" numberOfLines={2}>
          {item.name}
        </Text>
        
        <View className="flex-row justify-between items-center mt-2">
          <View className="bg-green-100 px-2 py-1 rounded-md">
            <Text className="text-green-700 text-[10px] font-bold">متوفر: {item.stock_quantity}</Text>
          </View>
          <Text className="text-slate-400 text-xs">إضافة +</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-slate-50 pt-12 px-2">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-3 mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-extrabold text-slate-800">
            المنتجات <Text className="text-indigo-600">الجديدة</Text>
          </Text>
          <Text className="text-slate-500 text-xs">
            تم التحديث للتو من لوحة التحكم
          </Text>
        </View>
        {/* زر تحديث يدوي */}
        <Text onPress={fetchProducts} className="text-indigo-600 font-bold">تحديث ↻</Text>
      </View>

      {/* Grid List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" className="mt-20" />
      ) : (
        <View className="flex-1 w-full h-full">
           <FlashList
             data={products}
             renderItem={renderProduct}
             estimatedItemSize={200}
             numColumns={2} // عرض شبكي (عمودين)
             contentContainerStyle={{ paddingBottom: 20 }}
             ListEmptyComponent={
               <Text className="text-center text-slate-400 mt-20">لا توجد منتجات.</Text>
             }
           />
        </View>
      )}
    </View>
  );
}