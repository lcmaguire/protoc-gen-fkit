
import {GoogleAuthProvider, type User}  from "firebase/auth";
import {auth} from "./firebase"

async function authenticateRequest(user : User){
    let token = await user.getIdToken(false)

    let headers = new Headers();
    headers.set("Authorization", "Bearer " + token);
    return headers
}

// todo include all auth providers
const provider = new GoogleAuthProvider();

function getUser() :User | null{
    return auth.currentUser
}

export {authenticateRequest, provider, getUser };

