
import {getAuth, GoogleAuthProvider, type User}  from "firebase/auth";
import {app} from "./firebase"

// Initialize firebase authentication.
const auth = getAuth(app);

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


export { auth, authenticateRequest, provider, getUser };

