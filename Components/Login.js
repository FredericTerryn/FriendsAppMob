import React, { Component } from 'react';
import Movies from './Movies';
import { StyleSheet, Text, View, TextInput, Alert, ImageBackground, FlatList } from 'react-native';
import { AsyncStorage } from "react-native"
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import { Header, statusBarProps, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles } from 'react-native-elements'
import { SecureStore } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';


class Login extends Component {

    static navigationOptions = {
        title: 'Login',
        focused: true,
    };


    constructor(props) {
        super(props);
        this.state = {
            username: '', password: '', jwtToken: '',
            isAuthenticated: false, token: ''
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
                const token = res.headers.get('Authorization')
                
                this.setState({ jwtToken: token });
                if (token !== null) {
                    this._storeData(token);
                     this.setState({ isAuthenticated: true }); 
                     this._retrieveData();    //overbodig toch??
                } else {
                    this.dropdown.alertWithType('error', 'Login Failed', "Wrong username/ Password");
                }
            })
            .catch(err => console.error(err))
    }

    logout = () => {
        AsyncStorage.removeItem("jwt");
        this.setState({isAuthenticated : false}); 
    }

    _storeData = async (usertoken) => {
        try {
            await AsyncStorage.setItem("jwt", (usertoken));
        } catch (error) {
            console.log(error);
        }
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem("jwt");
            if (value !== null) {
                this.setState({ token: value });
            }
        } catch (error) {
             console.log(error);
        }
    }

    render() {
        if (this.state.isAuthenticated === true) {
            return (
                <View>
                    <Header onPress={() => navigate('Movies')}
                        centerComponent={{ text: 'FRIENDS',  style: { color: '#fff', fontWeight:'600', fontSize: 20  }  }}
                        innerContainerStyles={{ backgroundColor: '#36465d' }}
                        outerContainerStyles={{ backgroundColor: '#36465d' }}
                        rightComponent={{ icon: 'home', color: '#fff' }}
                    />
                    <ImageBackground source={require('../images/abstract.jpg')} style={{width: '100%', height: '100%'}}>
                     <Button rounded icon={{ name: 'send' }} onPress={this.logout} title="Logout" />
                     </ImageBackground>
                </View>
            )
        }
        else {
            return (
                <View>
                    <Header onPress={() => navigate('Movies')}
                        centerComponent={{ text: 'FRIENDS',  style: { color: '#fff', fontWeight:'600', fontSize: 20  }  }}
                        innerContainerStyles={{ backgroundColor: '#36465d' }}
                        outerContainerStyles={{ backgroundColor: '#36465d' }}
                    />
                    <ImageBackground source={require('../images/abstract.jpg')} style={{width: '100%', height: '100%'}}>
                    
                    <FormLabel>Username</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({ username: text })}
                        value={this.state.username} />
                    <FormLabel>Password</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password} />
                    <Text></Text>
                    <Button rounded icon={{ name: 'send' }} onPress={this.login} title="Login" />
                    <DropdownAlert ref={ref => this.dropdown = ref} />
                    </ImageBackground>
                    
                </View>
            );
        }
    }
}

export default Login;