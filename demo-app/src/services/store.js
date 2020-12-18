import AsyncStorage from '@react-native-async-storage/async-storage';


export const storeData = async (data) => {
    try {
      await AsyncStorage.setItem('appData', data)
    } catch (e) {
      console.error('err', error)
    }
  }
  
  
  
export const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('appData')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
      console.log('err', e)
    }
  }

