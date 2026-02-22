const firebaseConfig = {
  apiKey:            "AIzaSyB4hTSpP8p7EUCZq9OfROl4IW3E8UQRxuw",
  authDomain:        "online-course-plat.firebaseapp.com",
  projectId:         "online-course-plat",
  storageBucket:     "online-course-plat.firebasestorage.app",
  messagingSenderId: "574048213847",
  appId:             "1:574048213847:web:4ddb4b8210cd1ff51d7c12"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
