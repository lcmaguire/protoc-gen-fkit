
import { GoogleAuthProvider, signInWithPopup, type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"
  
import { writable } from 'svelte/store';
  

async function authenticateRequest(user : User){
    let token = await user.getIdToken(false)

    let headers = new Headers();
    headers.set("Authorization", "Bearer " + token);
    return headers
}

// todo include all auth providers
const provider = new GoogleAuthProvider();

const currentUser = writable(auth.currentUser)

onAuthStateChanged(auth, (user) => {
    currentUser.set(user)
});

async function login() {
    await signInWithPopup(auth, provider).then((result) => {
        currentUser.set(result.user)
    }).catch((error) => {
        console.log(error)
    });
}

export { authenticateRequest, login ,currentUser};

