import React,{ createContext, useState, useEffect } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import {ChildrenProps} from 'util/MyTypes';
import { app } from "./Firebase";


const AuthContext = createContext({user : null as User | null});

export const AuthContextProvider = ({children}:ChildrenProps) => {
    const [currentUser, setCurrentUser] = useState<User|null>(null);
    const auth = getAuth(app);

    useEffect(()=>{
        onAuthStateChanged(auth, user => {
            setCurrentUser(user);
        });
    },[auth])

    return <AuthContext.Provider value={{user: currentUser}}>{children}</AuthContext.Provider>
}

export default AuthContext;
