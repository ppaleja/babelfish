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
      isRecording: false,
      recording: new Audio.Recording(),
      permissionGranted: false,
    };
  }

  handleButtonPress = async () => {
    const { isRecording, permissionGranted } = this.state;

    if (!permissionGranted) {
      this.alertIfRemoteNotificationsDisabledAsync();

      return;
    }

    if (isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  playAudio = async (audio) => {
    const { recording } = this.state;
    const soundObject = await recording.createNewLoadedSoundAsync();
    alert(soundObject);
    //alert('brh');
    //alert('brh' + require(recording.getURI()));
    try {
      //const src = recording.getURI();
      //alert(src);
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      console.log(error);
    }
  };

  stopRecording = async () => {
    //alert('stop recording');
    const { isRecording, recording } = this.state;
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      alert(error);
    }

    this.playAudio(recording);
    // Need logic to send audio recording to dragon board here

    this.setState({
      isRecording: false,
      recording: new Audio.Recording(),
    });
  };

  startRecording = async () => {
    const { recording } = this.state;
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      await recording.startAsync();

      // You are now recording!
    } catch (error) {
      alert('audio error: ' + error);
    }
    //alert('start Recording')
    this.setState(prevState => ({
      isRecording: true,
    }));
  };

  alertIfRemoteNotificationsDisabledAsync = async () => {
    const { status, permissions } = await Permissions.askAsync(
      Permissions.AUDIO_RECORDING
    );

    if (status !== 'granted') {
      alert('Hey! You need audio permission to use my app.');
    } else {
      this.setState({
        permissionGranted: true,
      });
    }
  };

  async componentDidMount() {
    this.alertIfRemoteNotificationsDisabledAsync();
  }

  render() {
    //alert('rendering');
    const { isRecording } = this.state;

    const buttonText = isRecording ? 'stop' : 'start';

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleButtonPress}>
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
    padding: 10,
  },
});
