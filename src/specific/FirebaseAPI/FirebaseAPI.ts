import firebase from "firebase/app";

var config = {
  apiKey: "AIzaSyDP2QtrnveGBnhw4OkRlKEsLnt4XYFkebU",
  authDomain: "newagent-f0f94.firebaseapp.com",
  databaseURL: "https://newagent-f0f94.firebaseio.com",
  projectId: "newagent-f0f94",
  storageBucket: "newagent-f0f94.appspot.com",
  messagingSenderId: "43691610662"
};
firebase.initializeApp(config);

export default firebase;
