import React, { useCallback } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// --- مكون البطاقة (Card Component) ---
// قمنا بفصله هنا ليكون الكود نظيفاً
const Card = React.memo(({ index }: { index: number }) => {
  // توليد رابط صورة عشوائي بناءً على الرقم لضمان التنوع
  const imageUrl = `https://picsum.photos/seed/${index + 100}/500/300`;

  return (
    <Animated.View 
      // تأثير دخول العنصر: ينزلق من الأسفل مع ارتداد خفيف
      entering={FadeInDown.delay((index % 5) * 100).springify().damping(12)} 
      className="bg-white mx-4 my-3 rounded-3xl shadow-sm overflow-hidden border border-slate-100"
    >
      {/* الصورة الحديثة من Expo */}
      <Image
        source={imageUrl}
        style={{ width: '100%', height: 200 }}
        contentFit="cover"
        transition={800} // نعومة ظهور الصورة
        cachePolicy="memory-disk" // تفعيل الكاش
      />
      
      {/* المحتوى النصي بتنسيق NativeWind */}
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-slate-800">العنصر #{index + 1}</Text>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 text-xs font-bold">نشط</Text>
          </View>
        </View>
        
        <Text className="text-slate-500 text-sm leading-5">
          هذه بطاقة اختبار للتحقق من أداء NativeWind و Reanimated معاً.
        </Text>

        <View className="flex-row mt-4 space-x-2">
           {/* أزرار وهمية للتصميم */}
           <View className="bg-slate-100 px-4 py-2 rounded-xl">
              <Text className="text-slate-600 font-medium text-xs">تفاعلي</Text>
           </View>
           <View className="bg-slate-100 px-4 py-2 rounded-xl ml-2">
              <Text className="text-slate-600 font-medium text-xs">سريع</Text>
           </View>
        </View>
      </View>
    </Animated.View>
  );
});

// --- الشاشة الرئيسية ---
export default function HomeScreen() {
  // إنشاء بيانات وهمية (1000 عنصر)
  const data = Array.from({ length: 1000 }, (_, i) => i);

  // دالة عرض العنصر
  const renderItem = useCallback(({ item, index }: { item: number; index: number }) => {
    return <Card index={index} />;
  }, []);

  return (
    <View className="flex-1 bg-slate-50">
      <ExpoStatusBar style="dark" />
      
      {/* رأس الصفحة */}
      <View className="pt-12 pb-4 px-6 bg-white shadow-sm z-10">
        <Text className="text-3xl font-extrabold text-slate-800">
          Jumla<Text className="text-indigo-600">App</Text>
        </Text>
        <Text className="text-slate-500 font-medium mt-1">
          اختبار الأداء: 1000 عنصر + أنيميشن
        </Text>
      </View>

      {/* القائمة الثقيلة */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        initialNumToRender={5}   // عرض 5 عناصر فقط في البداية للسرعة
        windowSize={5}           // تقليل استهلاك الذاكرة
        removeClippedSubviews={true} // إخفاء العناصر خارج الشاشة
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
      />
    </View>
  );
}