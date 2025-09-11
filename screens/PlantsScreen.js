import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const plantsData = [
  {
    id: 1,
    name: 'Pomidor',
    scientificName: 'Solanum lycopersicum',
    iconName: 'local-florist',
    iconType: 'MaterialIcons',
    color: ['#FF6B6B', '#EE5A24'],
    season: 'Yay',
    difficulty: 'Orta',
    harvestTime: '75-85 gün',
    description: 'Ən populyar tərəvəz bitkilərindən biri',
    careInfo: {
      planting: 'Mart-May aylarında toxum əkin. Torpaq temperaturu 15-20°C olmalıdır.',
      watering: 'Həftədə 2-3 dəfə bol suvarma. Yarpaqları islatmamağa diqqət edin.',
      fertilizing: 'Hər 2 həftədə bir üzvi gübrə verin. Azot, fosfor və kalium balansı vacibdir.',
      harvesting: 'Meyvələr qırmızı rəngə çatdıqda yığın. Səhər saatlarında yığım daha yaxşıdır.',
      diseases: 'Fitoftora xəstəliyindən qorunmaq üçün havalandırma vacibdir.',
      tips: 'Dayaq çubuqları istifadə edin. Alt yarpaqları kəsin. Mulçlama tətbiq edin.'
    }
  },
  {
    id: 2,
    name: 'Xiyar',
    scientificName: 'Cucumis sativus',
    iconName: 'grass',
    iconType: 'MaterialIcons',
    color: ['#00D2FF', '#3A7BD5'],
    season: 'Yay',
    difficulty: 'Asan',
    harvestTime: '50-70 gün',
    description: 'Sürətli böyüyən və məhsuldar bitki',
    careInfo: {
      planting: 'May ayından sonra açıq sahədə əkin. İsti iqlimi sevir.',
      watering: 'Gündəlik suvarma lazımdır. Kök nahiyəsini nəm saxlayın.',
      fertilizing: 'Həftədə bir dəfə maye gübrə verin. Azotlu gübrələr üstünlük verin.',
      harvesting: 'Kiçik ölçüdə yığın ki, bitki daha çox məhsul versin.',
      diseases: 'Küy xəstəliyindən qorunmaq üçün yarpaqları quru saxlayın.',
      tips: 'Şaquli böyümə üçün dəstək verin. Tez-tez yığım aparın.'
    }
  },
  {
    id: 3,
    name: 'Kələm',
    scientificName: 'Brassica oleracea',
    iconName: 'eco',
    iconType: 'MaterialIcons',
    color: ['#A8E6CF', '#7FCDCD'],
    season: 'Payız',
    difficulty: 'Orta',
    harvestTime: '90-120 gün',
    description: 'Soyuq havaya davamlı qidalı tərəvəz',
    careInfo: {
      planting: 'Avqust-Sentyabr aylarında əkin. Soyuq havada yaxşı böyüyür.',
      watering: 'Mütəmadi suvarma, lakin su dayanmaması vacibdir.',
      fertilizing: 'Azotlu gübrələr erkən mərhələdə, sonra fosfor-kalium gübrələri.',
      harvesting: 'Başlar sıx olduqda yığın. Dondan əvvəl yığımı bitirin.',
      diseases: 'Kələm qurdundan qorunmaq üçün bioloji mübarizə aparın.',
      tips: 'Sərin havada yaxşı böyüyür. Mulçlama istifadə edin.'
    }
  },
  {
    id: 4,
    name: 'Kartof',
    scientificName: 'Solanum tuberosum',
    iconName: 'circle',
    iconType: 'MaterialIcons',
    color: ['#D4A574', '#C7956D'],
    season: 'Bahar',
    difficulty: 'Asan',
    harvestTime: '90-120 gün',
    description: 'Əsas qida məhsulu, saxlanması asan',
    careInfo: {
      planting: 'Mart-Aprel aylarında toxum kartofunu əkin. 10-15 sm dərinlikdə.',
      watering: 'Orta suvarma, çiçəkləmə dövründə daha çox su lazımdır.',
      fertilizing: 'Əkindən əvvəl üzvi gübrə qarışdırın. Azotlu gübrə məhdud verin.',
      harvesting: 'Yarpaqlar saraldıqda yığın. Quru havada yığım aparın.',
      diseases: 'Fitoftora və kartof böcəyindən qorunma tədbirləri görün.',
      tips: 'Torpağı yığın ki, kartoflar yaşıllaşmasın. Fırlanma tətbiq edin.'
    }
  },
  {
    id: 5,
    name: 'Soğan',
    scientificName: 'Allium cepa',
    iconName: 'radio-button-unchecked',
    iconType: 'MaterialIcons',
    color: ['#FFD93D', '#FF8C42'],
    season: 'Bahar',
    difficulty: 'Asan',
    harvestTime: '120-150 gün',
    description: 'Uzun müddət saxlanılan əsas məhsul',
    careInfo: {
      planting: 'Mart ayında soğan şitili əkin. Sıx əkmə, sonra seyrəldin.',
      watering: 'Erkən mərhələdə mütəmadi, yetişmə dövründə azaldın.',
      fertilizing: 'Azotlu gübrə erkən mərhələdə, sonra fosfor-kalium.',
      harvesting: 'Yarpaqlar quruduqda yığın. Günəşdə qurudun.',
      diseases: 'Soğan mildiöründən qorunmaq üçün havalandırma təmin edin.',
      tips: 'Alaq otlarından təmizləyin. Dərin əkmə, soğan kiçik qalar.'
    }
  },
  {
    id: 6,
    name: 'Yerkökü',
    scientificName: 'Daucus carota',
    iconName: 'nature',
    iconType: 'MaterialIcons',
    color: ['#FF8A65', '#FF7043'],
    season: 'Bahar',
    difficulty: 'Orta',
    harvestTime: '70-80 gün',
    description: 'Vitamin A-ya zəngin kök tərəvəzi',
    careInfo: {
      planting: 'Mart-Aprel aylarında birbaşa əkin. İncə toxumları səpələyin.',
      watering: 'Mütəmadi, lakin az suvarma. Çox su kökləri çatladar.',
      fertilizing: 'Az azotlu gübrə. Çox azot yarpaqları böyüdür, kökləri kiçildir.',
      harvesting: 'Kök diametri 2-3 sm olduqda yığın.',
      diseases: 'Kök çürüməsindən qorunmaq üçün drenaj təmin edin.',
      tips: 'Daşlı torpaqda əkmə, köklər əyilər. Seyrəltmə vacibdir.'
    }
  },
  {
    id: 7,
    name: 'Badımcan',
    scientificName: 'Solanum melongena',
    iconName: 'local-florist',
    iconType: 'MaterialIcons',
    color: ['#9C27B0', '#7B1FA2'],
    season: 'Yay',
    difficulty: 'Orta',
    harvestTime: '80-100 gün',
    description: 'İsti iqlim bitkisi, zəngin dad',
    careInfo: {
      planting: 'May ayından sonra əkin. Torpaq temperaturu 18°C-dən yuxarı olmalıdır.',
      watering: 'Mütəmadi suvarma, lakin kök çürüməsinə yol verməyin.',
      fertilizing: 'Azot, fosfor və kalium balansı. Hər 3 həftədə gübrələyin.',
      harvesting: 'Parlaq rəngdə və elastik olduqda yığın.',
      diseases: 'Kolrado böcəyi və fitoftoradan qorunun.',
      tips: 'Dayaq verin. İlk çiçəkləri kəsin ki, bitki güclənsin.'
    }
  },
  {
    id: 8,
    name: 'Bibər',
    scientificName: 'Capsicum annuum',
    iconName: 'whatshot',
    iconType: 'MaterialIcons',
    color: ['#FF5722', '#D84315'],
    season: 'Yay',
    difficulty: 'Orta',
    harvestTime: '70-90 gün',
    description: 'Acı və şirin növləri olan məhsuldar bitki',
    careInfo: {
      planting: 'Aprel-May aylarında şitil əkin. İsti iqlimi sevir.',
      watering: 'Mütəmadi, lakin az suvarma. Çox su acılığı azaldır.',
      fertilizing: 'Kaliumlu gübrələr meyvə keyfiyyətini artırır.',
      harvesting: 'Tam rəngə çatdıqda yığın. Tez-tez yığım aparın.',
      diseases: 'Aphid və thrips-dən qorunmaq üçün bioloji mübarizə.',
      tips: 'Mulçlama tətbiq edin. Güclü küləkdən qoruyun.'
    }
  },
  {
    id: 9,
    name: 'Qarpız',
    scientificName: 'Citrullus lanatus',
    iconName: 'spa',
    iconType: 'MaterialIcons',
    color: ['#4CAF50', '#388E3C'],
    season: 'Yay',
    difficulty: 'Çətin',
    harvestTime: '90-120 gün',
    description: 'Böyük sahə tələb edən şirin meyvə',
    careInfo: {
      planting: 'May ayında birbaşa əkin. Geniş sahə lazımdır.',
      watering: 'Bol suvarma, xüsusən meyvə böyümə dövründə.',
      fertilizing: 'Üzvi gübrə və fosfor-kalium qarışığı istifadə edin.',
      harvesting: 'Quyruq quruduqda və döyəndə boş səs çıxardıqda yığın.',
      diseases: 'Küy xəstəliyi və aphid-dən qorunun.',
      tips: 'Meyvələrin altına taxta qoyun. Suvarmanı yetişmədən əvvəl azaldın.'
    }
  },
  {
    id: 10,
    name: 'Xarbüzə',
    scientificName: 'Cucumis melo',
    iconName: 'filter-vintage',
    iconType: 'MaterialIcons',
    color: ['#FF9800', '#F57C00'],
    season: 'Yay',
    difficulty: 'Çətin',
    harvestTime: '85-110 gün',
    description: 'Şirin və ətirli yay meyvəsi',
    careInfo: {
      planting: 'May ayında əkin. İsti və günəşli yer seçin.',
      watering: 'Mütəmadi suvarma, lakin yarpaqları islatmayın.',
      fertilizing: 'Çiçəkləmədən əvvəl azot, sonra fosfor-kalium.',
      harvesting: 'Ətir verəndə və quyruq asanlıqla ayrıldıqda yığın.',
      diseases: 'Küy xəstəliyi və nematodlardan qorunun.',
      tips: 'Meyvələri döndərin ki, bərabər yetişsin. Mulçlama tətbiq edin.'
    }
  },
  {
    id: 11,
    name: 'Turp',
    scientificName: 'Raphanus sativus',
    iconName: 'radio-button-checked',
    iconType: 'MaterialIcons',
    color: ['#E91E63', '#C2185B'],
    season: 'Bahar-Payız',
    difficulty: 'Asan',
    harvestTime: '25-35 gün',
    description: 'Tez böyüyən və təmizləyici xassəli kök',
    careInfo: {
      planting: 'Mart-Aprel və Avqust-Sentyabr aylarında əkin.',
      watering: 'Mütəmadi suvarma, qurumağa yol verməyin.',
      fertilizing: 'Az gübrə lazımdır. Çox azot yarpaqları böyüdür.',
      harvesting: '2-3 sm diametrə çatdıqda yığın.',
      diseases: 'Kök qurdu və kələm mildiösündən qorunun.',
      tips: 'Sıx əkməyin. Seyrəltmə aparın. Soyuq havada yaxşı böyüyür.'
    }
  },
  {
    id: 12,
    name: 'İspanaq',
    scientificName: 'Spinacia oleracea',
    iconName: 'eco',
    iconType: 'MaterialIcons',
    color: ['#4CAF50', '#2E7D32'],
    season: 'Payız-Qış',
    difficulty: 'Asan',
    harvestTime: '40-50 gün',
    description: 'Dəmir və vitaminlərə zəngin yaşıllıq',
    careInfo: {
      planting: 'Avqust-Oktyabr aylarında əkin. Soyuq havada yaxşı böyüyür.',
      watering: 'Mütəmadi suvarma, torpağı nəm saxlayın.',
      fertilizing: 'Azotlu gübrələr yarpaq inkişafını sürətləndirir.',
      harvesting: 'Böyük yarpaqları kəsin, kiçikləri böyüməyə buraxın.',
      diseases: 'Küy xəstəliyi və aphid-dən qorunun.',
      tips: 'Ardıcıl əkim aparın. Çiçəkləməni gecikdirmək üçün kölgə verin.'
    }
  }
];

