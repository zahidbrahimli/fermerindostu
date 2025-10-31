import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const PLANTS_CALENDAR = {
  pomidor: {
    name: 'Pomidor',
    color: ['#FF6B6B', '#EE5A24'],
    ekimAy: 'Mart-Aprel',
    yigimAy: 'İyul-Sentyabr',
    gubre: [
      { ay: 'Aprel', tip: 'Azot gübrəsi (Ürea)', dose: '10-15g/m²' },
      { ay: 'May', tip: 'Fosfor-Kalium', dose: '8-10g/m²' },
      { ay: 'İyun', tip: 'Kompleks gübrə NPK 10-10-10', dose: '15g/m²' },
      { ay: 'İyul', tip: 'Kalium gübrəsi', dose: '10g/m²' },
    ],
    xestaliklaribarize: [
      { ay: 'May', hastaliq: 'Fitoftora profilaktikası', preparat: 'Ridomil Gold' },
      { ay: 'İyun', hastaliq: 'Bure tozmasının önlenmesi', preparat: 'Kuprum oksikorida' },
      { ay: 'İyul', hastaliq: 'Üzüm xəstəliyi', preparat: 'Sulfur' },
    ],
  },
  xiyar: {
    name: 'Xiyar',
    color: ['#00D2FF', '#3A7BD5'],
    ekimAy: 'May-İyun',
    yigimAy: 'İyul-Sentyabr',
    gubre: [
      { ay: 'May', tip: 'Azot gübrəsi', dose: '12g/m²' },
      { ay: 'İyun', tip: 'Kompleks gübrə', dose: '10g/m²' },
      { ay: 'İyul', tip: 'Fosfor-Kalium', dose: '8g/m²' },
    ],
    xestaliklaribarize: [
      { ay: 'İyun', hastaliq: 'Küy xəstəliyi profil', preparat: 'Sulfur' },
      { ay: 'İyul', hastaliq: 'Mildiy profil', preparat: 'Bordodska karışımı' },
    ],
  },
  kartof: {
    name: 'Kartof',
    color: ['#D4A574', '#C7956D'],
    ekimAy: 'Mart-Aprel',
    yigimAy: 'İyul-Avqust',
    gubre: [
      { ay: 'Mart', tip: 'Üzvi gübrə', dose: '20-30kg/100m²' },
      { ay: 'Aprel', tip: 'Azot gübrəsi', dose: '15g/m²' },
      { ay: 'May', tip: 'Kompleks gübrə', dose: '12g/m²' },
    ],
    xestaliklaribarize: [
      { ay: 'May', hastaliq: 'Fitoftora mübarizəsi', preparat: 'Bordodska karışımı' },
      { ay: 'İyun', hastaliq: 'Kartof böcəyi', preparat: 'Bitoksibacillin' },
    ],
  },
  kelem: {
    name: 'Kələm',
    color: ['#A8E6CF', '#7FCDCD'],
    ekimAy: 'Avqust-Sentyabr',
    yigimAy: 'Noyabr-Dekabr',
    gubre: [
      { ay: 'Avqust', tip: 'Azot gübrəsi', dose: '15g/m²' },
      { ay: 'Sentyabr', tip: 'Fosfor-Kalium', dose: '10g/m²' },
      { ay: 'Oktyabr', tip: 'Kalium gübrəsi', dose: '8g/m²' },
    ],
    xestaliklaribarize: [
      { ay: 'Oktyabr', hastaliq: 'Kələm kurdu mübarizəsi', preparat: 'Bitoksibacillin' },
      { ay: 'Noyabr', hastaliq: 'Küy xəstəliyi profil', preparat: 'Sulfur' },
    ],
  },
};

