import { createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { AsyncStorage } from "react-native";
import Login from "./Login.js";
import { Header, statusBarProps, Button, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles }
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
    this.state = {
      item: '', data: [], movies: [], token: '', loading: false,
      data: [],
      error: null
    };
    let arrayholder = [];
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

  FindUserData = () => {
    this._retrieveData();
  }

  FindMovies = () => {
    const url = 'http://192.168.0.103:8080/MOVIES';
    fetch(url, {
      headers: { 'Authorization': this.state.token }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ movies: responseJson });
        this.arrayholder = responseJson;
      });
  }

  DeleteMovieById = (id) => {
    const url = 'http://192.168.0.103:8080/api/movies/' + id;
    fetch(url, {
      method: 'DELETE'
      , headers: { 'Authorization': this.state.token }
    })
      .then((response) => this.FindMovies())
      .catch(err => console.error(err))
  }


  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("jwt");
      if (value !== null) {
        this.setState({ token: value }, this.FindMovies);
      }
    } catch (error) {
      console.log(error);
    }
  }

  actionOnRow = (item) => {
    console.log(item.title);
  }

  renderRow({ item }) {
    return (
      <TouchableWithoutFeedback>
      <View>
        <ListItem
          title={item.title}
          subtitle={item.director}
        />
      </View>
      </TouchableWithoutFeedback>
    )
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ movies: newData });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header onPress={() => navigate('Movies')}
          centerComponent={{ text: 'Movies', style: { color: '#fff', fontWeight: '600', fontSize: 20 } }}
          innerContainerStyles={{ backgroundColor: '#36465d' }}
          outerContainerStyles={{ backgroundColor: '#36465d' }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
         <TouchableWithoutFeedback onPress={() => this.FindUserData()}> 
         <View>
        <Text>"qsdlfmkjqsdlfkj"</Text>
        </View>
         </TouchableWithoutFeedback>
        <SearchBar
          placeholder="Find a movie..."
          lightTheme
          round
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
        />
        <Text> </Text>
        <Button rounded icon={{ name: 'refresh' }} title=" Movies " onPress={() => this.FindUserData()} />
        <Text></Text>
        <Button rounded icon={{ name: 'delete' }} title=" Movies " onPress={() => this.DeleteMovieById(1)} />
        <FlatList keyExtractor={item => item.title}
          style={styles.flatlist}
          renderItem={({item}) => <TouchableWithoutFeedback onPress={() => this.DeleteMovieById(item.id)}>
          <View>
            <ListItem
              title={item.title}
              subtitle={item.director}
            />
          </View>
          </TouchableWithoutFeedback>}
          data={this.state.movies} />
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