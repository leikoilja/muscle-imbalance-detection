import { StyleSheet } from 'react-native';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listElement: {
    marginBottom: 5,
  },
  button: {
    width: '50%',
    textAlign: 'center',
  },
  discoverySpinner: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  connectingSpinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataTitle: {
    marginBottom: 10,
  },
  settingNotSupportedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingNotSupportedText: {
    color: 'red',
    textAlign: 'center',
  },
});
