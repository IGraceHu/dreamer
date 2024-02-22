import { db, auth } from './firebase-init.js';
import { collection, getDocs, doc, addDoc, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
import { getRedirectResult, onAuthStateChanged, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const dataInput = document.getElementById('data-input');
const writeButton = document.getElementById('write-button');

async function handleButtonClick(){
  const data = dataInput.value;

  const userId = auth.currentUser.uid;

  try {
    const docRef = await addDoc(collection(db, "users/" + userId + "/dreams" ), {
      dream: data,
      timestamp: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
};



writeButton.addEventListener('click', handleButtonClick);
