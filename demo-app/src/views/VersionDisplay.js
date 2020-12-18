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
    networkError: false
  };
  componentDidMount() {
    this.refreshAppVersion();
  }
  refreshAppVersion = async () => {
    let {code, description, message, appName,
      verNum, minVersion, urls, networkError } = await getAPIVersion();

    if (appName && description.includes('Version encontrada') || 
      appName && description.includes('Version encontrada') && networkError) {
      if (networkError) {
        Alert.alert('Ocurrio un error', 
          'No se puede comunicar con la api, se muestra la ultima version exitosa');
      }
      this.setState({
        appName: appName,
        verNum: verNum,
        minVersion: minVersion,
        urls: urls,
      });
    } else if (appName && message === 'Actualizar') {
      // en este caso se tiene que forzar a actualizar la aplicacion haciendo un redirect a las tiendas
      this.setState({
        appName: appName,
        verNum: verNum,
        minVersion: minVersion,
        urls: urls,
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
    } else if (
      appName &&
      description.includes('No se encontro') &&
      message.includes('Exito')
    ) {
      this.setState({
        appName: appName,
        verNum: verNum,
        minVersion: minVersion,
        urls: urls,
      });
      Alert.alert(message, description);
    } else {
      appName
        ? this.setState({appName: appName, error: true})
        : this.setState({error: true});
      Alert.alert(message, description);
    }
  };
  render() {
    let {appName, verNum, minVersion, urls, error} = this.state;
    let AppData =
      error && !appName ? (
        <View style={Body.container}>
          {rowComponent('Ocurrio un error', 'Aplicacion no encontrada')}
        </View>
      ) : error && appName ? (
        <View style={Body.container}>
          {rowComponent('Aplicación', appName)}
          {rowComponent('Ocurrio un error', 'Versiones no encontradas')}
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
