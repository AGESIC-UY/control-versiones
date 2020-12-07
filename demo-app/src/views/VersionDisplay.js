import React from 'react';
import {Alert, View, Text, StyleSheet, Linking} from 'react-native';

import {getAPIVersion} from '../services';

const rowComponent = (title, attribute) => {
  return (
    <View>
      <Text style={Body.title}>{title}</Text>
      <Text style={Body.text}>{attribute}</Text>
    </View>
  );
};

function multipleRowsComponent(title, rows) {
  return (
    <View>
      <Text style={Body.title}>{title}</Text>
      {rows.map((row) => (
        <Text key={row} style={Body.text}>
          {row}
        </Text>
      ))}
    </View>
  );
}
class VersionDisplay extends React.Component {
  state = {
    appName: null,
    verNum: null,
    minVersion: null,
    urls: [],
    error: false,
  };
  componentDidMount() {
    this.refreshAppVersion();
  }
  refreshAppVersion = async () => {
    let {code, description, message, app} = await getAPIVersion();

    if (app && description.includes('Version encontrada')) {
      this.setState({
        appName: app.name,
        verNum: app.version.version,
        minVersion: app.version.minVersion,
        urls: app.version.servicesUrls,
      });
    } else if (app && message === 'Actualizar') {
      // en este caso se tiene que forzar a actualizar la aplicacion haciendo un redirect a las tiendas
      this.setState({
        appName: app.name,
        verNum: app.version.version,
        minVersion: app.version.minVersion,
        urls: app.version.servicesUrls,
      });
      Alert.alert(
        message,
        description,
        [
          {
            text: 'Ir a actualizar',
            onPress: () =>
              Linking.openURL(
                // 'market://details?id=uy.gub.app.perfil.release',
                'Aqui va la url de la store',
              ),
          },
        ],
        {cancelable: false},
      );
    } else if (description.includes('No se encontro')) {
      this.setState({
        appName: app.name,
        verNum: app.version.version,
        minVersion: app.version.minVersion,
        urls: app.version.servicesUrls,
      });
      Alert.alert(message, description);
    } else {
      this.setState({error: true});
      Alert.alert(message, description);
    }
  };
  render() {
    let {appName, verNum, minVersion, urls, error} = this.state;
    let AppData = error ? (
      <View style={Body.container}>
        {rowComponent('Ocurrio un error', 'Aplicacion no encontrada')}
      </View>
    ) : (
      <View style={Body.container}>
        {rowComponent('Aplicación', appName)}
        {rowComponent('Versión', verNum)}
        {rowComponent('Versión Mínima', minVersion)}
        {multipleRowsComponent('URLs', urls)}
      </View>
    );
    return <>{AppData}</>;
  }
}

export default VersionDisplay;

const Body = StyleSheet.create({
  container: {
    margin: 30,
    padding: 10,
    backgroundColor: '#F1F1EF',
    height: '90%',
  },
  title: {
    fontSize: 18,
    padding: 5,
    fontWeight: '800',
  },
  text: {
    fontSize: 14,
    padding: 5,
  },
});
