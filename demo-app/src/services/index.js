import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData, getData } from './store'

const serviceURL = 'http://192.168.1.42:3001/api/';
const versionesAPI = axios.create({
  baseURL: serviceURL,
});

const getAPIVersion = async () => {
  try {

    let app = {
      name: 'Building blocks',
      version: '1.2.3',
      clientKey: 'MDVmOGU1ZTc4YjM3MTcwZTdkNDA5YjRkYmZiOWRmNGU=3',
    };

    let res = await versionesAPI.get('application/mobile/app', {
      params: {
        name: app.name,
        version: app.version,
        clientKey: app.clientKey,
      },
    });
    const { data, data:{ code, description } } = res
    if (data && code === 200) {
      const app = buildAppObject(data);
      storeData(JSON.stringify(app))
      return app
    } else {
      if (data && code === 404 && 
        description.includes('Aplicacion no encontrada') || 
        description.includes('Client key invalido')) 
        {
        return res.data
      } else {
        const app = buildAppObject(data);
        return app
      }
    }

  } catch (error) {
    console.error('err', error);
    const application = await getData('appData')
    application['networkError'] = true;

    return application;
  } 
};


const buildAppObject = (data) => {
  
  const { app, code, description, message } = data
  data = {}
  data['appName'] = app.name;
  data['verNum'] = app.versions.version;
  data['minVersion'] = app.versions.minVersion;
  data['urls'] = app.versions.servicesUrls;
  data['code'] = code;
  data['description'] = description;
  data['message'] = message;

  return data
}

export {getAPIVersion};
