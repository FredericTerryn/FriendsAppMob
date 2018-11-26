import React from 'react';
import { StyleSheet, Text, View,ImageBackground , FlatList, Image } from 'react-native';
import { createBottomTabNavigator, Alert, AsyncStorage, Linking} from 'react-native';
import { Header, statusBarProps, Button, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles } from 'react-native-elements'

import Expo from 'expo';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { List, ListItem } from 'react-native-elements'
import moment from 'moment';



export default class Events extends React.Component {
  static navigationOptions = {
    title: 'Debts',
  };

  constructor(props) {
    super(props);
    this.state = { }
  }


  goToGoogle = () => {
    Linking.openURL('https://www.google.com/maps/search/?api=1&query=Iepersestraat+89+Moorslede');
  }
 

    render() {
        return (<View style={styles.container}>
            <Header onPress={() => navigate('Movies')}
                centerComponent={{ text: 'DEBTS',  style: { color: '#fff', fontWeight:'600', fontSize: 20  }  }}
                innerContainerStyles={{ backgroundColor: '#36465d' }}
                outerContainerStyles={{ backgroundColor: '#36465d' }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />
        <ImageBackground source={require('../images/abstract.jpg')} style={{width: '100%', height: '100%'}}>
        <Text></Text>
        <Button rounded icon={{ name: 'send' }}  title="Debts" onPress={() => this.goToGoogle()} />
  </ImageBackground>
        </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', 
    height: '100%'
  }
});
 