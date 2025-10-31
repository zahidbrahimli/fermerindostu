import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AI Assistant floating button state
  const pan = useRef(new Animated.ValueXY()).current;
  const [buttonPosition, setButtonPosition] = useState({ x: width - 80, y: height - 120 });

  // Create PanResponder for draggable button
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        
        let newX = gestureState.moveX - 30;
        let newY = gestureState.moveY - 30;
        
        if (newX < 10) newX = 10;
        if (newX > width - 70) newX = width - 70;
        if (newY < 50) newY = 50;
        if (newY > height - 100) newY = height - 100;
        
        Animated.spring(pan, {
          toValue: { x: newX - buttonPosition.x, y: newY - buttonPosition.y },
          useNativeDriver: false,
        }).start();
        
        setButtonPosition({ x: newX, y: newY });
      },
    })
  ).current;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Xəta', 'Çıxış zamanı xəta baş verdi');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İcazə tələb olunur', 'Şəkil seçmək üçün qalereya icazəsi lazımdır');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setAnalysis('');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('İcazə tələb olunur', 'Şəkil çəkmək üçün kamera icazəsi lazımdır');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setAnalysis('');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Xəta', 'Zəhmət olmasa əvvəlcə şəkil seçin');
      return;
    }

    setLoading(true);
    try {
      // OpenAI API çağrısı
      const OPENAI_API_KEY = 'YOUR_API_KEY_HERE'; // API açarını dəyişin
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content: 'Sen peşəkar kənd təsərrüfatı agronomi. Şəkillərdən torpaq tipini, bitkiləri və problemləri tanı.',
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Bu torpaq şəklini analiz et. Torpaq tipi, pH, rütubət və gübrə tövsiyəsi ver (Azərbaycanca).',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${selectedImage.base64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const result = data.choices[0].message.content;
        setAnalysis(result);
        console.log('🖼️ TORPAq ŞƏKIL ANALİZİ:', result);
      } else {
        throw new Error('API cavabı yanlış format');
      }
    } catch (error) {
      console.error('Analiz xətası:', error);
      Alert.alert('Analiz Xətası', error.message || 'Şəkil analiz edilə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32', '#1B5E20']}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="leaf" size={32} color="white" style={styles.headerIcon} />
              <Text style={styles.mainTitle}>Fermerin Dostu</Text>
            </View>
            <Text style={styles.subtitle}>AI Torpaq Analizi</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeTitleContainer}>
              <FontAwesome5 name="seedling" size={24} color="#2E7D32" />
              <Text style={styles.welcomeTitle}>Torpaq Analizinə Xoş Gəlmisiniz</Text>
            </View>
            <Text style={styles.welcomeText}>Torpağınızın şəklini çəkin və AI ilə peşəkar analiz alın</Text>
          </View>
          
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Torpaq Analizi</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modernButton} onPress={takePhoto}>
                <LinearGradient
                  colors={['#FF9800', '#F57C00']}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="camera-alt" size={24} color="white" />
                  <Text style={styles.buttonText}>Kamera</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modernButton} onPress={pickImage}>
                <LinearGradient
                  colors={['#2196F3', '#1976D2']}
                  style={styles.buttonGradient}
                >
                  <MaterialIcons name="photo-library" size={24} color="white" />
                  <Text style={styles.buttonText}>Qalereya</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Xidmətlər</Text>
            
            <TouchableOpacity
              style={styles.serviceCardFull}
              onPress={() => navigation.navigate('Calendar')}
            >
              <LinearGradient
                colors={['#FF9800', '#F57C00', '#E65100']}
                style={styles.serviceCardFullGradient}
              >
                <View style={styles.serviceIconContainer}>
                  <MaterialIcons name="calendar-month" size={32} color="white" />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>Taqvim Planlama</Text>
                  <Text style={styles.serviceDescription}>Əkim-yığım və gübrələmə planlaması</Text>
                </View>
                <View style={styles.serviceArrow}>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCardFull}
              onPress={() => navigation.navigate('Plants')}
            >
              <LinearGradient
                colors={['#4CAF50', '#66BB6A', '#81C784']}
                style={styles.serviceCardFullGradient}
              >
                <View style={styles.serviceIconContainer}>
                  <FontAwesome5 name="seedling" size={32} color="white" />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>Bitki Bələdçisi</Text>
                  <Text style={styles.serviceDescription}>12+ bitki növü haqqında ətraflı baxım</Text>
                </View>
                <View style={styles.serviceArrow}>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCardFull}
              onPress={() => navigation.navigate('About')}
            >
              <LinearGradient
                colors={['#9C27B0', '#BA68C8', '#CE93D8']}
                style={styles.serviceCardFullGradient}
              >
                <View style={styles.serviceIconContainer}>
                  <MaterialIcons name="business" size={32} color="white" />
                </View>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>Haqqımızda</Text>
                  <Text style={styles.serviceDescription}>Komanda və app məlumatları</Text>
                </View>
                <View style={styles.serviceArrow}>
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <View style={styles.imagePreviewCard}>
              <View style={styles.previewTitleContainer}>
                <MaterialIcons name="photo" size={20} color="#2E7D32" />
                <Text style={styles.previewTitle}>Seçilmiş Şəkil</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              </View>
              <TouchableOpacity 
                style={styles.analyzeButtonContainer}
                onPress={analyzeImage}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#A5D6A7', '#81C784'] : ['#4CAF50', '#2E7D32']}
                  style={styles.analyzeButtonGradient}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="white" size="small" />
                      <Text style={styles.loadingText}>Analiz edilir...</Text>
                    </View>
                  ) : (
                    <View style={styles.analyzeButtonContent}>
                      <MaterialIcons name="science" size={20} color="white" />
                      <Text style={styles.analyzeButtonText}>AI Analizi Başlat</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {analysis ? (
            <View style={styles.resultsCard}>
              <LinearGradient
                colors={['#E8F5E8', '#F1F8E9']}
                style={styles.resultsHeader}
              >
                <View style={styles.resultsTitleContainer}>
                  <MaterialIcons name="analytics" size={24} color="#2E7D32" />
                  <Text style={styles.resultsTitle}>AI Analiz Nəticəsi</Text>
                </View>
                <Text style={styles.resultsSubtitle}>Peşəkar Agronom Məsləhətləri</Text>
              </LinearGradient>
              <ScrollView style={styles.analysisScrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.analysisText}>{analysis}</Text>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Draggable AI Assistant Floating Button */}
      <Animated.View
        style={[
          styles.floatingAIButton,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('AIAssistant')}
          style={styles.floatingButtonTouchable}
        >
          <LinearGradient
            colors={['#FF9800', '#F57C00', '#E65100']}
            style={styles.floatingButtonGradient}
          >
            <MaterialIcons name="psychology" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradientHeader: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  actionSection: {
    marginBottom: 25,
  },
  servicesSection: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modernButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  serviceCardFull: {
    marginTop: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  serviceCardFullGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTextContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
    marginBottom: 12,
  },
  serviceArrow: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  imagePreviewCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  previewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
    textAlign: 'center',
  },
  imageWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  analyzeButtonContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  analyzeButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  analyzeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  resultsHeader: {
    padding: 20,
    alignItems: 'center',
  },
  resultsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
  },
  resultsSubtitle: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  analysisScrollView: {
    maxHeight: 1600,
    minHeight: 200,
    padding: 20,
  },
  analysisText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    textAlign: 'left',
  },
  floatingAIButton: {
    position: 'absolute',
    top: height - 20,
    left: width - 80,
    zIndex: 1000,
  },
  floatingButtonTouchable: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
});

export default HomeScreen;