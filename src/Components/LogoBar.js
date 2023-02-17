import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import "../Styles/LogoBar.css";
import { useEffect } from "react";
import Signin from "./Signin";

const LogoBar = (props) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [showSizeOptions, setSizeOptions] = useState(false);
    const [showSignin, setShowSignin] = useState(false)

    const handleSizeChange = (newSize) => {
        props.onSizeChange(newSize);
    };

    const logOut = () => {

        signOut(auth).then(() => {
            //登出後重新導向
            setCurrentUser(null);
            window.location = '/';
        }).catch((error) => {
            console.log(error)
        });
    }

    //偵測登入情況
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setCurrentUser(currentUser);
                props.currentUser(currentUser);
            };
        });
    }, [])

    //登入資訊顯示
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
                <div className="link" onClick={logOut}>登出</div>
                <img className="Userphoto" src={profilepic()} />
            </>
        }
        else {
            return <div className="link" onClick={StarSignin}>登入</div>
        }
    }

    const StarSignin = () => {
        setShowSignin(true)
        const handleMask = (event) => {

            console.log(event.target);
            if (event.target === document.querySelector(".mask")) {
                setShowSignin(false)
            }
        }
        addEventListener("click", handleMask)
    }




    if (window.location.pathname === "/canvas") {
        return <>
            {showSignin && <>
                <div className="mask"></div>
                <Signin setShowSignin={setShowSignin} />
            </>}
            <div className="canvas-barcontain">
                <div className="bar">
                    <div className="edit-function">
                        <div className="logo-container">
                            <Link to={"/"} className="canvas-logo"></Link></div>
                        <div onClick={() => setSizeOptions(!showSizeOptions)} className="canvas-console">調整尺寸
                            {showSizeOptions && <>
                                <div className="size-options">
                                    <p className="size" onClick={() => handleSizeChange([1587.4, 2245, 25])}>直立式海報42*59.4cm</p>
                                    <p className="size" onClick={() => handleSizeChange([529.1, 396.8, 130])}>卡片14*10.5cm</p>
                                </div>
                            </>}
                            <img onClick={() => setSizeOptions(!showSizeOptions)} className="bar-icon" src="images/arrow-down.png" />
                        </div>
                    </div>
                    <div className="auth">
                        <Barcontent />
                    </div>
                </div>
            </div>
        </>
    }
    else {
        return <>
            {showSignin && <>
                <div className="mask"></div>
                <Signin setShowSignin={setShowSignin} />
            </>}
            <div className="barcontain">
                <div className="bar">
                    <div className="logo-container">
                        <Link to={"/home"} className="logo"></Link>
                    </div>
                    <div className="auth">
                        <Barcontent />
                    </div>
                </div>
            </div>
        </>
    }

}
export default LogoBar