import { auth } from './firebase-init.js'
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const provider = new GoogleAuthProvider();

document.getElementById('signInButton').addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(credential,token,user)
      window.location.replace("./index.html")
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
})


// Initialize variables and elements
const body = document.body;
let cursorX = 0;
let cursorY = 0;
let images = [];
let imageFallDuration = 2000; // Customize fall duration in milliseconds

// Function to generate a random image element
function createRandomImage() {
  const image = document.createElement('img');
  image.src = `https://source.unsplash.com/random/50x50`; // Replace with your desired image source
  image.style.position = 'absolute';
  image.style.width = '50px';
  image.style.height = '50px';
  return image;
}

// Function to update cursor position based on mouse movement
function updateCursorPosition(event) {
  cursorX = event.clientX;
  cursorY = event.clientY;
}

// Function to handle image creation and falling animation
function handleImageFall() {
  const image = createRandomImage();
  image.style.left = cursorX + 'px';
  image.style.top = cursorY + 'px';
  body.appendChild(image);
  images.push(image);

  setTimeout(() => {
    image.style.transition = `top ${imageFallDuration}ms ease-in-out`;
    image.style.top = `${window.innerHeight + image.offsetHeight}px`;
  }, 0);

  setTimeout(() => {
    body.removeChild(image);
  }, imageFallDuration - 1500); // Add a slight delay to avoid image flicker
}

// Event listeners to trigger image creation
body.addEventListener('mousemove', updateCursorPosition);
// body.addEventListener('click', handleImageFall);
// const setIntervalId = setInterval(handleImageFall, 100);
// Initial image creation (optional)
// handleImageFall(); // Uncomment to add initial image on page load


