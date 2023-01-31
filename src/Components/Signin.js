import React from "react";
import "./Signin.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function Signin() {

    const Googleprovider = new GoogleAuthProvider();
    const Facebookprovider = new FacebookAuthProvider();
    const [showInput, setShowInput] = useState(false);
    const [data, setData] = useState({});
    const [User, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser)
            console.log("User", User)
            window.location = '/';
        }
    });

    const handleGoogle = () => {
        signInWithPopup(auth, Googleprovider).then(
            (userCredential) => {
                console.log(userCredential.user)
            }).catch((error) => {
            })
    };

    const handleFacebook = () => {
        signInWithPopup(auth, Facebookprovider).then(
            (userCredential) => {
                console.log(userCredential.user)
            }).catch((error) => {
            })
    };

    const handleDisplay = () => {
        return {
            className: "signin-button",
            style: {
                display: showInput ? 'none' : 'flex',
                border: '2px solid #cacaca',
                height: '50px',
                width: '250px',
                borderRadius: '5px',
                backgroundColor: '#FFF',
                margin: '15px 0',
                alignItems: 'center',
                paddingLeft: '20px',
            }
        }
    }

    const handleInput = (event) => {
        let newInput = { [event.target.name]: event.target.value };
        setData({ ...data, ...newInput });
    }

    const handleSignin = () => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                console.log(userCredential.user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                if (error.message = "Firebase: Error (auth/email-already-in-use).") {
                    console.log("汪汪")
                    signInWithEmailAndPassword(auth, data.email, data.password)
                        .then((userCredential) => {
                            console.log(userCredential.user);
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorMessage)
                        })
                }
            })

    };

    return (
        <div className="button-container">
            <Link to={"/"} className="logo"></Link>
            {showInput && <>
                <div className="register-input-container">
                    <p><input className="register-input"
                        name="email"
                        placeholder="Email"
                        onChange={(event) => handleInput(event)}></input></p>
                    <p><input className="register-input"
                        name="password"
                        placeholder="Password"
                        onChange={(event) => handleInput(event)}></input></p>
                    <p><button className="email-signin-button" onClick={handleSignin}>繼續</button></p>
                    <p><button className="email-signin-button" onClick={() => setShowInput(!showInput)}>取消</button></p>
                </div>
            </>}
            <p><button  {...handleDisplay()} onClick={() => setShowInput(!showInput)}><img src="/images/email.png" className="icon" />　以Email繼續</button></p>
            <p><button  {...handleDisplay()} onClick={handleGoogle}><img src="/images/google.png" className="icon" />　以Google繼續</button></p>
            <p><button  {...handleDisplay()} onClick={handleFacebook}><img src="/images/facebook.png" className="icon" />　以Facebook繼續</button></p>
        </div>
    );
}
export default Signin
