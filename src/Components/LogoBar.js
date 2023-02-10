import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import "../Components/LogoBar.css";

const LogoBar = () => {

    const [currentUser, setCurrentUser] = useState(null);

    const logOut = () => {

        signOut(auth).then(() => {
            // console.log("logOut")
            setCurrentUser(null);
            window.location = '/'; 
        }).catch((error) => {
            console.log(error)
        });
    }

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setCurrentUser(currentUser);
        }
    });

    const Barcontent = () => {
        if (currentUser != null) {
            console.log("currentUser",currentUser.photoURL)
            const profilepic = () => {
                if (currentUser.photoURL != null) {
                    return currentUser.photoURL
                }
                else {
                    return "/images/defaultpic.png"
                }
            }
            return <>
                <button className="logout-button" onClick={logOut}>登出</button>
                <img className="Userphoto" src={profilepic()} />
            </>
        }
        else {
            return <Link to={"/register"} className="link">登入</Link>
        }
    }

    return <>
        <div className="barcontain">
            <div className="bar">
                <div>
                    <Link to={"/home"} className="logo"></Link>
                </div>
                <div className="auth">
                    <Barcontent />
                </div>
            </div>
        </div>
    </>
}
export default LogoBar