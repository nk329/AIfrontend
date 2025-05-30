import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-voice/voice';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // 녹음 시작
  const startRecording = async () => {
    try {
      await Voice.start(Platform.OS === 'ios' ? 'ko-KR' : 'ko-KR');
      setIsRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  // 녹음 정지
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      console.error(e);
    }
  };

  // +버튼 클릭 시 녹음 토글
  const handleRecordButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={28} color="#222" />
        <Text style={styles.headerTitle}>캘린더</Text>
      </View>

      {/* 달력 */}
      <Calendar
        current={selectedDate || undefined}
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={
          selectedDate
            ? { [selectedDate]: { selected: true, selectedColor: '#4A90E2' } }
            : {}
        }
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          todayTextColor: '#4A90E2',
          arrowColor: '#4A90E2',
          selectedDayBackgroundColor: '#4A90E2',
          selectedDayTextColor: '#fff',
        }}
        style={styles.calendar}
      />

      {/* 선택된 날짜 정보 */}
      <View style={styles.infoBox}>
        <Text style={styles.dateText}>
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })
            : '날짜를 선택하세요'}
        </Text>
        <View style={styles.scheduleRow}>
          <Text style={styles.timeText}>03:39 오후</Text>
          <Icon name="event-note" size={18} color="#555" style={{ marginLeft: 8 }} />
          <Text style={styles.scheduleText}>초안</Text>
          <Icon name="sentiment-satisfied-alt" size={22} color="#FFA500" style={{ marginLeft: 8 }} />
        </View>
      </View>

      {/* 플로팅 +버튼 */}
      <TouchableOpacity style={styles.fab} onPress={handleRecordButton}>
        <Icon name={isRecording ? 'stop' : 'add'} size={32} color="#fff" />
      </TouchableOpacity>

      {/* 녹음 상태 표시 */}
      {isRecording && (
        <View style={styles.recordingBox}>
          <Icon name="mic" size={24} color="#fff" />
          <Text style={styles.recordingText}>녹음 중...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e3efff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 12, color: '#222' },
  calendar: { marginHorizontal: 8, borderRadius: 12, marginTop: 8 },
  infoBox: {
    backgroundColor: '#e3efff',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    elevation: 2,
  },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#4A90E2', marginBottom: 8 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  timeText: { fontSize: 14, color: '#555' },
  scheduleText: { fontSize: 14, color: '#555', marginLeft: 8 },
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#4A90E2',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  recordingBox: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    elevation: 4,
  },
  recordingText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
});

export default App;