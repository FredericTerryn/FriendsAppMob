import { createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, FlatList } from 'react-native';
import { AsyncStorage } from "react-native";
import Login from "./Login.js";
import { Header, statusBarProps,Button, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles }
  from 'react-native-elements'
import { SearchBar } from 'react-native-elements'
import { List, ListItem } from 'react-native-elements'
import { SecureStore } from 'expo';


export default class Movies extends React.Component {
  static navigationOptions = {
    title: 'Movies',
    focused: true,
  };

  constructor(props) {
    super(props);
    this.state = { item: '', data: [], movies: [], token: '' };
  }

  componentDidMount() {
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('jwt', 'fout');
    } catch (error) {
      // Error saving data
    }
  }

  buttonPressed = () => {
    this.setState({ data: [...this.state.data, { key: this.state.item }] });
  }

  findUserData = () => {
    this._retrieveData();
  }

  FindMovies = () => {
    
    const url = 'http://192.168.0.103:8080/MOVIES';

    fetch(url
      , {
        headers: { 'Authorization': this.state.token }
      }
    )
      .then((response) => response.json()) 
      .then((responseJson) => {
        this.setState({ movies: responseJson });
      })
      ;
  }

    _retrieveData = async () => {  

      try {
        const value = await AsyncStorage.getItem("jwt");
        if (value !== null) {
          this.setState({token: value} , this.FindMovies);
        }
      } catch (error) {
       console.log(error);
      }
    }
  

  search = () => {
    // some method
  }

  navigatoHome = () => {
    
  }

  renderRow ({ item }) {
    return (
      <ListItem 
        title= {item.title}
        subtitle = {item.director}
        button onPress = {() => this.navigatoHome}
        />
    )
  }

  render() {
    return (
      <View style={styles.container}> 
        <Header onPress={() => navigate('Movies')}
          centerComponent={{ text: 'Movies',  style: { color: '#fff', fontWeight:'600', fontSize: 20  }  }}
          innerContainerStyles={{ backgroundColor: '#36465d' }}
          outerContainerStyles={{ backgroundColor: '#36465d' }} 
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <SearchBar
          onChangeText={this.search}
          onClearText={this.search}
          placeholder='Type Here...' />
        <Image style={{ width: 400, height: 100 }} source={require('../images/fight_club_2.jpg')} />
        <Text> </Text>
        <Button rounded icon={{name : 'refresh'}} title=" Movies " onPress={this.findUserData}    />

        <FlatList keyExtractor={item => item.id} 
        style={styles.flatlist}
                  renderItem={this.renderRow} 
                  data={this.state.movies}
                  onPressRightIcon= {this.navigatesomewhere} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    height: '100%'
  }, 
  flatlist: {
    backgroundColor: '#fff'
  }
});