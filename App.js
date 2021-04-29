import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView
} from 'react-native';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import CameraRoll from '@react-native-community/cameraroll';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export default App = () => {

  const [uri, setUri] = useState('');
  const canvasRef = useRef();

  const _onPressOpenGallery = () => {
    launchImageLibrary(null, res => {
      if (res.uri) {
        let uri = res.uri.replace('file://', '');
        setUri(uri);
        canvasRef.current.clear();
      }
    });
  };

  const _onPressOpenCamera = () => {
    launchCamera(null, res => {
      if (res.uri) {
        let uri = res.uri.replace('file://', '');
        setUri(uri);
        canvasRef.current.clear();
      }
    });
  };

  const _onPressSavePicture = () => {
    canvasRef.current.save();
  };

  const _onPressUndPicture = () => {
    canvasRef.current.undo();
  };

  const _onPressClearPicture = () => {
    canvasRef.current.clear();
  };

  const savePicture = path => {
    CameraRoll.save(path)
      .then(() => {
        Alert.alert('Save picture successful.');
        canvasRef.current.clear();
        setUri('');
      })
      .catch((err) => {
        Alert.alert('ERROR: ' + err,);
      });
  };

  const ButtonAction = ({ lable, onPress }) => {
    return (
      uri
        ?
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.textButton}>{lable}</Text>
        </TouchableOpacity>
        :
        <View style={styles.buttonDisabled}>
          <Text style={styles.textButton}>{lable}</Text>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.action}>
          <TouchableOpacity style={styles.button} onPress={_onPressOpenGallery}>
            <Text style={styles.textButton}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={_onPressOpenCamera}>
            <Text style={styles.textButton}>Camera</Text>
          </TouchableOpacity>
          <ButtonAction lable='Undo' onPress={_onPressUndPicture} />
          <ButtonAction lable='Clear' onPress={_onPressClearPicture} />
          <ButtonAction lable='Save' onPress={_onPressSavePicture} />
        </View>
        {
          uri
            ?
            <RNSketchCanvas
              ref={canvasRef}
              containerStyle={styles.canvas}
              canvasStyle={styles.canvas}

              strokeColors={[{ color: '#000000' }, { color: '#FF0000' }, { color: '#00FF00' }, { color: '#0000FF' }, { color: '#FFFF00' }]}
              strokeComponent={color => (
                <View style={[styles.strokeColorButton, { backgroundColor: color }]} />
              )}
              strokeSelectedComponent={color => (
                <View style={[styles.strokeColorButton, { backgroundColor: color, borderWidth: 2 }]} />
              )}

              localSourceImage={{
                filename: uri,
                directory: '',
                mode: 'AspectFit'
              }}

              onSketchSaved={
                (result, path) => {
                  if (result) {
                    savePicture(path);
                  }
                }
              }
            />
            :
            <View style={styles.canvas} />
        }

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  canvas: {
    flex: 1,
  },
  strokeColorButton: {
    marginVertical: 4, marginHorizontal: 4, width: 24, height: 24, borderRadius: 12
  },
  action: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    opacity: .5
  },
  textButton: {
    color: 'white',
    fontSize: 14
  }
});