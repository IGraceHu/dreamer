 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
 import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyAYRc2Q924aSYmFbdWRDoAH5BMZJ2-mnGk",
   authDomain: "dream-journal-414600.firebaseapp.com",
   projectId: "dream-journal-414600",
   storageBucket: "dream-journal-414600.appspot.com",
   messagingSenderId: "411525342376",
   appId: "1:411525342376:web:0f74df039a32fe245d8e9d",
   measurementId: "G-35LEQN1PSE"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 const db = getFirestore(app)
 export { db }