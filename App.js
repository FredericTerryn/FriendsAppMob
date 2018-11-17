import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import Movies from './Components/Movies';
import Login from './Components/Login';
import Groups from './Components/Groups';
import Settings from './Components/Settings';
import Expo from 'expo';

export default class App extends React.Component {
  render() {
    return (  
      <MyApp/>
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={{ height: 100, flex: 1 }}>
          <View style={{ flex: 1 }}>
           
          </View>
          <View style={{ flex: 2 }}>
            <Button style={styles.alerttext}
              onPress={() => navigate('Movies')}
              title="Movies"
            />
             <Button
              onPress={() => navigate('Settings')}
              title="Settings"
            />
          </View>
        </View>

         
        
      
      );
  }
}

const MyApp = createBottomTabNavigator({
  Home: {screen: HomeScreen},
  Settings: {screen: Settings},
  Movies: {screen: Movies}, 
  Groups: {screen: Groups}, 
  Login: {screen: Login}
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  alerttext: {
    color: 'red'
  }
});