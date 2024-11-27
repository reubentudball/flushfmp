// This should have a secrets file for the API keys and stuff, fix later

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC_uGVgmUDEPg2sQI-kojNkxBL-h_6bEjY",
    authDomain: "flush-d0dc1.firebaseapp.com",
    databaseURL: "https://flush-d0dc1-default-rtdb.firebaseio.com",
    projectId: "flush-d0dc1",
    storageBucket: "flush-d0dc1.appspot.com",
    messagingSenderId: "1071559938141",
    appId: "1:1071559938141:web:4b2d90728116457bdebdb4",
    measurementId: "G-1NVDEC21BK"
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
