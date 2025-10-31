import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// ⚠️ API açarını buraya yazın - GİZLİ SAKIN!


const AIAssistantScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Salam! Mən 20+ il təcrübəli peşəkar kənd təsərrüfatı mütəxəssisiyəm. Azərbaycan iqlim şəraitində bitki yetişdirilməsi, torpaq analizi, gübrələmə, xəstəlik müalicəsi və aqrotexniki məsələlər üzrə sizə köməklik edə bilərəm. Hansı mövzuda məsləhət istəyirsiniz? Şəkil yükləyə də bilərsiz!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Base64 çevirmə xətası:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Xəta", "Şəkil seçilə bilmədi: " + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Xəta", "Fotoşəkil çəkilə bilmədi: " + error.message);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert("Xəta", "Zəhmət olmasa şəkil seçin!");
      return;
    }

    try {
      setIsLoading(true);
      const base64Image = await convertImageToBase64(selectedImage);

      const userMessage = {
        id: Date.now(),
        text: "Şəkli analiz et və məsləhət ver",
        isUser: true,
        timestamp: new Date(),
        image: selectedImage,
      };

      setMessages((prev) => [...prev, userMessage]);
      setSelectedImage(null);

      const analysisPrompt = `Bu şəkili dəqiq analiz et və aşağıdakıları ver:

1. BİTKİ TƏŞXİSİ:
   - Bitki adı (Azərbaycanca)
   - Böyümə mərhələsi
   - Sağlamlıq vəziyyəti

2. PROBLEM TƏŞXİSİ (əgər varsa):
   - Xəstəlik, zərərçi və ya qida eksikliyi
   - Şiddəti (ağır/orta/yüngül)

3. TORPAQ ANALİZİ (görünüşə görə):
   - Torpaq rəngi və strukturu
   - Nəmlik vəziyyəti
   - Ehtimal olunan torpaq tipi

4. ƏSASLİ TÖVSIYYƏLƏR:
   - Acil tədbirlər
   - Gübrə və preparatlar (konkret adları)
   - Suvarma rejimi
   - Nəticə vaxtı

Cavab praktik, konkret və Azərbaycan iqlim şəraiti üçün münasib olsun.`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "system",
                content:
                  "Sen peşəkar kənd təsərrüfatı agronomi və bitki diagnostikası mütəxəssisisən. 20+ il təcrübən var. Şəkillərdən bitki, xəstəlik, zərərçi, torpaq problemi və qida eksikliklərini tanı. Cavablarını həmişə praktik, konkret və Azərbaycan iqlim şəraitinə uyğun ver.",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: analysisPrompt,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        console.log("🖼️ ŞƏKİL ANALİZİ - AI NƏTİCƏSİ:");
        console.log("================================");
        console.log(aiResponse);
        console.log("================================");
        console.log("📊 Tam API Cavabı:", data);

        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Şəkil analizi xətası:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text:
          "Şəkil analiz edilə bilmədi. Zəhmət olmasa:\n\n1. Şəklin açıq və keyfiyətli olduğundan əmin olun\n2. İnternet bağlantısını yoxlayın\n3. Biraz sonra yenidən cəhd edin\n\nXəta: " +
          error.message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const aiPrompt = `Sen 20+ il təcrübəli peşəkar kənd təsərrüfatı mütəxəssisi və agronoumsan. Azərbaycan iqlim şəraitini, torpaq növlərini və yerli bitki sortlarını mükəmməl bilirsən. Aşağıdakı sualı ekspert kimi cavabla.

Fermer sualı: ${inputText.trim()}

Cavabında mütləq daxil et:
- Konkret praktik addımlar və tövsiyələr
- Azərbaycan iqlim şəraitinə uyğun vaxt planı
- Mövsüni xüsusiyyətlər və tövsiyələr
- Ümumi səhvlərin qarşısının alınması
- Konkret gübrə və preparatların adları (mümkünsə)
- Nəticə və gözləmələr

Cavab 150-300 söz arası, sadə və praktik dillə yazılsın.`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "Sen peşəkar kənd təsərrüfatı mütəxəssisisən və Azərbaycan fermerlərinin AI köməkçisisən. 20+ il təcrübən var. Bitki yetişdirilməsi, torpaq analizi, gübrələmə, xəstəlik müalicəsi, suvarma sistemləri və aqrotexniki tədbirlər sahəsində ekspertsən. Cavablarını həmişə praktik, dəqiq və Azərbaycan iqlim şəraitinə uyğun ver.",
              },
              {
                role: "user",
                content: aiPrompt,
              },
            ],
            max_tokens: 600,
            temperature: 0.7,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        console.log("❓ FERMER SUALINA CAVAB:");
        console.log("================================");
        console.log(aiResponse);
        console.log("================================");
        console.log("📊 Tam API Cavabı:", data);

        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        text:
          "OpenAI API ilə əlaqə qurmaq mümkün olmadı. Zəhmət olmasa:\n\n1. İnternet bağlantınızı yoxlayın\n2. API açarının düzgün konfiqurasiya olunduğundan əmin olun\n3. Bir neçə dəqiqə sonra yenidən cəhd edin\n\nXəta: " +
          error.message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    Alert.alert(
      "Söhbəti təmizlə",
      "Bütün mesajları silmək istədiyinizə əminsiniz?",
      [
        { text: "Xeyr", style: "cancel" },
        {
          text: "Bəli",
          onPress: () =>
            setMessages([
              {
                id: 1,
                text: "Salam! Mən 20+ il təcrübəli peşəkar kənd təsərrüfatı mütəxəssisiyəm. Azərbaycan iqlim şəraitində bitki yetişdirilməsi, torpaq analizi, gübrələmə, xəstəlik müalicəsi və aqrotexniki məsələlər üzrə sizə köməklik edə bilərəm. Hansı mövzuda məsləhət istəyirsiniz? Şəkil yükləyə də bilərsiz!",
                isUser: false,
                timestamp: new Date(),
              },
            ]),
        },
      ]
    );
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!message.isUser && (
        <View style={styles.aiAvatar}>
          <MaterialIcons name="psychology" size={20} color="white" />
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {message.image && (
          <Image
            source={{ uri: message.image }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.aiText,
          ]}
        >
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString("az-AZ", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {message.isUser && (
        <View style={styles.userAvatar}>
          <MaterialIcons name="person" size={20} color="white" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4CAF50", "#2E7D32", "#1B5E20"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.aiHeaderAvatar}>
              <MaterialIcons name="psychology" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Köməkçi</Text>
              <Text style={styles.headerSubtitle}>
                Kənd təsərrüfatı mütəxəssisi
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
            <MaterialIcons name="delete-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.aiAvatar}>
                <MaterialIcons name="psychology" size={20} color="white" />
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            </View>
          )}
        </ScrollView>

        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzeImage}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                style={styles.analyzeButtonGradient}
              >
                <MaterialIcons name="image-search" size={18} color="white" />
                <Text style={styles.analyzeButtonText}>Analiz Et</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <LinearGradient
            colors={["#E8F5E8", "#F1F8E9"]}
            style={styles.inputWrapper}
          >
            <View style={styles.inputContent}>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={pickImage}
                disabled={isLoading}
              >
                <MaterialIcons
                  name="photo-library"
                  size={20}
                  color={isLoading ? "#ccc" : "#4CAF50"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={takePhoto}
                disabled={isLoading}
              >
                <MaterialIcons
                  name="camera-alt"
                  size={20}
                  color={isLoading ? "#ccc" : "#4CAF50"}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Sualınızı yazın..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <LinearGradient
                  colors={
                    !inputText.trim() || isLoading
                      ? ["#ccc", "#999"]
                      : ["#4CAF50", "#2E7D32"]
                  }
                  style={styles.sendButtonGradient}
                >
                  <MaterialIcons name="send" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 15,
  },
  aiHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  clearButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#2196F3",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "white",
  },
  aiText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
    marginTop: 4,
    textAlign: "right",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  loadingBubble: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imagePreview: {
    height: 200,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#F8F9FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  previewImage: {
    flex: 1,
    borderRadius: 12,
    width: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 15,
    right: 30,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  analyzeButton: {
    position: "absolute",
    bottom: 15,
    right: 20,
  },
  analyzeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  analyzeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  inputContainer: {
    padding: 20,
    paddingTop: 10,
  },
  inputWrapper: {
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  imageButton: {
    padding: 8,
    marginRight: 5,
  },
  cameraButton: {
    padding: 8,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default AIAssistantScreen;