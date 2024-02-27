
import { db, auth } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const dreams_list = document.getElementById("dreams-list");

let currentDreamDocRef;
let currentDreamListItem;
const dream_textarea_container = document.getElementById("dream-textarea-container");

const del_dream = document.getElementById("del-dream");
del_dream.addEventListener("click", function(){ delDream(); }); 

onAuthStateChanged(auth, (user) => {
    if (user) {
        generateDreams(user)
        loadUserImage(user)
      // Use userId here
    } else {
      // Handle user not signed in
      console.log("Please sign in")
      window.location.replace("./signin.html")

    }
  });

async function loadUserImage(user){
    document.getElementById("userImage").src = user.photoURL
}

async function generateDreams(userId){
    const addDream = document.getElementById("new-dream");
    addDream.addEventListener("click", function(){ newDream(userId.uid); }); 

    const q = query(collection(db, "users/" + userId.uid + '/dreams'), orderBy("timestamp", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const data = doc.data()
    
        const newDream = document.createElement('li')
        newDream.classList.add('list-group-item'); 
        newDream.addEventListener("click", function(){ getDream(doc.id, userId.uid, newDream); }); 
    
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
        dreams_list.appendChild(newDream);
    });
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Add 1 for human-readable month
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    return formattedDate;
}

async function getDream(id, userId, dreamListItem) {
  const dreamRef = doc(db, "users/" + userId + "/dreams", id);
  const dream = await getDoc(dreamRef);

  // If navigating from another note, update content
  if (currentDreamDocRef != null) {
    updateRecord(currentDreamDocRef, document.getElementById("dream-textarea").value);
    currentDreamListItem.children[1].innerHTML = document.getElementById("dream-textarea").value;
    currentDreamListItem.classList.remove("dream-active");

    dream_textarea_container.innerHTML = null;
  }
  currentDreamListItem = dreamListItem;
  currentDreamListItem.classList.add("dream-active");
  
  dream_textarea_container.innerHTML = '<textarea id="dream-textarea" class="form-control"></textarea>';
  document.getElementById("dream-textarea").value = dream.data().dream;

  currentDreamDocRef = dreamRef;
  console.log(currentDreamDocRef);

  return 0;
}

async function newDream(userId) {
  const id = await addRecord(userId, "");
  const dream = await getDoc(doc(db, "users/" + userId + "/dreams", id));
  console.log(dream);

  const newDream = document.createElement('li')
  newDream.classList.add('list-group-item'); 
  
  // Create the title element
  const title = document.createElement('h4');
  title.textContent = formatDate(new Date(dream.data().timestamp.seconds*1000)); 

  // Create the content element
  const content = document.createElement('div');

  // Append the title and content to the new div
  newDream.appendChild(title);
  newDream.appendChild(content);
  // Append the new div to the target div

  newDream.addEventListener("click", function(){ getDream(dream.id, userId, newDream); }); 
  dreams_list.insertBefore(newDream, dreams_list.children[1]);

  getDream(dream.id, userId, newDream);

  // Animate it
  let frameId = null;
  let height = 0;
  clearInterval(frameId);
  frameId = setInterval(frame, 5);
  function frame() {
    if (height == 97) {
      clearInterval(frameId);
    } else {
      height++; 
      newDream.style.height = height + "px"; 
    }
  }
}

async function delDream() {
  console.log("Del");
  console.log(currentDreamDocRef);
  try {
    await deleteDoc(currentDreamDocRef);

    currentDreamDocRef = null;
    currentDreamListItem.remove();
    dream_textarea.value = "";
    console.log("Document removed");
  } catch (e) {
    console.error("Error removing document: ", e);
  }
  
}

// const dataInput = document.getElementById('data-input');
// const writeButton = document.getElementById('write-button');

async function addRecord(userId, data) {
    // const collectionRef = doc(db, '/dreams');

  try {
    const docRef = await addDoc(collection(db, "users/" + userId + "/dreams" ), {
      dream: data,
      timestamp: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
};


async function updateRecord(dreamRef, data){
    try {
      await updateDoc(dreamRef, {
        dream: data,
      });
      console.log("Document written with ID: ", dreamRef.id);
      return dreamRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
  };


function userSignOut(){
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("sign out complete")
        window.location.replace("./signin.html")
      }).catch((error) => {
        // An error happened.
        console.log("Sign out error: " + error)
      });
}
document.getElementById("signOutButton").addEventListener("click", userSignOut)
