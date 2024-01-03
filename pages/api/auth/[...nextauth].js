import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from "@/firebase/base"

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            
            async authorize(credentials) {
                // console.log("Starting authorization process with credentials: ====>", credentials);

                try {
                    // console.log(`Attempting to sign in with Firebase for email: ==========> ${credentials.email}`);
                    const userCredential = await signInWithEmailAndPassword(
                        auth, 
                        credentials.email, 
                        credentials.password
                    );

                    // console.log("Firebase authentication successful. User credential: ======> ", userCredential);

                    if (userCredential.user) {
                        // console.log('User authenticated successfully. User: ======> ', userCredential.user);
                        return userCredential.user;
                    } else {
                        // console.log('Firebase authentication successful but no user object found. ========> ');
                        return null;
                    }
                } catch (error) {
                    // console.error('Error during Firebase authentication: ===========>', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        // Vous pouvez également ajouter des logs dans les callbacks si nécessaire
        signIn: async (user, account, profile) => {
            // console.log('Sign in callback called. User: ======> ', user);
            return true; // Continuez ou non l'authentification
        },
        // ... autres callbacks ...
    },
});
