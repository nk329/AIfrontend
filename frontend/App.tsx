import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, AppState, Platform } from 'react-native';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

const LiveSpeechToText: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // 앱이 위젯에서 실행된 경우 자동 녹음 시작
    const checkIntent = async () => {
      if (Platform.OS === 'android') {
        const initialIntent = await Linking.getInitialURL();
        if (initialIntent && initialIntent.includes('fromWidget')) {
          startRecording();
        }
      }
    };
    checkIntent();

    // 앱이 백그라운드에서 포그라운드로 올 때도 인텐트 체크
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkIntent();
      }
    };
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const onSpeechStart = () => {
    setIsRecording(true);
    setRecognizedText('');
    setError(null);
    console.log('Speech started.');
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('Speech recognized:', e);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      setRecognizedText(prevText => `${prevText} ${(e.value ?? []).join(' ')}`.trim());
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setIsRecording(false);
    setError(e.error?.message || '음성 인식 중 오류가 발생했습니다.');
    console.log('Speech error:', e.error);
  };

  const startRecording = async () => {
    console.log('Voice object:', Voice); // Voice 객체 로깅
    try {
      await Voice.start('ko-KR');
      console.log('Recording started.');
    } catch (e: any) {
      console.error('Error starting recording:', e);
      setError(e.message || '음성 인식 시작에 실패했습니다.');
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      console.log('Speech stopped.');
    } catch (e: any) {
      setError(e.message || '음성 인식 중단에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>실시간 음성 인식</Text>
      <View style={styles.textContainer}>
        <Text style={styles.recognizedText}>{recognizedText || '말씀하세요...'}</Text>
      </View>
      {error && <Text style={styles.errorText}>오류: {error}</Text>}
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording ? styles.stopButton : styles.startButton]}
      >
        <Text style={styles.buttonText}>{isRecording ? '중단' : '녹음 시작'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textContainer: {
    width: '100%',
    minHeight: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  recognizedText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: 'green',
  },
  stopButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LiveSpeechToText;