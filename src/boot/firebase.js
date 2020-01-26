import * as firebase from 'firebase/app';
 
import 'firebase/auth';
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyACUMZed1rwoCcuS0GUs-HSj3bpvskQBJ4",
  authDomain: "foods-d7ce5.firebaseapp.com",
  databaseURL: "https://foods-d7ce5.firebaseio.com",
  projectId: "foods-d7ce5",
  storageBucket: "foods-d7ce5.appspot.com",
  messagingSenderId: "949895647597",
  appId: "1:949895647597:web:29e9c3443aaa05fa210a64"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDb = firebaseApp.database();

export { firebaseAuth, firebaseDb }