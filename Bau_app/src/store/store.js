import { writable } from 'svelte/store';
import { auth,db } from '../lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

// Define la función updateUserData para actualizar los datos del usuario en Firestore
async function updateUserData(uid, userData) {
    const userDocRef = doc(db, 'users', uid); // Suponiendo que 'users' es la colección donde se almacenan los datos de usuario
    await setDoc(userDocRef, userData, { merge: true });
};

export const authStore = writable({
    user: null,
    loading: true,
    data: {}
});

export const authHandlers = {
    signup: async (email, password, userType) => {
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const user = credential.user;

            // Update authStore to include user type in the data object
            await updateUserData(user.uid, {email: email, userType: userType });
    
            return user;
        } catch (error) {
            console.error('Error signing up:', error.message);
            throw error;
        }
    },
    login: async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error logging in:', error.message);
            throw error;
        }
    },
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out:', error.message);
            throw error;
        }
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
};
