import React from 'react';

import Toast from 'react-native-toast-message';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import RootNavigator from './navigation/RootNavigator';

class App extends React.Component {
  render() {
    const { theme } = this.props;
    return (
      <ApplicationProvider {...eva} theme={eva[theme]}>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <IconRegistry icons={EvaIconsPack} />
        <SafeAreaView style={{ flex: 1 }}>
          <RootNavigator />
        </SafeAreaView>
      </ApplicationProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.settingsReducer.theme,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
