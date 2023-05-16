
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import './styles/register_login.css'

import { auth } from "./firebase";
function Register() {
    const path=useRef('')
    const { updateProfileNameAndPhoto } = useAuth()
    const { setDocData } = useAuth()
    const [passwordError, setPasswordError] = useState(String)
    const [emailError, setEmailError] = useState(String)
    let navigate = useNavigate()

    const [result, setResult] = useState(String)
    const name = useRef<HTMLInputElement>(null)
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const confirmPassword = useRef<HTMLInputElement>(null)
    const addUser = async () => {


        await setDocData("users", getAuth().currentUser?.uid, {
            displayName: name.current?.value
        })
        navigate(path.current)
    }

    const signUp = (email: any, password: any): void => {
        createUserWithEmailAndPassword(auth, email, password).then(
            user => {
                console.log(user);
                updateProfileNameAndPhoto(name)
                return setResult("success");
            }

        ).catch(err => {
            path.current=''
            console.log(err.message);

            if (err.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                const p = document.getElementById("password-error") as HTMLParagraphElement
                p.style.display = "block"
                path.current=''
                return setPasswordError('weak password, it should be at least 6 characters')
            }
            else {
                if (err.message === "Firebase: Error (auth/email-already-in-use).") {
                    console.log('hiii')
                    const p = document.getElementById("email-error") as HTMLParagraphElement
                    p.style.display = "block"

                    path.current=''
                    return setEmailError("Email already in use")
                }
            }






        }).finally(()=>{
            if(path.current!=''){
                addUser()
            }
        })

    }

    const onhandleChange = async (e: any) => {
        path.current="/myfood/login"
        e.preventDefault()
        if (password.current?.value !== confirmPassword.current?.value) {
            const p = document.getElementById("password-error") as HTMLParagraphElement
            p.style.display = "block"
            return setPasswordError('passwords do not match')
        }

        signUp(email.current?.value, password.current?.value)

        console.log(result)








    }






    useEffect(() => {

    })
    return (
        <div className="flex-container-3">
            <div id="part-1">
               
                <h1>my food</h1>
            </div>

            <div id="part-2">
                <h1>Welcome!</h1>
                <h3>to <span style={{ color: 'rgb(252, 72, 102)' }}>My Food</span> </h3>
                <form onSubmit={onhandleChange}>
                    <label htmlFor='name'>Name</label>
                    <input type="text" id="name" ref={name}></input>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={email}></input>
                    <p id="email-error">{emailError}</p>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={password}></input>
                    <p id="password-error">{passwordError}</p>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" ref={confirmPassword}></input>
                    <div><button type="submit" className="submit">SIGN UP</button></div>
                    
                    <NavLink to='myfood/login'>Already have an account ?</NavLink>
                </form>
            </div>

        </div>
    )

}

export default Register;