const PlantsScreen = ({ navigation }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  const renderPlantCard = (plant) => (
    <TouchableOpacity
      key={plant.id}
      style={styles.plantCard}
      onPress={() => setSelectedPlant(plant)}
    >
      <LinearGradient
        colors={plant.color}
        style={styles.plantCardGradient}
      >
        <View style={styles.plantCardHeader}>
          <View style={styles.plantIconContainer}>
            <MaterialIcons name={plant.iconName} size={40} color="white" />
          </View>
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.plantScientific}>{plant.scientificName}</Text>
          </View>
        </View>
        
        <View style={styles.plantDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={16} color="white" />
            <Text style={styles.detailText}>{plant.harvestTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="leaf" size={16} color="white" />
            <Text style={styles.detailText}>{plant.season}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="trending-up" size={16} color="white" />
            <Text style={styles.detailText}>{plant.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.plantDescription}>{plant.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPlantDetail = () => (
    <ScrollView style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <LinearGradient
          colors={selectedPlant.color}
          style={styles.detailHeaderGradient}
        >
          <TouchableOpacity
            style={styles.detailBackButton}
            onPress={() => setSelectedPlant(null)}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.detailPlantIconContainer}>
            <MaterialIcons name={selectedPlant.iconName} size={60} color="white" />
          </View>
          <Text style={styles.detailPlantName}>{selectedPlant.name}</Text>
          <Text style={styles.detailPlantScientific}>{selectedPlant.scientificName}</Text>
        </LinearGradient>
      </View>

      <View style={styles.careInfoContainer}>
        <View style={styles.careSection}>
          <View style={styles.careSectionHeader}>
            <FontAwesome5 name="seedling" size={20} color="#2E7D32" />
            <Text style={styles.careSectionTitle}>Əkim</Text>
          </View>
          <Text style={styles.careSectionText}>{selectedPlant.careInfo.planting}</Text>
        </View>

        <View style={styles.careSection}>
          <View style={styles.careSectionHeader}>
            <MaterialIcons name="water-drop" size={20} color="#2196F3" />
            <Text style={styles.careSectionTitle}>Suvarma</Text>
          </View>
          <Text style={styles.careSectionText}>{selectedPlant.careInfo.watering}</Text>
        </View>

        <View style={styles.careSection}>
          <View style={styles.careSectionHeader}>
            <MaterialIcons name="eco" size={20} color="#4CAF50" />
            <Text style={styles.careSectionTitle}>Gübrələmə</Text>
          </View>
          <Text style={styles.careSectionText}>{selectedPlant.careInfo.fertilizing}</Text>
        </View>

        <View style={styles.careSection}>
          <View style={styles.careSectionHeader}>
            <MaterialIcons name="agriculture" size={20} color="#FF9800" />
            <Text style={styles.careSectionTitle}>Yığım</Text>
          </View>
          <Text style={styles.careSectionText}>{selectedPlant.careInfo.harvesting}</Text>
        </View>

        <View style={styles.careSection}>
          <View style={styles.careSectionHeader}>
            <MaterialIcons name="healing" size={20} color="#F44336" />
            <Text style={styles.careSectionTitle}>Xəstəliklər</Text>
          </View>
          <Text style={styles.careSectionText}>{selectedPlant.careInfo.diseases}</Text>
        </View>

        <View style={styles.careSection}>
          <View style={styles.careSectionHeader}>
            <MaterialIcons name="lightbulb" size={20} color="#9C27B0" />
            <Text style={styles.careSectionTitle}>Məsləhətlər</Text>
          </View>
          <Text style={styles.careSectionText}>{selectedPlant.careInfo.tips}</Text>
        </View>
      </View>
    </ScrollView>
  );

  if (selectedPlant) {
    return (
      <SafeAreaView style={styles.container}>
        {renderPlantDetail()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32', '#1B5E20']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <FontAwesome5 name="seedling" size={24} color="white" />
            <Text style={styles.headerTitle}>Bitki Bələdçisi</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Bitkilərin baxımı və yetişdirilməsi</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Populyar Bitkilər</Text>
          <Text style={styles.sectionSubtitle}>
            Bitki üzərinə basaraq ətraflı baxım məlumatlarını öyrənin
          </Text>
          
          <View style={styles.plantsGrid}>
            {plantsData.map(renderPlantCard)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  detailBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    lineHeight: 22,
  },
  plantsGrid: {
    gap: 15,
  },
  plantCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
  },
  plantCardGradient: {
    padding: 20,
  },
  plantCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  plantIconContainer: {
    marginRight: 15,
    padding: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  plantScientific: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  plantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detailText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  plantDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    position: 'relative',
  },
  detailHeaderGradient: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  detailPlantIconContainer: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  detailPlantName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  detailPlantScientific: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  careInfoContainer: {
    padding: 20,
  },
  careSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  careSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  careSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  careSectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});

export default PlantsScreen;
