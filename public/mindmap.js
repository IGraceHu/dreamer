import { db, auth } from './firebase-init.js';
import { collection, getDocs, query, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
const dreams_list = document.getElementById("dreams-list");
const dream_container = document.getElementById("dream-container");
// const mindmap_container = document.getElementById("mindmap-container");
// mindmap_container.addEventListener('drop', drop)

function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('mindmap-container');
  strokeWeight(3);

  // const pos = {x: Math.random() * window.innerWidth + 1, y:Math.random() * window.innerHeight + 1}
}
let dragging = false;
let dotDragStartCoords = [0,0]
let lines = []
function draw() {
  clear()
  if(dragging){
    line(dotDragStartCoords[0], dotDragStartCoords[1], mouseX, mouseY)
  }
  for (const element in lines){
    const lineData = lines[element]
    line(lineData[0], lineData[1], lineData[2], lineData[3])
  }
}


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

async function loadUserImage(user) {
  document.getElementById("user-image").src = user.photoURL
}
async function generateDreams(userId) {

  const q = query(collection(db, "users/" + userId.uid + '/dreams'), orderBy("timestamp", "desc"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    const data = doc.data()

    const newDream = document.createElement('li')
    newDream.classList.add('list-group-item');
    newDream.addEventListener("click", function () { getDream(doc.id, userId.uid); });
    newDream.addEventListener('dragstart', dragStart);
    newDream.addEventListener('dragend', dragEnd);

    // Create the title element
    const title = document.createElement('h4');
    title.textContent = formatDate(new Date(data.timestamp.seconds * 1000));

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
function dragStart(event) {

  console.log("drag started on ", event.target)
}

const map_element_container = document.getElementById('mindmap-container');

function dragEnd(event) {
  let dream_container = event.target;
  while (dream_container.className != 'list-group-item') {
    dream_container = dream_container.parentElement
  }
  const map_element = document.createElement('div');

  map_element.className = 'mindmap-element';
  map_element.style.position = 'absolute';
  map_element.style.left = `${event.clientX -70}px`;
  map_element.style.top = `${event.clientY - 50}px`;

  // Child Elements
  const header = document.createElement('h4')
  header.textContent = dream_container.children[0].textContent

  // const closeButton = document.createElement('div')
  // closeButton.className = 'close-button'
  // closeButton.textContent = "X"
  // closeButton.addEventListener('click',() => closeDream(map_element))

  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-container'

  headerContainer.appendChild(header)
  // headerContainer.appendChild(closeButton)

  const p = document.createElement('p')
  p.textContent = dream_container.children[1].textContent.substring(0, 100)

  const directions = ['top','right','bottom','left']

  for(const element in directions){
    const selection_dot = document.createElement("div")
    selection_dot.classList.add('selection-dot', directions[element])
    
    selection_dot.draggable = true;
    selection_dot.addEventListener('dragstart',dotDragStart)
    selection_dot.addEventListener('dragend', dotDragEnd)
    selection_dot.addEventListener('dragover', dotDragOver)
    selection_dot.addEventListener('drop', () => dotDrop(event, map_element))
    map_element.appendChild(selection_dot)
  }
 
  map_element.appendChild(headerContainer)
  // map_element.appendChild(header)
  // map_element.appendChild(closeButton)
  map_element.appendChild(p)

  map_element.setAttribute('connected-lines', [])
  map_element_container.appendChild(map_element)
  // console.log("new element created", dream_container)

}

function closeDream(map_element){
  console.log(map_element)
  map_element.remove()
}

function dotDragStart(event){

  dragging = true;
  dotDragStartCoords = [mouseX, mouseY]
  console.log("dot drag start")
}
function dotDragEnd(event){
  dragging = false;
  console.log("dot drag end", event.target)
}

function dotDragOver(event){
  event.preventDefault();
  // event.dataTransfer.dropEffect = "move";

}
function dotDrop(event, mapElement){
  event.preventDefault();
  lines.push([dotDragStartCoords[0], dotDragStartCoords[1], mouseX, mouseY])

  //Record the lines which are connected to the element
  let connected_lines = mapElement.getAttribute('connected-lines')
  console.log("CONNECTED LINES", connected_lines)
  if (connected_lines){
    connected_lines.push(lines.length - 1)
  }
  else{
    connected_lines = [lines.length - 1]
  }
  mapElement.setAttribute('connected-lines', connected_lines);

  console.log(mapElement.getAttribute('connected-lines'))
  // mapElement.setAttribute('connected-lines', mapElement.getAttribute('connected-lines').push(lines.length - 1))
  console.log("dropped", event.target, connected_lines)
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

function userSignOut() {
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

//Exposes the p5 functions to the browser
window.setup = setup;
window.draw = draw;
