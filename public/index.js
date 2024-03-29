
import { db, auth } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const dreams_list = document.getElementById("dreams-list");

let currentDreamDocRef;
let currentDreamListItem;
const dream_textarea_container = document.getElementById("dream-textarea-container");

const dream_hotbar = document.getElementById("dream-text-nav");
const dream_functions = document.getElementById("dream-functions");
const calendar_container = document.getElementById("calendar-container");



onAuthStateChanged(auth, (user) => {
    if (user) {
        generateDreams(user)
        loadUserImage(user)
        document.getElementById("new-dream-icon").addEventListener("click", ()=>newDream(user.uid)); 
        document.getElementById("del-dream").addEventListener("click", ()=>delDream()); 
        document.getElementById("analyze-button").addEventListener("click", ()=>openAnalysisPopUp());
        document.getElementById("story-button").addEventListener("click", ()=>openStoryPopup());  
        document.getElementById("visualize-button").addEventListener("click", ()=>openVisualizationPopup());  

        document.getElementById("calendar-button").addEventListener("click", ()=>toggleCalendar()); 
        document.getElementById("calendar-container").style.width = "700px";


      // Use userId here
    } else {
      // Handle user not signed in
      console.log("Please sign in")
      window.location.replace("./signin.html")

    }
  });

async function loadUserImage(user){
    document.getElementById("user-image").src = user.photoURL
}

async function generateDreams(userId){
    updateDreamBody();
    const addDream = document.getElementById("new-dream");
    addDream.addEventListener("click", function(){ newDream(userId.uid); }); 

    const q = query(collection(db, "users/" + userId.uid + '/dreams'), orderBy("timestamp", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const data = doc.data()
    
        const newDream = document.createElement('li')
        newDream.classList.add('list-group-item'); 
        newDream.addEventListener("click", ()=>getDream(doc.id, userId.uid, newDream));
 
    
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
  document.getElementById("dream-title").textContent = formatDate(new Date(dream.data().timestamp.seconds*1000));

  currentDreamDocRef = dreamRef;

  updateDreamBody();

  if (calendar_container.style.width == "700px") {
    toggleCalendar()
  }
  return 0;
}

function updateDreamBody() {
  if (currentDreamDocRef == null) {
    dream_hotbar.classList.add("invisible");
    dream_functions.classList.add("invisible");
  } else {
    dream_hotbar.classList.remove("invisible");
    dream_functions.classList.remove("invisible");
  }
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
  newDream.style.height = "0px"; 
  dreams_list.insertBefore(newDream, dreams_list.children[1]);

  getDream(dream.id, userId, newDream);
  updateDreamBody();

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
  // Animate it
  currentDreamListItem.style.height = "0px"; 

  dream_textarea_container.innerHTML = "";

  try {
    await deleteDoc(currentDreamDocRef);

    currentDreamDocRef = null;
    currentDreamListItem.remove();

    updateDreamBody();
    
    console.log("Document removed");
  } catch (e) {
    console.error("Error removing document: ", e);
  }
  
}

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

document.getElementById("sign-out-button").addEventListener("click", userSignOut)

async function openStoryPopup() {
  updateRecord(currentDreamDocRef, document.getElementById("dream-textarea").value);
  currentDreamListItem.children[1].innerHTML = document.getElementById("dream-textarea").value;

  document.getElementById("story-popup").style.display = "block";
  // document.getElementById("story-popup-content").textContent = "loading"

  const dream = await getDoc(currentDreamDocRef);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let dream_contents = dream.data().dream;
  if(dream_contents == ""){
    document.getElementById("story-popup-content").innerHTML = "Please write a dream before creating a story."
    return;
  }

  var raw = JSON.stringify({
    "dream": dream_contents
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'  };

  fetch("https://dreamjournalnode-6dhtfkqjha-uc.a.run.app/story", requestOptions)
    .then(response => response.text())
    .then(response => document.getElementById("story-popup-content").innerHTML = boldText(response))
    .catch(error => console.log('error', error));
  }


async function openAnalysisPopUp() {
  updateRecord(currentDreamDocRef, document.getElementById("dream-textarea").value);
  currentDreamListItem.children[1].innerHTML = document.getElementById("dream-textarea").value;

  document.getElementById("analysis-popup").style.display = "block";

  const dream = await getDoc(currentDreamDocRef);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let dream_contents = dream.data().dream;
  if(dream_contents == ""){
    document.getElementById("analysis-popup-content").innerHTML = "Please write a dream before analyzing."
    return;
  }

  var raw = JSON.stringify({
    "dream": dream_contents
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'  };

  fetch("https://dreamjournalnode-6dhtfkqjha-uc.a.run.app/interpret", requestOptions)
    .then(response => response.text())
    .then(response => document.getElementById("analysis-popup-content").innerHTML = boldText(response))
    .catch(error => console.log('error', error));
}

function boldText(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function toggleCalendar() {
  // Animate it
  if (calendar_container.style.width == "700px") {
    calendar_container.style.width = "0px";
  } else {
    calendar_container.style.width = "700px";
  }
}

let prev_dream;
async function save(){
  if (!document.getElementById("dream-textarea")){
    return;
  }
  let dream = document.getElementById("dream-textarea").value;
  
  if (prev_dream == dream)
  {
    return;
  }
  console.log("progress saved")
  await updateRecord(currentDreamDocRef, dream);
  prev_dream = dream;
}

setInterval(save, 2000);

function openVisualizationPopup(){
  isPirateDemo()
  document.getElementById("visualize-popup").style.display = "block";

  let parent = document.getElementById("visualize-popup-content");

  const video = document.createElement("video");
  video.src = "./videos/ships-in-coffee.mp4";
  video.style = "width:100%;border-radius:8px;"
  video.autoplay = true;
  video.loop = true;

  setTimeout(()=>{
    parent.replaceChildren(video);
  }, 6000)

}

let prev_dream_ref;

async function isPirateDemo(){
  let visualize_button = document.getElementById("visualize-button");
  if(!visualize_button || prev_dream_ref == currentDreamDocRef){
    return;
  }
  const dream = await getDoc(currentDreamDocRef);

  let dream_contents = dream.data().dream;

  if(dream_contents.substring(0, 10) == "Surrounded"){
    console.log("MATCHED")
    visualize_button.style.display = "block";
  }
  prev_dream_ref = currentDreamDocRef;
}

window.setInterval(isPirateDemo, 100)
