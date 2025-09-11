import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Xəta', 'Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Xəta', 'Şifrələr uyğun gəlmir');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Xəta', 'Şifrə ən azı 6 simvol olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      // Navigation will be handled by the auth state listener
    } catch (error) {
      Alert.alert('Qeydiyyat Xətası', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4CAF50', '#2E7D32', '#1B5E20']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.appIconContainer}>
              <Ionicons name="leaf" size={60} color="white" />
            </View>
            <Text style={styles.title}>Fermerin Dostu</Text>
            <Text style={styles.subtitle}>Yeni hesab yaradın</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Qeydiyyat</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="person" size={20} color="#2E7D32" />
                <Text style={styles.inputLabel}>Ad və Soyad</Text>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Adınızı və soyadınızı daxil edin"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="email" size={20} color="#2E7D32" />
                <Text style={styles.inputLabel}>E-mail</Text>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail ünvanınızı daxil edin"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="lock" size={20} color="#2E7D32" />
                <Text style={styles.inputLabel}>Şifrə</Text>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrənizi daxil edin (min 6 simvol)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="lock-outline" size={20} color="#2E7D32" />
                <Text style={styles.inputLabel}>Şifrə təkrarı</Text>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrənizi təkrar daxil edin"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.registerButtonContainer}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#A5D6A7', '#81C784'] : ['#4CAF50', '#2E7D32']}
                style={styles.registerButton}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="hourglass-empty" size={20} color="white" />
                    <Text style={styles.registerButtonText}>Qeydiyyat edilir...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="sparkles" size={20} color="white" />
                    <Text style={styles.registerButtonText}>Qeydiyyatdan keç</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>
                Artıq hesabınız var? <Text style={styles.linkHighlight}>Giriş edin</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appIconContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8F5E8',
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  linkButton: {
    alignItems: 'center',
    padding: 15,
  },
  linkText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
