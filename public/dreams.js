import { db } from './firebase-init.js';
import { collection, getDocs, query  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
 
const dream_container = document.getElementById("dream-container");

const q = query(collection(db, "dreams"));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
//   console.log(doc.id, " => ", doc.data());
  const data = doc.data()

  const newDiv = document.createElement('div');
    newDiv.classList.add('dream'); 

    // Create the title element
    const title = document.createElement('h3');
    title.textContent =formatDate(new Date(data.timestamp.seconds*1000)); 

    // Create the content element
    const content = document.createElement('div');
    content.textContent = data.dream; 

    const button = document.createElement('button');
    button.textContent = "Interpret"
    button.addEventListener("click", openInterpretationPopup)
    // Append the title and content to the new div
    newDiv.appendChild(title);
    newDiv.appendChild(content);
    newDiv.appendChild(button)
    // Append the new div to the target div
    dream_container.appendChild(newDiv);

});

function formatDate(date){
    const day = date.getDate();
    const month = date.getMonth() + 1; // Add 1 for human-readable month
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    return formattedDate;
}

function openInterpretationPopup(){
  document.getElementById("interpretationPopup").style.display = "block";
  document.getElementById("interpretationPopupText").textContent = "loading"

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "dream": "I woke up in a basement surrounded by rats"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'  };

  fetch("https://dreamjournalnode-6dhtfkqjha-uc.a.run.app/interpret", requestOptions)
    .then(response => response.text())
    .then(response => document.getElementById("interpretationPopupText").innerHTML = boldText(response))
    .catch(error => console.log('error', error));
  }

  function boldText(text) {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }
