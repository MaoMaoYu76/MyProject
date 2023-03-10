import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import "../Styles/LogoBar.css";
import { useEffect } from "react";
import Signin from "./Signin";

const LogoBar = (props) => {
  console.log("LogoBar");
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignin, setShowSignin] = useState(false);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        //登出後重新導向
        setCurrentUser(null);
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //偵測登入情況
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // console.log("currentUser",currentUser);
        setCurrentUser(currentUser);
        if (window.location.pathname === "/canvas") {
          props.currentUser(currentUser);
        }
      }
    });
  }, []);

  //登入資訊顯示
  const Barcontent = () => {
    // console.log(currentUser);
    if (currentUser != null) {
      const profilepic = () => {
        if (currentUser.photoURL != null) {
          return currentUser.photoURL;
        } else {
          return "/images/defaultpic.png";
        }
      };
      return (
        <>
          <div className="link" onClick={logOut}>
            登出
          </div>
          <img className="Userphoto" src={profilepic()} />
        </>
      );
    } else {
      return (
        <div className="link" onClick={StarSignin}>
          登入
        </div>
      );
    }
  };

  const StarSignin = () => {
    setShowSignin(true);
    const handleMask = (event) => {
      console.log(event.target);
      if (event.target === document.querySelector(".mask")) {
        setShowSignin(false);
      }
    };
    addEventListener("click", handleMask);
  };

  if (window.location.pathname === "/") {
    return (
      <>
        {showSignin && (
          <>
            <div className="mask"></div>
            <Signin setShowSignin={setShowSignin} />
          </>
        )}
        <div className="barcontain">
          <div className="bar">
            <div className="logo-container">
              <Link to={"/"} className="logo"></Link>
            </div>
            <div className="auth">
              <Barcontent />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {showSignin && (
          <>
            <div className="mask"></div>
            <Signin setShowSignin={setShowSignin} />
          </>
        )}
        <div className="canvas-barcontain">
          <div className="bar">
            <div className="edit-function">
              <div className="logo-container">
                <Link to={"/"} className="canvas-logo"></Link>
              </div>
            </div>
            <div className="auth">
              <Barcontent />
            </div>
          </div>
        </div>
      </>
    );
  }
};
export default LogoBar;
