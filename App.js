import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = '1694abc2513643cc3707025f262cc24e';

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync(); // 사용자에게 권한 요청
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 }); // 현재위치에서 위도, 경도를 추출함
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    ); // 지역정보를 불러옴
    setCity(location[0].city);
    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude }&lon=${longitude}&exclude=alerts&appid=${API_KEY}`
    // );
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location[0].city}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    console.log(json);
    setDays(json);
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false} // 수평 스크롤 표시여부
        pagingEnabled // 스크롤할 떄 스크롤 보기가 스크롤 보기 크기의 배수에서 멈춤, 수평 스크롤시 적용가능
        horizontal // 스크롤을 세로가아닌 가로로 배치
        contentContainerStyle={styles.weather}
      >
        {days?.weather?.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color='white'
              style={{ marginTop: 10 }}
              size='large'
            />
          </View>
        ) : (
          days?.weather?.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {new Date(days?.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View>
                <Text style={styles.temp}>{days?.main?.temp}</Text>
                <Fontisto name='cloudy' size={24} color='white'></Fontisto>
              </View>
              <Text style={styles.description}>{day.main}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '600',
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  date: {
    fontSize: 50,
  },
  temp: {
    marginTop: 50,
    fontSize: 80,
  },
  description: {
    fontSize: 30,
  },
});
