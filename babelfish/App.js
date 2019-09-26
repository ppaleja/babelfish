import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
 } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';

const ASYNC_STORAGE_AUDIO_KEY = 'ASYNC_STORAGE_AUDIO_KEY';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      permissionGranted: false,
    }
  }

  handleButtonPress = async () => {
    const { recording, permissionGranted } = this.state;
    if(!permissionGranted) {
      this.alertIfRemoteNotificationsDisabledAsync();
      return;
    }
    
    if(recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording = async () => {
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      // You are now recording!
    } catch (error) {
      // An error occurred!
    }
  }

  alertIfRemoteNotificationsDisabledAsync = async () => {
    const { status, permissions } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
      alert('Hey! You need audio permission to use my app.');
    } else {
      this.setState({
        permissionGranted: true,
      })
    }
  }

  async componentDidMount() {
    this.alertIfRemoteNotificationsDisabledAsync();
    try {
      const audio = 
    }
  }

  render() {
    const { recording } = this.state;
    const buttonText = recording ? 'stop' : 'start';
    return(
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleButtonPress}
        >
          <Text>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
});
