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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Xəta', 'Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by the auth state listener
    } catch (error) {
      Alert.alert('Giriş Xətası', error.message);
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
            <Text style={styles.subtitle}>Hesabınıza daxil olun</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Giriş</Text>
            
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
                  placeholder="Şifrənizi daxil edin"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#A5D6A7', '#81C784'] : ['#4CAF50', '#2E7D32']}
                style={styles.loginButton}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="hourglass-empty" size={20} color="white" />
                    <Text style={styles.loginButtonText}>Giriş edilir...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="rocket" size={20} color="white" />
                    <Text style={styles.loginButtonText}>Giriş et</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.linkText}>
                Hesabınız yoxdur? <Text style={styles.linkHighlight}>Qeydiyyatdan keçin</Text>
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
  loginButtonContainer: {
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
  loginButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
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

export default LoginScreen;
