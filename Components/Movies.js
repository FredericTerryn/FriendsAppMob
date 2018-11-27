import { createBottomTabNavigator } from 'react-navigation';
import React from 'react';
import { StyleSheet, View, TextInput, Alert, Image, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { AsyncStorage } from "react-native";
import Login from "./Login.js";
import { Header, statusBarProps, Button, leftComponent, centerComponent, rightComponent, backgroundColor, outerContainerStyles, innerContainerStyles }
  from 'react-native-elements'
import { SearchBar, Text } from 'react-native-elements'
import { List, ListItem } from 'react-native-elements'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { SecureStore } from 'expo';
import Dialog, { SlideAnimation, DialogContent, DialogButton } from 'react-native-popup-dialog';
import { Icon } from 'react-native-elements'
import {SERVER_URL} from '../constant.js'


export default class Movies extends React.Component {
  static navigationOptions = {
    title: 'Movies',
    focused: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      item: '', data: [], movies: [],        //states used to show list of movies
      token: '',                             //token used to temporarely save usertoken
      loading: false, data: [], error: null,  //states for searchbar
      visible: false, title: '', director: '',                 //infodialog 
      visible2: false, year:'', score:''
    };
    let currentid = 0;
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
      console.log(SERVER_URL)
      this._retrieveData();
  }

  FindMovies = () => {
    const url = (SERVER_URL + 'MOVIES');
    fetch(url, {
      headers: { 'Authorization': this.state.token }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ movies: responseJson });
        this.arrayholder = responseJson;
      });
  }

  DeleteMovieById = () => {
    const url = (SERVER_URL +'api/movies/' + this.currentid);
    fetch(url, {
      method: 'DELETE'
      , headers: { 'Authorization': this.state.token }
    })
      .then((response) => this.FindMovies())
      .catch(err => console.error(err))
    this.setState({ visible: false });

  }

  _retrieveUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("jwt");
      if (value == null || value == undefined ) {
        Alert.alert("You need to be logged in to see movies")
        this.props.navigation.navigate('addMovie');
    } else {
        this.setState({ token: value });
      }
    } catch (error) {
      console.log(error);
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("jwt");
      if (value == null || value == undefined ) {
        Alert.alert("You need to be logged in to see movies")
        this.props.navigation.navigate('addMovie');
    } else {
        
        this.setState({ token: value }, function(){this.FindMovies()});
      }
    } catch (error) {
      console.log(error);
    }
  }

  _retrieveData2 = async (movie) => {
    try {
      const value = await AsyncStorage.getItem("jwt");
      if (value == null || value == undefined ) {
        Alert.alert("You need to be logged in to see movies")
    } else {
      this.setState({ token: value }, function(){this.addMovie(movie)});
    }
    } catch (error) { 
        console.log("2")
    }
  }

  addMovie = (movie) => {

    const url = (SERVER_URL + 'api/movies');
    fetch(url, {
        method: 'POST',
      headers: { 'Authorization': this.state.token,  'Content-Type': 'application/json'},
      body: JSON.stringify(movie)
    })
      .catch(err => console.error("1"))
      this.setState({title:''})
      this.setState({director:''})
      this.setState({year:''})
      this.setState({score:''})
      this.setState({visible2: false}) 
    }

  actionOnRow = (item) => {
    console.log(item.title);
  }

  handleSubmit = () => {
    var newMovie = {title: this.state.title, director: this.state.director, year: this.state.year, score: this.state.score};
    this._retrieveData2(newMovie);    
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

  showDialogFromMovie = (item) => {
    this.setState({ title: item.title });
    this.setState({ director: item.director });
    this.setState({ year: item.year})
    this.setState({ score: item.score})
    this.currentid = item.id;
    this.setState({ visible: true });
  }



  addMovieNavigation = () => {
    this.props.navigation.navigate('addMovie');
  }

  render() {
    this._retrieveUserData(); 
 
    return (
      <View style={styles.container}>
        <Header onPress={() => navigate('Movies')}
          centerComponent={{ text: 'Movies', style: { color: '#fff', fontWeight: '600', fontSize: 20 } }}
          innerContainerStyles={{ backgroundColor: '#36465d' }} 
          outerContainerStyles={{ backgroundColor: '#36465d' }}
          leftComponent={{ icon: 'add', color:'#fff', onPress: () => this.setState({visible2: true})}}
          rightComponent={{ icon: 'refresh', color: '#fff', onPress: () => this.FindUserData() }}
        />
        <TouchableWithoutFeedback onPress={() => this.FindUserData()}>
          <View>
          </View>
        </TouchableWithoutFeedback>
        <SearchBar
          placeholder="Find a movie..."
          lightTheme
          round
          onChangeText={text => this.searchFilterFunction(text)}
          autoCorrect={false}
        />
        <Dialog
          actions={[
            <DialogButton text="CLOSE" align="center" onPress={() => this.setState({ visible: false })} />,
            <DialogButton text=" DELETE MOVIE " textStyle={{ color: 'red' }} align="center" onPress={() => this.DeleteMovieById()} />,
          ]}
          onTouchOutside={() => this.setState({ visible: false })}
          visible={this.state.visible}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom'
          })}
        >
          <DialogContent>
            <Text h3>{this.state.title}               </Text>
            <Text h4 style={styles.baseText}>Director:</Text>
            <Text h4>{this.state.director}</Text>
            <Text h4>{this.state.year}</Text> 
            <Text h4 style={styles.baseText}>Score (out of 10)</Text>
            <Text h4>{this.state.score}</Text>
          </DialogContent>
        </Dialog>
        <Dialog
          actions={[
            <DialogButton text="CLOSE" align="center" onPress={() => this.setState({ visible2: false })} />,
            <DialogButton text="ADD MOVIE" textStyle={{ color: 'green' }} align="center" onPress={() => this.handleSubmit()}  />,
          ]}
          onTouchOutside={() => this.setState({ visible2: false })}
          visible={this.state.visible2}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom'
          })} 
        >
          <DialogContent>
          <FormLabel>Title</FormLabel>
          <FormInput onChangeText={(text) => this.setState({ title: text })}
            value={this.state.title} />
            <FormLabel>Director</FormLabel>
            <FormInput onChangeText={(text) => this.setState({ director: text })} 
            value={this.state.director} />
            <FormLabel>Year</FormLabel>
            <FormInput onChangeText={(text) => this.setState({ year: text })}
            value={this.state.year} />
            <FormLabel>Score</FormLabel>
            <FormInput onChangeText={(text) => this.setState({ score: text })} 
            value={this.state.score} />
          </DialogContent>
        </Dialog>
        <FlatList keyExtractor={item => item.title}
          style={styles.flatlist}
          renderItem={({ item }) => <TouchableWithoutFeedback onPress={() => this.showDialogFromMovie(item)}>
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
    backgroundColor: '#fff',
    height: '100%'
  },
  flatlist: {
    backgroundColor: '#fff'
  } , 
  baseText : {
    color: 'grey'
  }
});