import React from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native';
import { createBottomTabNavigator, Alert, AsyncStorage } from 'react-native';
import { Header, statusBarProps, Button, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles } from 'react-native-elements'

import Expo from 'expo';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { List, ListItem } from 'react-native-elements'
import moment from 'moment';



export default class Events extends React.Component {
  static navigationOptions = {
    title: 'Events',
  };

  constructor(props) {
    super(props);
    this.state = { events: [], events2: [], token: '' }
  }


  findUserData = (day) => {
    this._retrieveData(day);
  }

  _retrieveData = async (day) => {

    try {
      const value = await AsyncStorage.getItem("jwt");
      if (value !== null) {
        this.setState({ token: value }, function(){this.FindEvents(day)});
      }
    } catch (error) {
      console.log(error);
    }
  }


  FindEvents = (day) => {
    const url = 'http://192.168.0.103:8080/EVENTS';
    fetch(url, { headers: { 'Authorization': this.state.token } }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ events: responseJson }, function(){this.compareDates(day)});
      });
  }

  compareDates = (day) => {
    const events = this.state.events;
    this.setState({ events2: [] });
    for (const s of events) {
      if (moment(s.date).format('YYYY-MM-DD') == day.dateString) {
        this.setState({
          events2: this.state.events2.concat([s])
        })
      }

    }
  }


  renderRow({ item }) {
    return (
      <ListItem
        title={item.eventName}
        subtitle={item.startingHour}
      />
    )
  }

  render() {
    return (<View style={styles.container}>
      <Header onPress={() => navigate('Movies')}
        centerComponent={{ text: 'EventCalendar',  style: { color: '#fff', fontWeight:'600', fontSize: 20  } }}
        innerContainerStyles={{ backgroundColor: '#36465d' }}
        outerContainerStyles={{ backgroundColor: '#36465d' }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
         <ImageBackground source={require('../images/abstract.jpg')} style={{width: '100%', height: '100%'}}>
      
      <Calendar style={styles.Calendar}
        // Initially visible month. Default = Date()
        //current={'2012-03-01'}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        //minDate={'2012-05-10'}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        //maxDate={'2012-05-30'}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => { this.findUserData(day) }}
        // Handler which gets executed on day long press. Default = undefined
        //onDayLongPress={(day) => {console.log('selected day', day)}}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        //monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        //onMonthChange={(month) => {console.log('month changed', month)}}
        // Hide month navigation arrows. Default = false
        //hideArrows={true}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        //renderArrow={(direction) => (<Arrow />)}
        // Do not show days of other months in month page. Default = false
        //hideExtraDays={true}
        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange={false}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        // Hide day names. Default = false
        hideDayNames={false}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={substractMonth => substractMonth()}
        // Handler which gets executed when press arrow icon left. It receive a callback can go next month
        onPressArrowRight={addMonth => addMonth()}
        markedDates={{
          '2018-11-19': { marked: true }
        }}
      />
      <FlatList style={styles.flatlist} keyExtractor={item => item.id}
        renderItem={this.renderRow}
        data={this.state.events2}
      />
      </ImageBackground>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%'
  }, 
  Calendar: {
    backgroundColor: '#F5F5F5'
  }, 
  flatlist: {
    backgroundColor: '#F5F5F5'
  }
});
