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
            console.log("logOut")
            console.log(auth)
            setCurrentUser(null);
            window.location = '/'; 
        }).catch((error) => {
            console.log(error)
        });
    }

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            console.log(currentUser);
            setCurrentUser(currentUser);
        }
    });

    if (currentUser != null) {
        // console.log("currentUser",currentUser.photoURL)
        const profilepic=()=>{
            if(currentUser.photoURL!=null){
                return currentUser.photoURL
            }
            else{
                return "/images/defaultpic.png"
            }
        }
        return <>
            <div className="barcontain">
                <div className="bar">
                    <div><Link to={"/home"} className="logo"></Link></div>
                    <div className="auth">
                        <button className="logout-button" onClick={logOut}>登出</button>
                        <img className="Userphoto" src={profilepic()} />
                    </div>
                </div>
            </div>
        </>
    }
    else {
        return <>
            <div className="barcontain">
                <div className="bar">
                    <div><Link to={"/"} className="logo"></Link></div>
                    <div className="auth">
                        <Link to={"/register"} className="link">登入</Link>
                    </div>
                </div>
            </div>
        </>
    }
}
export default LogoBar