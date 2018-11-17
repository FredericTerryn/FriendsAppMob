import { createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, FlatList } from 'react-native';


export default class Movies extends React.Component {
  static navigationOptions = {
    title: 'Movies',
    focused: true,
  };

  constructor(props) {
    super(props);
    this.state = { item: '', data: [], movies: [] };
  }

  buttonPressed = () => {
    this.setState({ data: [...this.state.data, { key: this.state.item }] });
  }

  FindMovies = () => {
    const url = 'http://192.168.0.103:8080/MOVIES';
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ movies: responseJson });
      })
      ;
  }

  render() {
    return (
      <View>
        <Text>Movie screen</Text>
        <Image style={{ width: 400, height: 250 }} source={require('../images/fight_club_2.jpg')} />
        <TextInput style={{ width: 200, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({ item: text })}
          value={this.state.item} />
        <Button onPress={this.buttonPressed} title="press me" />
        <FlatList data={this.state.data} renderItem={({ item }) => <Text>{item.key}</ Text>} />

        <Button title="FindMovies" onPress={this.FindMovies} />
        <FlatList keyExtractor={item => item.id} renderItem={({ item }) => <Text> {item.title}, {item.director} </Text>} data={this.state.movies} />
      </View>
    )
  }
}
