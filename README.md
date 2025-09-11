# Fermerin Dostu - AI-Powered Soil Analysis App

Bu app fermerlər üçün hazırlanmış AI əsaslı torpaq analizi tətbiqidir. Expo SDK 54 və React Native istifadə edərək hazırlanmışdır.

## Xüsusiyyətlər

- 🔐 Firebase Authentication (Giriş/Qeydiyyat)
- 📸 Kamera və Qalereya dəstəyi
- 🤖 OpenAI GPT-4 Vision ilə torpaq analizi
- 🌱 Əkin tövsiyələri və torpaq məsləhətləri
- 📱 Android və iOS dəstəyi

## Quraşdırma

1. Layihəni klonlayın və dependencies quraşdırın:
```bash
npm install
```

2. Expo CLI quraşdırın (əgər yoxdursa):
```bash
npm install -g @expo/cli
```

3. Firebase layihəsini konfiqurasiya edin:
   - Firebase Console-da yeni layihə yaradın
   - Authentication aktivləşdirin (Email/Password)
   - `firebaseConfig.js` faylında konfiqurasiya məlumatlarını yeniləyin

4. OpenAI API açarını konfigurasiya edin:
   - `services/openaiService.js` faylında API açarını yeniləyin

## İstifadə

1. Tətbiqi başladın:
```bash
npx expo start
```

2. Expo Go tətbiqini telefonunuza yükləyin
3. QR kodu skan edin və ya emulator istifadə edin

## Struktur

```
├── screens/
│   ├── LoginScreen.js      # Giriş ekranı
│   ├── RegisterScreen.js   # Qeydiyyat ekranı
│   └── HomeScreen.js       # Ana səhifə (Torpaq analizi)
├── services/
│   └── openaiService.js    # OpenAI API inteqrasiyası
├── firebaseConfig.js       # Firebase konfiqurasiyası
├── App.js                  # Ana komponent
└── package.json           # Dependencies

```

## Texnologiyalar

- **Expo SDK 54**
- **React Native**
- **Firebase Authentication**
- **OpenAI GPT-4 Vision API**
- **React Navigation**
- **Expo Image Picker**
- **Expo Camera**

## API Açarları

Təhlükəsizlik üçün API açarlarını environment variables kimi saxlayın:

1. `.env` faylı yaradın
2. API açarlarını əlavə edin
3. Production-da environment variables istifadə edin

## Lisenziya

Bu layihə MIT lisenziyası altındadır.
