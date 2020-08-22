import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCqiKWQGoSBEgXO12zGFgOFYtF6YQLXdV0",
  authDomain: "gardenplants-96576.firebaseapp.com",
  databaseURL: "https://gardenplants-96576.firebaseio.com",
  projectId: "gardenplants-96576",
  storageBucket: "gardenplants-96576.appspot.com",
  messagingSenderId: "110263311539",
  appId: "1:110263311539:web:9833991a2a212fdbbca4c6",
  measurementId: "G-K13E2K5F72"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();



// export  {
//    storage, firebase as default
//  }
export {storage}
export {db}