const CalendarScreen = ({ navigation }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedPlant, setSelectedPlant] = useState('pomidor');
  const [taskModal, setTaskModal] = useState(false);
  const [customTasks, setCustomTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    text: '',
    date: '',
    type: 'diğer',
  });

  const plantData = PLANTS_CALENDAR[selectedPlant];
  const currentMonthName = MONTHS[currentMonth];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const addCustomTask = () => {
    if (!newTask.text || !newTask.date) {
      Alert.alert('Xəta', 'Zəhmət olmasa bütün sahələri doldurun');
      return;
    }
    setCustomTasks([...customTasks, { ...newTask, id: Date.now() }]);
    setNewTask({ text: '', date: '', type: 'diğer' });
    setTaskModal(false);
    Alert.alert('Uğurlu', 'Vəzifə əlavə olundu');
  };

  const deleteTask = (id) => {
    setCustomTasks(customTasks.filter(task => task.id !== id));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <View key={day} style={styles.dayCell}>
          <Text style={styles.dayNumber}>{day}</Text>
          <View style={styles.dayEvents} />
        </View>
      );
    }

    return days;
  };

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
            <MaterialIcons name="calendar-month" size={24} color="white" />
            <Text style={styles.headerTitle}>Taqvim Planlama</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Bitki Seçimi */}
          <View style={styles.plantSelector}>
            <Text style={styles.sectionTitle}>Bitki Seçin</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plantScroll}>
              {Object.keys(PLANTS_CALENDAR).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.plantButton,
                    selectedPlant === key && styles.plantButtonActive,
                  ]}
                  onPress={() => setSelectedPlant(key)}
                >
                  <LinearGradient
                    colors={PLANTS_CALENDAR[key].color}
                    style={styles.plantButtonGradient}
                  >
                    <Text style={styles.plantButtonText}>
                      {PLANTS_CALENDAR[key].name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Bitki Məlumatları */}
          <View style={styles.plantInfoCard}>
            <LinearGradient
              colors={plantData.color}
              style={styles.plantInfoGradient}
            >
              <View style={styles.plantInfoRow}>
                <View style={styles.plantInfoItem}>
                  <MaterialIcons name="event" size={20} color="white" />
                  <Text style={styles.plantInfoLabel}>Əkim Ayı</Text>
                  <Text style={styles.plantInfoValue}>{plantData.ekimAy}</Text>
                </View>
                <View style={styles.plantInfoItem}>
                  <MaterialIcons name="agriculture" size={20} color="white" />
                  <Text style={styles.plantInfoLabel}>Yığım Ayı</Text>
                  <Text style={styles.plantInfoValue}>{plantData.yigimAy}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Ay Seçimi */}
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton}>
              <MaterialIcons name="chevron-left" size={28} color="#2E7D32" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonthName} {currentYear}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
              <MaterialIcons name="chevron-right" size={28} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          {/* Gübrələmə Planı */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
              <Text style={styles.scheduleTitle}>Gübrələmə Planı</Text>
            </View>
            {plantData.gubre.map((task, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleItemLeft}>
                  <View style={styles.scheduleItemDot} />
                  <View>
                    <Text style={styles.scheduleItemMonth}>{task.ay}</Text>
                    <Text style={styles.scheduleItemText}>{task.tip}</Text>
                  </View>
                </View>
                <Text style={styles.scheduleItemDose}>{task.dose}</Text>
              </View>
            ))}
          </View>

          {/* Xəstəlik Mübarizəsi */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <MaterialIcons name="healing" size={24} color="#F44336" />
              <Text style={styles.scheduleTitle}>Xəstəlik Mübarizəsi</Text>
            </View>
            {plantData.xestaliklaribarize.map((task, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleItemLeft}>
                  <View style={[styles.scheduleItemDot, { backgroundColor: '#F44336' }]} />
                  <View>
                    <Text style={styles.scheduleItemMonth}>{task.ay}</Text>
                    <Text style={styles.scheduleItemText}>{task.hastaliq}</Text>
                  </View>
                </View>
                <View style={styles.preparatBadge}>
                  <Text style={styles.preparatText}>{task.preparat}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Fərdi Vəzifələr */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <MaterialIcons name="checklist" size={24} color="#2196F3" />
              <Text style={styles.scheduleTitle}>Fərdi Vəzifələr</Text>
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={() => setTaskModal(true)}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {customTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="note-add" size={40} color="#999" />
                <Text style={styles.emptyStateText}>Vəzifə əlavə edin</Text>
              </View>
            ) : (
              customTasks.map((task) => (
                <View key={task.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleItemLeft}>
                    <View
                      style={[
                        styles.scheduleItemDot,
                        {
                          backgroundColor:
                            task.type === 'gubre'
                              ? '#4CAF50'
                              : task.type === 'xestaliq'
                              ? '#F44336'
                              : '#2196F3',
                        },
                      ]}
                    />
                    <View>
                      <Text style={styles.scheduleItemMonth}>{task.date}</Text>
                      <Text style={styles.scheduleItemText}>{task.text}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteTask(task.id)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Takvim Grid */}
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>Ay Taqvimi</Text>
            <View style={styles.weekDays}>
              {['Baz', 'Bəz', 'Çarş', 'Cüm', 'Cümə', 'Şənb', 'Bazar'].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.calendar}>{renderCalendar()}</View>
          </View>

          {/* İpuçları */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <MaterialIcons name="lightbulb" size={24} color="#FFC107" />
              <Text style={styles.tipsTitle}>Faydalı İpuçları</Text>
            </View>
            <Text style={styles.tipsText}>🌱 Gübrələmə döngüsünü vaxtında tətbiq et</Text>
            <Text style={styles.tipsText}>🛡️ Xəstəlik mübarizəsi profilaktik aparılmalıdır</Text>
            <Text style={styles.tipsText}>📅 Hava şəraitinə görə planı uyğunlaşdır</Text>
            <Text style={styles.tipsText}>⏰ Pəhlivan bildirişləri almaq üçün vəzifələr əlavə et</Text>
          </View>
        </View>
      </ScrollView>

      {/* Vəzifə Əlavə Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={taskModal}
        onRequestClose={() => setTaskModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Vəzifə</Text>
              <TouchableOpacity onPress={() => setTaskModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.formLabel}>Vəzifə Adı</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Vəzifəni yazın..."
                value={newTask.text}
                onChangeText={(text) =>
                  setNewTask({ ...newTask, text })
                }
                placeholderTextColor="#999"
              />

              <Text style={styles.formLabel}>Ay Seçin</Text>
              <View style={styles.monthButtonsGrid}>
                {MONTHS.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthSelectButton,
                      newTask.date === month && styles.monthSelectButtonActive,
                    ]}
                    onPress={() =>
                      setNewTask({ ...newTask, date: month })
                    }
                  >
                    <Text
                      style={[
                        styles.monthSelectButtonText,
                        newTask.date === month &&
                          styles.monthSelectButtonTextActive,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Vəzifə Tipi</Text>
              <View style={styles.typeButtons}>
                {['gubre', 'xestaliq', 'diğer'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newTask.type === type && styles.typeButtonActive,
                    ]}
                    onPress={() =>
                      setNewTask({ ...newTask, type })
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newTask.type === type &&
                          styles.typeButtonTextActive,
                      ]}
                    >
                      {type === 'gubre'
                        ? 'Gübrə'
                        : type === 'xestaliq'
                        ? 'Xəstəlik'
                        : 'Digər'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={addCustomTask}
              >
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  style={styles.addButtonGradient}
                >
                  <MaterialIcons name="add" size={24} color="white" />
                  <Text style={styles.addButtonText}>Vəzifə Əlavə Et</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  plantSelector: {
    marginBottom: 25,
  },
  plantScroll: {
    marginHorizontal: -5,
  },
  plantButton: {
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  plantButtonActive: {
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  plantButtonGradient: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  plantButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  plantInfoCard: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  plantInfoGradient: {
    padding: 20,
  },
  plantInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  plantInfoItem: {
    alignItems: 'center',
  },
  plantInfoLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 8,
  },
  plantInfoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  addTaskButton: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scheduleItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleItemDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  scheduleItemMonth: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  scheduleItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  scheduleItemDose: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  preparatBadge: {
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  preparatText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    width: '14.28%',
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  dayEvents: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalForm: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  monthButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthSelectButton: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  monthSelectButtonActive: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  monthSelectButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  monthSelectButtonTextActive: {
    color: '#2E7D32',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: '#2E7D32',
  },
  addButton: {
    marginTop: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CalendarScreen;