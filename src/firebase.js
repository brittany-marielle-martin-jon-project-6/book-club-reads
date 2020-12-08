import firebase from 'firebase/app';
import 'firebase/database';




    const firebaseConfig = {
            apiKey: "AIzaSyA87pRApsH2HcpcixtBcOGe4gsRqyIwQ2s",
        authDomain: "project-6-507f3.firebaseapp.com",
        projectId: "project-6-507f3",
        storageBucket: "project-6-507f3.appspot.com",
        messagingSenderId: "418153390359",
        appId: "1:418153390359:web:fdacdd374f5353ad9d9752"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    

    export default firebase;