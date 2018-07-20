/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    StatusBar,
    Modal,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    Keyboard
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Geolocation from 'react-native-geolocation-service';

import { PermissionsAndroid } from 'react-native';

import Highlight from 'react-native-highlight-words';

import { fetchWeather } from "./weatherAPI";

import { FloatingAction } from 'react-native-floating-action';

import '/Users/Manuel/WebstormProjects/fuckingWeather/_ionicons_svg_md-search.svg';

import FloatLabelTextInput from 'react-native-floating-label-text-input';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



const iconNames = {
    Default: 'md-time',
    Clear: 'md-sunny' ,
    Rain: 'md-rainy' ,
    Thunderstorm: 'md-thunderstorm' ,
    Clouds: 'md-cloudy' ,
    Snow: 'md-snow' ,
    Drizzle: 'md-umbrella' ,

};

const phrases = {
    Default: {
        title: "Fetching the Fucking Weather" ,
        subtitle: "Give me a Damn second" ,
        highlight: "Fucking",
        color: "#636363" ,
        background: "#9C9C9C",
    } ,
    Clear: {
        title: "It's Fucking Amaze Balls" ,
        subtitle: "Rock that Shit!" ,
        highlight: "Fucking",
        color: "#E32500" ,
        background: "#FFD017",
    } ,
    Rain: {
        title: "Rain rain go away" ,
        subtitle: "Stay inside and code all day" ,
        highlight: "away",
        color: "#004A96" ,
        background: "#2F343A" ,
    } ,
    Thunderstorm: {
        title: "Fucking Thunderstrike" ,
        subtitle: "Unplug all the shit" ,
        highlight: "Thunderstrike",
        color: "#FBFF46" ,
        background: "#020202" ,
    } ,
    Clouds: {
        title: "Cloud storage limit reached" ,
        subtitle: "error: 5000 - cirrocumulus" ,
        highlight: "limit",
        color: "#0044FF" ,
        background: "#939393" ,
    } ,
    Snow: {
        title: "Brain Fucking Freeze" ,
        subtitle: "You're not suppose to eat that shit!" ,
        highlight: "Fucking",
        color: "#021D4C" ,
        background: "#15A678" ,
    } ,
    Drizzle: {
        title: "Drizzy Fucking Drake" ,
        subtitle: "YOLO!" ,
        highlight: "Fucking",
        color: "#B3F6E4" ,
        background: "#1FBB68" ,
    } ,

};

const actions = [{
    text: 'Search for another city' ,
    icon: <Icon name={'md-add'}/> ,
    name: 'Search',
    position: 1,
    color: phrases['Default'].color,
}];


type Props = {};
export default class App extends Component<Props> {
    constructor(props){
        super(props);

        this.state = {
            lat: null,
            lon: null,
            temp: 0,
            weather:'Default',
            description: null,
            city: null,
            country: null,
            modalVisible: false,
        };

        this.getLocation = this.getLocation.bind(this);
        this.apiCall = this.apiCall.bind(this);
    }





    componentDidMount(){
        //navigator.geolocation.getCurrentPosition((position) => {console.log(position)}, error => {alert(error)}, {timeout: 1} )
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("GOT THE FUCKING POSITION DATA!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(position);
                this.setState({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                fetchWeather(this.state.lat,this.state.lon).then( res => this.setState({
                    temp: Math.round(res.temp),
                    weather: res.wweather
                }) )
            },
            (error) => {console.log(error)},
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
        );

    }

    getLocation(){
        navigator.geolocation.getCurrentPosition(
            (posData) => console.log(posData),

            (error) => console.log(error),

            {timeout: 1000}

        )
    }

    setModalVisible(visible){
        this.setState({
            modalVisible: visible
        });
    };


    apiCall(){
        const City = this.state.city;
        const Country = this.state.country;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${City},${Country}&appid=3a5fbdb21d0c6479ff9cff57c0e067bc&units=imperial`)
            .then(function (response) {
                return response.json();

            })
            .then((json) => {
                Keyboard.dismiss();
                this.setState({
                    temp: Math.round(json.main.temp),
                    weather: json.weather[0].main
                });
                if(json){
                    this.setModalVisible(!this.state.modalVisible)
                }else{
                    alert('Double Check the city and Country')
                }

            });
    }



  render() {
    return (
      <View style={[styles.container, {backgroundColor:phrases[this.state.weather].background}]}>

          <Modal
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={ () => {
                  alert('Modal has been closed')
              } }
          >
              <StatusBar hidden={true}/>
              <View style={{flex:1}}>
                  <View style={{flex:3}} >
                  </View>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <FloatLabelTextInput
                        placeholder={'City'}
                        value={this.state.city}
                        onChangeTextValue={(city) => this.setState({city})}

                    />
                      <FloatLabelTextInput
                          placeholder={'Country'}
                          value={this.state.country}
                          onChangeTextValue={(country) => this.setState({country})}

                      />
                      <Button onPress={ () => this.apiCall() } color={phrases[this.state.weather].background} title={'GO'}/>
                  </View>
                  <View style={{flex:3}} >
                    <TouchableHighlight onPress={ () => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                        <Text>
                            Hide modal
                        </Text>
                    </TouchableHighlight>
                  </View>
              </View>

          </Modal>

          <StatusBar hidden={true}/>

          <View style={styles.header}>

              <Icon name={iconNames[this.state.weather]} size={100} color={'white'}/>
              <Text style={styles.temp}>
                   {this.state.temp}°
              </Text>

          </View>

          <View style={styles.body}>
              <Highlight
                  style={styles.title}
                  searchWords={[phrases[this.state.weather].highlight]}
                  textToHighlight={phrases[this.state.weather].title}
                  highlightStyle={{color:phrases[this.state.weather].color}}/>
              <Text style={styles.subTitle}>
                  {phrases[this.state.weather].subtitle}
              </Text>

          </View>


          <FloatingAction onPressItem={() => this.setModalVisible(true)} color={phrases[this.state.weather].background} showBackground={false} floatingIcon={<Icon color={phrases[this.state.weather].color} size={25} name={'md-search'}/>} position={'right'} actions={ [{text:'search for city', color: phrases[this.state.weather].background, position:1, icon: <Icon size={16} color={phrases[this.state.weather].color} name={'md-add'}/>, name:'add' }] }/>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor:'#FFD017'
  },

    body:{
        flex: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        //backgroundColor: 'red',
        margin:10,
        paddingBottom:23

    },

    temp:{
        fontFamily: 'sans-serif-medium',
        fontSize:60,
        color:'white'
    },

    header:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 20,
        //backgroundColor: 'blue',
    },

    title:{
        fontFamily: 'sans-serif-condensed-bold',
        fontSize:78,
        color:'white',
        marginBottom:5
    },

    subTitle:{
        fontFamily: 'sans-serif-light',
        fontSize:20,
        color:'white'
    },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

});
