import React from 'react';
import { StyleSheet, Text, View, Button,ImageBackground, TouchableHighlight } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialBottomTabNavigator } from 'react-navigation';
import Movies from './Components/Movies';
import Login from './Components/Login';
import Groups from './Components/Groups';
import Settings from './Components/Settings';
import Events from './Components/Events';
import Debts from './Components/Debts'; 
import Expo from 'expo';
import { Header, statusBarProps, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles }
  from 'react-native-elements'
import GridView from 'react-native-super-grid';
import { SuperGridSectionList } from 'react-native-super-grid';
import { Icon } from 'react-native-elements'

export default class App extends React.Component {
  render() {
    return (
      <MyApp />
    );
  }
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  navigateToMovies = (name) => {
    console.log(name);
    this.props.navigation.navigate(name);
  }

  render() {
    const items = [
      { name: 'Events', code: '#34495e' }, { name: 'Movies', code: '#16a085'}, 
      { name: 'Debts', code: '#95a5a6' },{ name: 'Login', code: '#2980b9' } /*, { name: 'Debts', code: '#27ae60' },
      { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
      { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
      { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
       { name: 'ORANGE', code: '#f39c12' },
      { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
      { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },*/
    ];

    const { navigate } = this.props.navigation;
    return (
      <View style={{ height: 100, flex: 1 }}>
        <Header style={styles.title} onPress={() => navigate('Movies')}
          centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontWeight:'600', fontSize: 20  } }}
          innerContainerStyles={{ backgroundColor: '#36465d' }}
          outerContainerStyles={{ backgroundColor: '#36465d' }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
         <ImageBackground source={require('./images/abstract.jpg')} style={{width: '100%', height: '100%'}}>
        <GridView
          itemDimension={130}
          items={items}
          style={styles2.gridView}
          renderItem={item => (
            <TouchableHighlight onPress={() => this.navigateToMovies(item.name)}>
            <View style={[styles2.itemContainer, { backgroundColor: item.code }]}>
              <Text style={styles2.itemName}>{item.name}</Text>
              <Text style={styles2.itemCode}>{item.code}</Text>
              
            </View>
            </TouchableHighlight>
          )}
        />
        </ImageBackground>
        
      </View>




    );
  }
}

const MyApp = createBottomTabNavigator({
  Home: {
    screen: HomeScreen, navigationOptions: () => ({
      tabBarIcon: ({ tintColor }) => (
        <Icon
          name="home"
          type='font-awesome'
          color={tintColor}
          size={24}
        />
      )
    })
  },
  Events: { screen: Events, navigationOptions: () => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="calendar"
        type='font-awesome'
        color={tintColor}
        size={24}
      />
    )
  }) },
  // Settings: { screen: Settings },
  Movies: { screen: Movies, navigationOptions: () => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="tv"
        type='font-awesome'
        color={tintColor}
        size={24}
      />
    )
  }) },
  Debts: { screen: Debts, navigationOptions: () => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="euro"
        type='font-awesome'
        color={tintColor}
        size={24}
      />
    )
  }) },
  //Groups: { screen: Groups },
  Login: { screen: Login, navigationOptions: () => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name="user-circle"
        type='font-awesome'
        color={tintColor}
        size={24}
      />
    )
  }) },
}, {
    tabBarOptions: {
      activeTintColor: 'white',
      labelStyle: {
        fontSize: 12,
      },
      style: {
        backgroundColor: '#36465d',
      },
    } 
  });



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  style: {
    backgroundColor: 'blue',
  },});

const styles2 = StyleSheet.create({
  gridView: {
    paddingTop: 25,
    flex: 1,
    height: '100%'
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  }, 
  title: {
    fontSize: 16, 
    fontWeight: '600'
  }
});

/*<View style={{ flex: 2 }}>
          <Button style={styles.alerttext}
            onPress={() => navigate('Movies')}
            title="Movies"
          />
          <Button
            onPress={() => navigate('Settings')}
            title="Settings"
          />
        </View>
        */