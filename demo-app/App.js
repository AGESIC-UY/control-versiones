/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

import VersionDisplay from './src/views/VersionDisplay';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" >
          <VersionDisplay/>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
