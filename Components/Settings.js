import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {createBottomTabNavigator} from 'react-native';

export default class Setting extends React.Component{
    static navigationOptions = {
        title: 'Settings',
      };
      
      render() {
        return <View><Button title="Settings"/></View>;
      }
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      }
    });