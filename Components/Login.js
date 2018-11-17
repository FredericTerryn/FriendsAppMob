import React, { Component } from 'react';
import Movies from './Movies';
import { StyleSheet, Text, View, Button, TextInput, Alert, Image, FlatList } from 'react-native';
import { AsyncStorage } from "react-native"


class Login extends Component {

    static navigationOptions = {
        title: 'Login',
        focused: true,
      };
    

    constructor(props) {
        super(props);
        this.state = {
            username: '', password: '',jwtToken: '',
            isAuthenticated: false, 
        };
    }

    login = () => {
        const url = 'http://192.168.0.103:8080/';
        const user = { username: this.state.username, password: this.state.password };
        fetch(url + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        })
            .then(res => {
                const token =  res.headers.get('Authorization') 
                Alert.alert(token);
               this.setState({ jwtToken: token});
                if (this.state.jwtToken !== null) {
                    this._storeData;
                    this.setState({ isAuthenticated: true });
                }
            })
            .catch(err => console.error(err))
    }

    _storeData = async () => {
        try {
          await AsyncStorage.setItem("jwt", this.state.jwtToken);
        } catch (error) {
          // Error saving data
        }
      }

    render() {
        if (this.state.isAuthenticated === true) {
            return (< Movies />)
        }
        else {
            return (
                <View>
                    <Text>qlsmd</Text>
                    <TextInput style={{ width: 200, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={(text) => this.setState({ username: text })}
                        value={this.state.username} />
                    <TextInput style={{ width: 200, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password} />
                    <Button onPress={this.login} title="Login" />
                </View>
            );
        }
    }
}

export default Login;