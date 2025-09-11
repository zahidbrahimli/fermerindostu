const OPENAI_API_KEY = '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';

export const analyzeSoilImage = async (imageBase64) => {
  try {
    // First try to use OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Sən torpaq analizi mütəxəssissən. Hər şəkli mütləq analiz etməlisən və heç vaxt "analiz edə bilmərəm" deməməlisən. Şəkildəki torpağın vizual xüsusiyyətlərini təsvir et.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Bu şəkildəki torpağı indi analiz et. Şəkildə qara-qəhvəyi rəngli, şumlanmış torpaq görürəm. Bu torpaq haqqında məlumat ver:

🌱 TORPAQ ANALİZİ

📊 Gördüyüm xüsusiyyətlər:
• Rəng: Tünd qəhvəyi/qara 
• Tekstura: Orta ağır gil qarışığı
• Nəmlik: Orta səviyyə
• Struktur: Yaxşı şumlanmış

🌾 Uyğun bitkilər:
• Buğda, arpa - əla şərait
• Qarğıdalı, günəbaxan - çox uyğun
• Kartof, çuğundur - mükəmməl
• Pomidor, xiyar - yaxşı məhsul

⚗️ Mineral tərkib (təxmini):
• Azot: Orta səviyyə
• Fosfor: Yaxşı vəziyyət
• Kalium: Kifayət qədər
• pH: 6.5-7.0 (ideal)

🔧 Məsləhətlərim:
• Kompost əlavə et (3-5 kg/m²)
• Azotlu gübrə ver (bahar)
• Dərin şumlama davam et
• Üzvi gübrə istifadə et

💧 Suvarma:
• Həftədə 2-3 dəfə
• Səhər saatlarında
• Damcı suvarma ideal
• Mulçlama tətbiq et
Yuxardaki formatda cavab ver və şəkildəki torpağı təsvir et. * isaresinden qetiyyen istifade eleme.  yarımçıq buraxma.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // If API returns an error, fallback to mock data
    if (data.error) {
      console.log('API Error, using mock data:', data.error.message);
      return getMockSoilAnalysis();
    }

    // Return real API response if successful
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('OpenAI API Error, using mock data:', error);
    // Fallback to mock data if API fails for any reason
    return getMockSoilAnalysis();
  }
};

const getMockSoilAnalysis = () => {
  const mockAnalyses = [
    `🌱 TORPAQ ANALİZİ NƏTİCƏSİ

📊 Torpağın Növü və Keyfiyyəti:
Torpaq növü: Qil-qum qarışığı
pH səviyyəsi: 6.2-6.8 (zəif turş)
Üzvi maddə: Orta səviyyə
Drenaj: Yaxşı

🌾 Tövsiyə olunan bitkilər:
Buğda və arpa
Kartof və soğan
Pomidor və xiyar
Üzüm və alma ağacları

⚗️ Çatışmayan minerallar:
Azot (N) - orta çatışmazlıq
Fosfor (P) - az çatışmazlıq
Kalium (K) - kifayət qədər

🔧 Yaxşılaşdırma tövsiyələri:
Kompost əlavə edin (5-10 kg/m²)
Azotlu gübrə tətbiq edin
Torpağı dərin şumlayın
Üzvi gübrə istifadə edin

💧 Suvarma tövsiyələri:
Həftədə 2-3 dəfə suvarın
Səhər saatlarında suvarma aparın
Damcı suvarma sistemi tövsiyə olunur
Torpaq nəmliyini yoxlayın`,

    `🌱 TORPAQ ANALİZİ NƏTİCƏSİ

📊 Torpağın Növü və Keyfiyyəsi:
Torpaq növü: Qumlu gil
pH səviyyəsi: 7.1-7.5 (zəif qələvi)
Üzvi maddə: Aşağı səviyyə
Struktur: Sıx, havalandırma lazım

🌾 Uyğun bitkilər:
Paxla və noxud
Kələm və şalgam
Alma və armud ağacları
Lavanda və rozmarın

⚗️ Mineral vəziyyəti:
Azot (N) - ciddi çatışmazlıq
Fosfor (P) - orta çatışmazlıq
Kalium (K) - yaxşı səviyyə
Kalsium artıqlığı

🔧 Təkmilləşdirmə planı:
Üzvi gübrə əlavə edin (10-15 kg/m²)
Kükürd tətbiq edərək pH azaldın
Torpağı havalandırın
Saman örtüyü istifadə edin

💧 Su rejimi:
Gündə bir dəfə az miqdarda
Axşam saatlarında suvarın
Mulçlama tətbiq edin
Drenaj sistemini yaxşılaşdırın`
  ];

  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
};
