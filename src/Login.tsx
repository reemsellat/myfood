
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "./firebase";

function Login() {
    const [emailError, setEmailError] = useState(String)
    const [passwordError, setPasswordError] = useState(String)
    const navigate = useNavigate()
    const path=useRef('/')
    const email = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)
    const logIn = (email: any, password: any): void => {
        signInWithEmailAndPassword(auth, email, password).then((user) => {
            path.current='/myfood'
            console.log(user)
        }

        ).catch(
            err => {
                document.getElementById('login')?.classList.remove('disable')
                path.current='';
                if (err.message === 'Firebase: Error (auth/user-not-found).') {
                    const p = document.getElementById("login-email-error") as HTMLParagraphElement
                    p.style.display = "block"

                    setEmailError('User not found')
                    
                }
                else {
                    if (err.message === 'Firebase: Error (auth/wrong-password).') {
                        const p = document.getElementById("login-password-error") as HTMLParagraphElement
                        p.style.display = "block"
                        setPasswordError('Wrong password')
                       
                    }
                }
            }
        ).finally(() => {
            if (path.current != '') {
                navigate(path.current)
            }
        })
    }
    const onhandleChange = async (e: any) => {
       
        e.preventDefault() 
        document.getElementById('login')?.classList.add('disable')
        logIn(email.current?.value, password.current?.value)
        
        


    }
    return (
        <div className="flex-container-3">
            <div id="part-1">

                <h1>my food</h1>
            </div>
            <div id="part-2">
            <h1 style={{marginBottom:"15vh"}}>Log in</h1>
       
            <form onSubmit={onhandleChange}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={email} required></input>
                <p id="login-email-error" className="error">{emailError}</p>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={password} required></input>
                <p id="login-password-error" className="error">{passwordError}</p>
                <div><button type="submit" className="submit" id="login" >Log In</button></div>
                <NavLink to='/myfood/register'>Don't have an account ?</NavLink>
            </form>
        </div>
        </div>

    )

}

export default Login;