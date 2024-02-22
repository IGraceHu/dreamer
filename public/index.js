import { db, auth } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const dreams_list = document.getElementById("dreams-list");
const dream_container = document.getElementById("dream-container");

// console.log(auth.currentUser)
// const userId = auth.currentUser.uid;

onAuthStateChanged(auth, (user) => {
    console.log("auth state changed")
    if (user) {
        generateDreams(user)
        loadUserImage(user)
      // Use userId here
    } else {
      // Handle user not signed in
      console.log("Please sign in")
      window.location.replace("./signIn.html")

    }
  });

async function loadUserImage(user){
    document.getElementById("userImage").src = user.photoURL
    console.log(user)
}
async function generateDreams(userId){

    const q = query(collection(db, "users/" + userId.uid + '/dreams'), orderBy("timestamp", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        const data = doc.data()
    
        const newDream = document.createElement('li')
        newDream.classList.add('list-group-item'); 
        newDream.addEventListener("click", function(){ getDream(doc.id); }); 
    
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

async function getDream(id) {
    const dreamRef = doc(db, "dreams", id);
    const dream = await getDoc(dreamRef);

    dream_container.innerHTML = `<p>${dream.data().dream}</p>`;
    return 0;
}

function userSignOut(){
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("sign out complete")
        window.location.replace("./signIn.html")
      }).catch((error) => {
        // An error happened.
        console.log("Sign out error: " + error)
      });
}
document.getElementById("signOutButton").addEventListener("click", userSignOut)