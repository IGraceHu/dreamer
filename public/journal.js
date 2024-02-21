import { db } from './firebase-init.js';
import { collection, getDocs, doc, addDoc, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

const dataInput = document.getElementById('data-input');
const writeButton = document.getElementById('write-button');

async function handleButtonClick(){
  const data = dataInput.value;

    // const collectionRef = doc(db, '/dreams');


  try {
    const docRef = await addDoc(collection(db, "dreams"), {
      dream: data,
      timestamp: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
};

writeButton.addEventListener('click', handleButtonClick);
