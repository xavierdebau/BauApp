import {writable} from 'svelte/store';
import { auth } from '../lib/firebase/firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from 'firebase/auth';

export const authStore = writable({
    user: null,
    loadings: true,
    data: {}
})

export const authHandlers = {
    signup: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password)
    },
    login: async (email,password) => {
        await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
       await signOut(auth)
    },
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent successfully.');
            // You can provide feedback to the user indicating that the email has been sent
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            throw error;
        }
    }

}