import { useState, useEffect, useContext, createContext } from 'react'

import firebase, { User } from 'firebase/app'
import 'firebase/auth'

import { useIsFirebaseInitialized } from './firebase-init'

export function useAnonymousLogin(): User | null | undefined {
    const [user, setUser] = useState<User | null | undefined>()
    const firebaseInitialized = useIsFirebaseInitialized()

    useEffect(() => {
        if (!firebaseInitialized) return

        const unsubscribe = firebase.auth().onAuthStateChanged(newUser => {
            setUser(newUser)
            if (newUser) {
                return
            }
            firebase
                .auth()
                .signInAnonymously()
                .catch(console.error)
        })

        return unsubscribe
    }, [firebaseInitialized])

    return user
}

const UserContext = createContext<User | null | undefined>(null)

export const UserProvider = UserContext.Provider

export function useUser(): User | null | undefined {
    return useContext(UserContext)
}
