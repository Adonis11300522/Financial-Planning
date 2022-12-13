import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";
import { getFirestore } from "firebase/firestore";



// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB5FHDssbZP8oX_GAGwYE2Yt_NAWmr2dqI",
    authDomain: "finalcial.firebaseapp.com",
    projectId: "finalcial",
    storageBucket: "finalcial.appspot.com",
    messagingSenderId: "945829303385",
    appId: "1:945829303385:web:a47232a1777744bac6cd48"
  };
  // Initialize Firebase
//   initializeApp(firebaseConfig);
// export Firebase so it can be used elsewhere 
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

