import { db, auth } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const dreams_list = document.getElementById("dreams-list");
const dream_container = document.getElementById("dream-container");
// const mindmap_container = document.getElementById("mindmap-container");
// mindmap_container.addEventListener('drop', drop)

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

    const q = query(collection(db, "users/" + userId.uid + '/dreams'), orderBy("timestamp", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const data = doc.data()
    
        const newDream = document.createElement('li')
        newDream.classList.add('list-group-item'); 
        newDream.addEventListener("click", function(){ getDream(doc.id, userId.uid); }); 
        newDream.addEventListener('dragstart', dragStart);
        newDream.addEventListener('dragend', dragEnd);

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
function dragStart(event){

    console.log("drag started on ", event.target)
}

const map_element_container = document.getElementById('mindmap-container');

function dragEnd(event){
  let dream_container = event.target;
  while (dream_container.className != 'list-group-item'){
    console.log(event.target.parentElement)
    dream_container = dream_container.parentElement
  }
  const map_element = document.createElement('div');
  
  map_element.style.position = 'absolute'
  // map_element.style.zIndex = "1"
  map_element.style.left = `${event.clientX}px`
  map_element.style.top = `${event.clientY}px`; 
  
  const header = document.createElement('h4')
  header.textContent = dream_container.children[0].textContent
  const p = document.createElement('p')
  p.textContent = dream_container.children[1].textContent
  console.log(dream_container.children[1])

  map_element.appendChild(header)
  map_element.appendChild(p)

  map_element_container.appendChild(map_element)
  console.log("new element created", dream_container)

}


function drop(event){
  event.preventDefault();
  if (!draggedItem) console.log("No dragged item"); // Handle potential missing dragged item

  console.log("Dropped at", event.clientX)
}
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Add 1 for human-readable month
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    return formattedDate;
}

async function getDream(id, userId) {
    const dreamRef = doc(db, "users/" + userId + "/dreams", id);
    const dream = await getDoc(dreamRef);
    console.log(dream.data().dream)
    dream_container.innerHTML = `<p>${dream.data().dream}</p>`;
    return 0;
}

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