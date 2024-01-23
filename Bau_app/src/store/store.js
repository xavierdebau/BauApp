import {writable} from 'svelte/store';
import { auth } from '../lib/firebase/firebase';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';

export const authStore = writable({
    user: null,
    loadings: true,
    data: {}
})

export const authHandlers = {
    login: async (email,password) => {
        await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
        await signOut(auth)
    }

}