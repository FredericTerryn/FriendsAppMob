import React from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native';
import { createBottomTabNavigator, Alert, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import { Header, statusBarProps, Button, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles } from 'react-native-elements'
import { TouchableOpacity } from 'react-native'
import Expo from 'expo';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { List, ListItem } from 'react-native-elements'
import moment from 'moment';
import CircleButton from 'react-native-circle-button';
import { Dialog, SlideAnimation, DialogContent, DialogButton } from 'react-native-popup-dialog';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'



export default class Events extends React.Component {
  static navigationOptions = {
    title: 'Events',
  };

  constructor(props) {
    super(props);
    this.state = {
      events: [], events2: [], token: '', compatible: false,
      visible: false,
      location: '', eventName: '', startingHour: '',
      fingerprints: false,
      result: '',
      visible2: false
    }
  }


  findUserData = (day) => {
    Platform.OS === 'android' ? this.showAndroidAlert(day) : this.scanFingerprint(day)

  }

  _retrieveData = async (day) => {

    try {
      const value = await AsyncStorage.getItem("jwt");
      if (value !== null) {
        this.setState({ token: value }, function () { this.FindEvents(day) });
      }
    } catch (error) {
      console.log(error);
    }
  }

  FindEvents = (day) => {
    this.setState({ events2: [] });
    const url = 'http://192.168.1.113:8080/EVENTS';
    fetch(url, { headers: { 'Authorization': this.state.token } }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ events: responseJson }, function () { this.compareDates(day) });
      });
  }

  addEvents = (event) => {
    const url = 'http://192.168.1.113:8080/EVENTS';
    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': this.state.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ events: responseJson }, function () { this.compareDates(day) });
      });
    }




compareDates = (day) => {
  const events = this.state.events;
  for (const s of events) {
    if (moment(s.date).format('YYYY-MM-DD') == day.dateString) {
      this.setState({
        events2: this.state.events2.concat([s])
      })
    }

  }
}



componentDidMount() {
  this.checkDeviceForHardware();
  this.checkForFingerprints();
}

checkDeviceForHardware = async () => {
  let compatible = await Expo.LocalAuthentication.hasHardwareAsync();
  this.setState({ compatible })
}

checkForFingerprints = async () => {
  let fingerprints = await Expo.LocalAuthentication.isEnrolledAsync();
  this.setState({ fingerprints })
}

scanFingerprint = async (day) => {
  let result = await Expo.LocalAuthentication.authenticateAsync('Scan your finger.');
  if (result.success) {
    this._retrieveData(day);
  } else {
    Alert.alert("You have to confirm your identity to see the events")
  }
}

showAndroidAlert = (day) => {
  Alert.alert(
    'Fingerprint Scan',
    'Place your finger over the touch sensor and press scan.',
    [
      {
        text: 'Scan', onPress: () => {
          this.scanFingerprint(day);
        }
      },
      { text: 'Cancel', onPress: () => console.log('Cancel'), style: 'cancel' }
    ]
  )
}

showDialogFromEvent = (item) => {
  this.setState({ eventName: item.eventName })
  this.setState({ startingHour: item.startingHour })
  this.setState({ location: item.location })
  this.setState({ visible: true });
}

addEvent = () => {
  var newEvent = { eventName: this.state.eventName, director: this.state.director, year: this.state.year, score: this.state.score };
  this.addEvents(newEvent); 
}


renderRow({ item }) {
  return (
    <ListItem
      title={item.eventName}
      subtitle={item.startingHour}
    />
  )
}

goToGoogle = () => {
  let location = this.state.location;
  Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + location);
}

render() {
  return (<View style={styles.container}>
    <Header onPress={() => navigate('Movies')}
      centerComponent={{ text: 'EventCalendar', style: { color: '#fff', fontWeight: '600', fontSize: 20 } }}
      innerContainerStyles={{ backgroundColor: '#36465d' }}
      outerContainerStyles={{ backgroundColor: '#36465d' }}
      rightComponent={{ icon: 'home', color: '#fff' }}
    />
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
    <Button rounded title="NEW" onPress={() => this.setState({ visible2: true })} />
    <Dialog
      actions={[
        <DialogButton text="CLOSE" align="center" onPress={() => this.setState({ visible: false })} />,
        <DialogButton text="SHOW ON MAP" textStyle={{ color: 'blue' }} align="center" onPress={() => this.goToGoogle()} />,
      ]}
      onTouchOutside={() => this.setState({ visible: false })}
      visible={this.state.visible}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom'
      })}
    >
      <DialogContent>
        <Text h1> Event: {this.state.eventName}</Text>
        <Text> starting hour: {this.state.startingHour}</Text>
        <Text> location: {this.state.location}</Text>

      </DialogContent>
    </Dialog>
    <Dialog
      actions={[
        <DialogButton text="CLOSE" align="center" onPress={() => this.setState({ visible: false })} />,
        <DialogButton text="SAVE" textStyle={{ color: 'blue' }} align="center" onPress={() => this.addEvent()} />,
      ]}
      onTouchOutside={() => this.setState({ visible: false })}
      visible={this.state.visible2}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom'
      })}
    >
      <DialogContent>
        <FormLabel>Eventname</FormLabel>
        <FormInput onChangeText={(text) => this.setState({ eventName: text })}
          value={this.state.eventName} />
        <FormLabel>Password</FormLabel>
        <FormInput onChangeText={(text) => this.setState({ startingHour: text })}
          value={this.state.startingHour} />
        <FormInput onChangeText={(text) => this.setState({ date: text })}
          value={this.state.date} />
        <FormInput onChangeText={(text) => this.setState({ location: text })}
          value={this.state.location} />

      </DialogContent>
    </Dialog>
    <FlatList style={styles.flatlist} keyExtractor={item => item.eventName} key={item => item.eventName}
      renderItem={({ item }) => <TouchableWithoutFeedback key={item.eventName} onPress={() => this.showDialogFromEvent(item)}>
        <View>
          <ListItem
            key={item.eventName}
            title={item.eventName}
            subtitle={item.startingHour}
          />
        </View>
      </TouchableWithoutFeedback>}
      data={this.state.events2}
    />

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
  },
  circlebutton: {
    marginBottom: '100%'
  }
});
// onPress={() => this.showDialogFromMovie(item)