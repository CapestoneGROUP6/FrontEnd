import { FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import API from "./APIService";
import { LoginSignUpResponse } from "types";

export const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyATmTxSCrtLWDqVxpFaCnoP3BFmYkDtSa4",
    authDomain: "capstone-de1c6.firebaseapp.com",
    projectId: "capstone-de1c6",
    storageBucket: "capstone-de1c6.appspot.com",
    messagingSenderId: "422271767012",
    appId: "1:422271767012:web:be6c2ddcb80676062e37f1"
};;

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const handleGoogleSign = async () => {
    try {
        const response = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(response);
        if (credential) {
            const user: User = response.user;
            const { email, uid, displayName, phoneNumber } = user;
            const loginResponse = await API.getInstance().post(
                "/auth/google",
                {
                    email,
                    uid,
                    displayName,
                    phoneNumber,
                }
            );
            return loginResponse.data as LoginSignUpResponse;
        } else {
            return {
                status: false,
            };
        }
    } catch (error) {
        console.error("Google sign-in error:", error);
        return {
            status: false,
        };
    }
};

export default app;
