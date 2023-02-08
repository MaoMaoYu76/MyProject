import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import "../Components/LogoBar.css";


const CanvasBar = (props) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [showSizeOptions, setSizeOptions] = useState(false);
    // props = size;
    const logOut = () => {
        signOut(auth).then(() => {
            console.log("logOut")
            setCurrentUser(null);
            window.location = '/';
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleSizeChange = (newSize) => {
        props.onSizeChange(newSize);
    };
    
    // console.log("props",props);
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setCurrentUser(currentUser);
        };
    });

    const Barcontent = () => {
        if (currentUser != null) {
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

    return (
        <div className="barcontain">
            <div className="bar">
                <div className="edit-function">
                    <Link to={"/home"} className="logo"></Link>
                    <div onClick={() => setSizeOptions(!showSizeOptions)}>調整尺寸
                        {showSizeOptions && <>
                            <div className="size-options">
                                <p className="size" onClick={() => handleSizeChange([1587.4, 2245,30])}>42*59.4cm</p>
                                <p className="size" onClick={() => handleSizeChange([529.1, 396.8,170])}>14*10.5cm</p>
                                {/* <p className="size">A4 size</p> */}
                            </div>
                        </>}
                    </div>
                    <img onClick={() => setSizeOptions(!showSizeOptions)} className="bar-icon" src="images/arrow-down.png" />
                </div>
                <div className="auth">
                    <Barcontent />
                </div>
            </div>
        </div>
    )
}
// console.log("SizeContext",SizeContext.Consumer)

export default CanvasBar