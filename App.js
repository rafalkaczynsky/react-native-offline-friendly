import React from 'react';
import { StyleSheet, Platform, Image, Text, View, TextInput, Button} from 'react-native';
import RNRestart from 'react-native-restart'; 
import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      refresh: false
    };
   /* var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === true) {
        alert("connected");
     //   firebase.database().goOnline();
    
      } else {
        alert("not connected");
    //    firebase.database().goOffline();
      }
    });*/
  }

  componentWillMount() {
 
    const DeafualtApp = firebase.app()

    this.FirebaseReference = DeafualtApp.database().ref('AdminDetails')
    this.FirebaseReference.keepSynced(true)

    this.FirebaseReference.once('value', (snapshot) => {
      const AdminDetails = snapshot.val()
      const name = AdminDetails.name
      const surname = AdminDetails.surname
      console.log('AdminDetails');
      console.log(AdminDetails)
      console.log(name);
      console.log(surname);
      this.setState({name: name, surname: surname})
    })

    this.FirebaseReference.on('child_changed',  (snapshot) => {
      const AdminDetails = snapshot

      this.setState({
        [snapshot.key]: snapshot._value
      })
    });
    
  }

  

  updateRealtimeDatabase(value, recordName){
    if (recordName === 'name'){
      this.FirebaseReference.update({
        name: value
      })
    }
    if (recordName === 'surname'){
      this.FirebaseReference.update({
        surname: value
      })
    }
  }
  componentWillReceiveProps(){

  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./assets/RNFirebase512x512.png')} style={[styles.logo]} />
        <Text style={styles.welcome}>
          Welcome to the Firebase React Native {'\n'}App with offline persistance enabled!
        </Text>
        <View style={styles.modules}>
          <Text style={{ marginBottom: 10 }}>Name: <Text style={{fontWeight: 'bold', marginBottom: 30 }}>{this.state.name}</Text></Text>
          <Text style={{ marginBottom: 10 }}>Surname: <Text style={{fontWeight: 'bold', marginBottom: 30 }}>{this.state.surname}</Text></Text>

          <TextInput
            style={styles.textInput}
            underlineColorAndroid='transparent'
            placeholder='Enter your name'
            onChangeText={(txt)=>{
            // onChangeText event save text to the state object
            this.updateRealtimeDatabase(txt, 'name')
            }}
          />
          <TextInput
            style={styles.textInput}
            underlineColorAndroid='transparent'
            placeholder='Enter your surname'
            onChangeText={(txt)=>{
              // onChangeText event save text to the state object
              this.updateRealtimeDatabase(txt, 'surname')
            }}
          />

          <Button
            onPress={()=> RNRestart.Restart()}
            title="Reload App"
            color="#841584"
          />

        </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 80,
    marginBottom: 16,
    width: 80,
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
  textInput: {
    height: 40, 
    borderColor: 'grey', 
    backgroundColor: 'white', 
    borderWidth: 1, 
    marginBottom: 10, 
    fontSize: 12, 
    paddingLeft: 10
  },
  modules: {
    margin: 20,
    width: '80%'

  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
