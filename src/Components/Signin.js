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
            // console.log("User", User)
            if (window.location.pathname != "/canvas") {
                window.location = '/';
            }
        }
    });

    const handleGoogle = () => {
        signInWithPopup(auth, Googleprovider).then(
            (userCredential) => {
                // console.log(userCredential.user)
            }).catch((error) => {
            })
    };

    const handleFacebook = () => {
        signInWithPopup(auth, Facebookprovider).then(
            (userCredential) => {
                // console.log(userCredential.user)
            }).catch((error) => {
            })
    };

    const handleDisplay = () => {
        return {
            className: "signin-button",
            style: {
                display: showInput ? 'none' : 'flex',
                border: '2px solid #ECECEC',
                height: '50px',
                width: '250px',
                borderRadius: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                margin: '15px 0',
                alignItems: 'center',
                paddingLeft: '20px',
                boxShadow: "0 2px 8px rgb(14 19 24 / 7%)",
            }
        }
    }

    const handleInput = (event) => {
        let newInput = { [event.target.name]: event.target.value };
        setData({ ...data, ...newInput });
    }

    function handleSignin() {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                console.log(userCredential.user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                if (error.message = "Firebase: Error (auth/email-already-in-use).") {
                    // console.log("汪汪")
                    signInWithEmailAndPassword(auth, data.email, data.password)
                        .then((userCredential) => {
                            console.log(userCredential.user);
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorMessage);
                        });
                }
            });

    }

    return <>
        <div className="singin">
            <div className="button-container">
                <div className="sigin-logo">
                <Link to={"/"} className="canvas-logo"></Link>
                </div>
                {showInput && <>
                    <div className="register-input-container">
                        <form>
                        <p><input className="register-input"
                            name="email"
                            placeholder="Email"
                            onChange={(event) => handleInput(event)}></input></p>
                        <p><input className="register-input"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={(event) => handleInput(event)}></input></p>
                        <p><button className="email-signin-button" onClick={handleSignin}>繼續</button></p>
                        </form>
                        <p><button className="email-signin-button" onClick={() => setShowInput(!showInput)}>取消</button></p>
                    </div>
                </>}
                <p><div className="sign-method" {...handleDisplay()} onClick={() => setShowInput(!showInput)}><img src="/images/email.png" className="icon" />　以Email繼續</div></p>
                <p ><div className="sign-method" {...handleDisplay()} onClick={handleGoogle}><img src="/images/google.png" className="icon" />　以Google繼續</div></p>
                <p ><div className="sign-method" {...handleDisplay()} onClick={handleFacebook}><img src="/images/facebook.png" className="icon" />　以Facebook繼續</div></p>
            </div>
        </div>
        </>;
}
export default Signin
