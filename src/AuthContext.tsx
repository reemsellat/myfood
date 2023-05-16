import { deleteUser,  onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signOut, updateCurrentUser, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import React from "react";
import { useContext } from "react";
import { db } from "./firebase";
import { deleteDoc, doc, DocumentData, DocumentSnapshot, getDoc, setDoc, updateDoc, where, WhereFilterOp } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import { ReactNode } from "react";
export let global_var = ''
const AuthContext = React.createContext<null>(null);
export function useAuth(): any {
    return useContext(AuthContext);
}
type Props = {
    children: ReactNode | JSX.Element | (() => JSX.Element) | undefined | string
}
export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState(Object)

    const getDefaultShoppingBasketCount = async () => {
        const uid=user.uid
        if(uid){
            console.log(uid)
             const docSnap = await getDocSnap('shopping_basket_count', uid)
             console.log(docSnap.data())
        if(docSnap.exists()){
           setShoppingBasketCount(docSnap.data().count) 
        }
        else{
            setShoppingBasketCount(0)
        }
        }
       
    }


    const [shoppingBasketCount, setShoppingBasketCount] = useState(Number)
    const IncreaseShoppingBasketCount = async () => {
        setShoppingBasketCount(shoppingBasketCount => shoppingBasketCount + 1)
        setDocData("shopping_basket_count", user.uid, {
            count:shoppingBasketCount+1
        })
        console.log(shoppingBasketCount)
    }
    const decreaseShoppingBasketCount = async (n: number) => {
        setShoppingBasketCount(shoppingBasketCount => shoppingBasketCount - n)
        setDocData("shopping_basket_count", user.uid, {
            count:shoppingBasketCount-n
        })
    }

    const logOut = () => {
        return signOut(auth)
    }
    const resetPassword = (email: string) => {
        return sendPasswordResetEmail(auth, email)
    }
    const emailUpdate = (email: string) => {
        return updateEmail(user, email)
    }
    const passwordUpdate = (password: string) => {
        return updatePassword(user, password)
    }
    const deleteAccount = () => {
        return deleteUser(user)
    }
    const verifyEmail = () => {
        return sendEmailVerification(user)
    }
    const getDocsOfCollectionWithFilter = (col: string, w1: string, w2: WhereFilterOp, w3: any) => {
        const q = query(collection(db, col), where(w1, w2, w3))
        const querySnapShot = getDocs(q)
        return querySnapShot
    }
    const getDocsOfCollection = (col: string) => {
        const q = query(collection(db, col))
        const querySnapShot = getDocs(q)
        return querySnapShot
    }
    const getDocSnap = (col: string, document: string) => {
        const docRef = doc(db, col, document)
        const docSnap: Promise<DocumentSnapshot<DocumentData>> | null = getDoc(docRef)
        return docSnap
    }
    const setDocData = (col: string, document: string, data: any) => {
        setDoc(doc(db, col, document), data)
    }
    const updateDocData = (col: string, document: string, data: any) => {
        updateDoc(doc(db, col, document), data)
    }
    const deleteDocData = (col: string, document: string) => {
        deleteDoc(doc(db, col, document))
    }
    const updateProfileNameAndPhoto = (name: string | null | undefined) => {
        updateProfile(user, {
            displayName: name,


        })
    }
    useEffect(() => {
        
       onAuthStateChanged(auth,async (user) => {
           await  updateCurrentUser(auth, user)
            setUser(user)
          
            console.log(shoppingBasketCount)

        })
  
      
       


    }, [])
  

    const value2: {
        user: Object,


        logOut: () => void,
        resetPassword: (a: string) => void,
        emailUpdate: (a: string) => void,
        passwordUpdate: (a: string) => void,
        deleteAccount: () => void,
        verifyEmail: () => void,
        getDocsOfCollection: (a: string) => void,
        getDocsOfCollectionWithFilter: (a: string, b: string, c: WhereFilterOp, d: any) => void,
        getDocSnap: (a: string, b: string, c: WhereFilterOp, d: any) => Promise<DocumentSnapshot<DocumentData>> | null,
        setDocData: (a: string, b: string, d: any) => void,
        updateDocData: (a: string, b: string, d: any) => void,
        deleteDocData: (a: string, b: string) => void,
        updateProfileNameAndPhoto: (a: string) => void,
        shoppingBasketCount: number,
        increaseShoppingBasketCount: () => void,
        decreaseShoppingBasketCount: (n: number) => void,
        getDefaultShoppingBasketCount:()=>void
    } =
    {
        user: user,


        logOut: logOut,
        resetPassword: resetPassword,
        emailUpdate: emailUpdate,
        passwordUpdate: passwordUpdate,
        deleteAccount: deleteAccount,
        verifyEmail: verifyEmail,
        getDocsOfCollection: getDocsOfCollection,
        getDocsOfCollectionWithFilter: getDocsOfCollectionWithFilter,
        getDocSnap: getDocSnap,
        setDocData: setDocData,
        updateDocData: updateDocData,
        deleteDocData: deleteDocData,
        updateProfileNameAndPhoto: updateProfileNameAndPhoto,
        shoppingBasketCount: shoppingBasketCount,
        increaseShoppingBasketCount: IncreaseShoppingBasketCount,
        decreaseShoppingBasketCount: decreaseShoppingBasketCount,
        getDefaultShoppingBasketCount:getDefaultShoppingBasketCount

    }

    return (
        <AuthContext.Provider value={value2}>
            {children}
        </AuthContext.Provider>
    )

}