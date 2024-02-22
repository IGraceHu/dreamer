import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, addDoc  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
 
const dreams_list = document.getElementById("dreams-list");

async function getDreamList() {
    dreams_list.innerHTML = "";
    const q = query(collection(db, "dreams"), orderBy("timestamp", "desc"));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const data = doc.data()

        const newDream = document.createElement('li')
        newDream.classList.add('list-group-item'); 
        
        // Create the title element
        const title = document.createElement('h4');
        title.textContent = formatDate(new Date(data.timestamp.seconds*1000)); 

        // Create the content element
        const content = document.createElement('div');
        content.textContent = data.dream; 

        // Append the title and content to the new div
        newDream.appendChild(title);
        newDream.appendChild(content);
        // Append the new div to the target div

        newDream.addEventListener("click", function(){ getDream(doc.id); }); 
        dreams_list.appendChild(newDream);
    });
}

getDreamList();

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Add 1 for human-readable month
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    return formattedDate;
}

let currentDreamRef;
const dream_textarea = document.getElementById("dream-textarea");

async function getDream(id) {
    if (currentDreamRef != null) {
        updateRecord(currentDreamRef, document.getElementById("dream-textarea").value);
    }

    currentDreamRef = doc(db, "dreams", id);
    const dream = await getDoc(currentDreamRef);

    dream_textarea.value = dream.data().dream;
    getDreamList();
    return 0;
}


// const dataInput = document.getElementById('data-input');
// const writeButton = document.getElementById('write-button');

// async function addRecord(){
//   const data = dataInput.value;

//     // const collectionRef = doc(db, '/dreams');


//   try {
//     const docRef = await addDoc(collection(db, "dreams"), {
//       dream: data,
//       timestamp: serverTimestamp()
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
  
// };

writeButton.addEventListener('click', addRecord);

async function updateRecord(dreamRef, data){
    console.log(dreamRef);
    console.log(data);
    try {
      await updateDoc(dreamRef, {
        dream: data,
      });
      console.log("Document written with ID: ", dreamRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
  };