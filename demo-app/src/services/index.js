import axios from 'axios';
// TODO - CHANGE URL SERVICE
const serviceURL = 'http://192.168.1.44:3001/api/';
const versionesAPI = axios.create({
  baseURL: serviceURL,
});

const getAPIVersion = async () => {
  try {
    let app = {
      name: 'Building blocks',
      version: '2.2.2',
    };
    let res = await versionesAPI.get('application/mobile/app', {
      params: {name: app.name, version: app.version},
    });
    return res.data;
  } catch (error) {
    console.error('err', error);
  }
};
export {getAPIVersion};
