import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';

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
            authStore.update(store => {
                return {
                    ...store,
                    data: {
                        ...store.data,
                        userType: userType
                    }
                };
            });
    
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
