import React from 'react';
import createBottomTabNavigator from 'react-native'
import { StyleSheet, View, TextInput, Alert, Image, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import { AsyncStorage } from "react-native"


export default class Add extends React.Component{
    static navigationOptions = {
        title: 'add',
      };


    constructor(props) {
        super(props);
        this.state = {  title:'', director:'', year:'', score:'' , token: ''}
    }
    
    handleSubmit = (event) => {
        event.preventDefault();
        var newMovie = {title: this.state.title, director: this.state.director, year: this.state.year, score: this.state.score};
        this._retrieveData(newMovie);    
      // ??  this.refs.simpleDialog.hide(); 
    }   

    addMovie = (movie) => {

        const url = 'http://192.168.0.103:8080/api/movies';
        fetch(url, {
            method: 'POST',
          headers: { 'Authorization': this.state.token,  'Content-Type': 'application/json'},
          body: JSON.stringify(movie)
        })
          .catch(err => console.error("1"))
          this.props.navigation.navigate('Movies');
    }

    _retrieveData = async (movie) => {
        try {
          const value = await AsyncStorage.getItem("jwt");
          if (value !== null) {
            this.setState({ token: value }, function(){this.addMovie(movie)});
          }
        } catch (error) {
            console.log("2")
        }
      }
    
    render(){
        return (
            <View>
            <FormInput onChangeText={(text) => this.setState({ title: text })}
            value={this.state.title} />
            <FormInput onChangeText={(text) => this.setState({ director: text })}
            value={this.state.director} />
            <FormInput onChangeText={(text) => this.setState({ year: text })}
            value={this.state.year} />
            <FormInput onChangeText={(text) => this.setState({ score: text })}
            value={this.state.score} />
            <Button rounded icon={{ name: 'save' }} onPress={this.handleSubmit} title="save" />
            </View>
        )
    }
   
}