import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AboutScreen = ({ navigation }) => {
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
            <MaterialIcons name="info" size={24} color="white" />
            <Text style={styles.headerTitle}>Bizim Haqqımızda</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* App Info Card */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#E8F5E8', '#F1F8E9']}
              style={styles.cardHeader}
            >
              <View style={styles.appIconContainer}>
                <Ionicons name="leaf" size={40} color="#2E7D32" />
              </View>
              <Text style={styles.appName}>Fermerin Dostu</Text>
              <Text style={styles.appVersion}>Versiya 1.0.0</Text>
            </LinearGradient>
            
            <View style={styles.cardContent}>
              <Text style={styles.description}>
                Fermerin Dostu - Azərbaycan fermerlərinin rəqəmsal köməkçisidir. 
                Süni intellekt texnologiyası ilə torpaq analizindən tutmuş bitki 
                baxımına qədər bütün kənd təsərrüfatı ehtiyaclarınızı qarşılayır.
              </Text>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresCard}>
            <Text style={styles.sectionTitle}>Xüsusiyyətlər</Text>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons name="camera-alt" size={24} color="#FF9800" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI Torpaq Analizi</Text>
                <Text style={styles.featureDescription}>
                  Torpaq şəklini çəkin, süni intellekt ilə təhlil alın
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <FontAwesome5 name="seedling" size={24} color="#4CAF50" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Bitki Bələdçisi</Text>
                <Text style={styles.featureDescription}>
                  12+ bitki növü haqqında ətraflı baxım məlumatları
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons name="chat" size={24} color="#2196F3" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI Köməkçi</Text>
                <Text style={styles.featureDescription}>
                  Kənd təsərrüfatı suallarınızı AI-dan soruşun
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialIcons name="security" size={24} color="#9C27B0" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Təhlükəsiz Giriş</Text>
                <Text style={styles.featureDescription}>
                  Firebase ilə qorunan hesab sistemi
                </Text>
              </View>
            </View>
          </View>

          {/* Technology Stack */}
          <View style={styles.techCard}>
            <Text style={styles.sectionTitle}>Texnologiya</Text>
            
            <View style={styles.techGrid}>
              <View style={styles.techItem}>
                <MaterialIcons name="phone-android" size={30} color="#4CAF50" />
                <Text style={styles.techName}>React Native</Text>
              </View>
              
              <View style={styles.techItem}>
                <MaterialIcons name="psychology" size={30} color="#FF9800" />
                <Text style={styles.techName}>Our own AI Model</Text>
              </View>
              
              <View style={styles.techItem}>
                <MaterialIcons name="cloud" size={30} color="#2196F3" />
                <Text style={styles.techName}>Firebase</Text>
              </View>
              
              <View style={styles.techItem}>
                <MaterialIcons name="code" size={30} color="#9C27B0" />
                <Text style={styles.techName}>Expo SDK</Text>
              </View>
            </View>
          </View>

          {/* Team Section */}
          <View style={styles.teamCard}>
            <Text style={styles.sectionTitle}>Komanda</Text>
            
            <View style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <MaterialIcons name="person" size={30} color="white" />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>AI Development Team</Text>
                <Text style={styles.memberRole}>Proqram Təminatı Mühəndisləri</Text>
                <Text style={styles.memberDescription}>
                  Azərbaycan fermerlərinin rəqəmsal transformasiyasına töhfə verən komanda
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Text style={styles.sectionTitle}>Əlaqə</Text>
            
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={20} color="#2E7D32" />
              <Text style={styles.contactText}>support@fermerindostu.az</Text>
            </View>
            
            <View style={styles.contactItem}>
              <MaterialIcons name="phone" size={20} color="#2E7D32" />
              <Text style={styles.contactText}>+994 XX XXX XX XX</Text>
            </View>
            
            <View style={styles.contactItem}>
              <MaterialIcons name="location-on" size={20} color="#2E7D32" />
              <Text style={styles.contactText}>Bakı, Azərbaycan</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 Fermerin Dostu. Bütün hüquqlar qorunur.
            </Text>
            <Text style={styles.footerSubtext}>
              Azərbaycan kənd təsərrüfatının rəqəmsal gələcəyi üçün hazırlanıb
            </Text>
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
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 30,
    alignItems: 'center',
  },
  appIconContainer: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    marginBottom: 15,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 16,
    color: '#666',
  },
  cardContent: {
    padding: 25,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  techCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
  },
  techName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  teamCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 6,
  },
  memberDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AboutScreen;
