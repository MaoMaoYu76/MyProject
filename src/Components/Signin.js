import React, { useEffect } from "react";
import "../Styles/Signin.css";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function Signin(props) {
  const Googleprovider = new GoogleAuthProvider();
  const Facebookprovider = new FacebookAuthProvider();
  const [showInput, setShowInput] = useState(false);
  const [data, setData] = useState({});
  const [alert, setAlert] = useState(null);
  const [User, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      if (window.location.pathname != "/canvas") {
        window.location = "/";
      }
    }
  });

  //來自畫布的登入警告
  useEffect(() => {
    setAlert(props.alert);
  }, [props.alert]);

  const handleGoogle = () => {
    signInWithPopup(auth, Googleprovider)
      .then((userCredential) => {
        // console.log(userCredential.user)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFacebook = () => {
    signInWithPopup(auth, Facebookprovider)
      .then((userCredential) => {
        // console.log(userCredential.user)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisplay = () => {
    return {
      className: "signin-button",
      style: {
        display: showInput ? "none" : "flex",
        border: "2px solid #ECECEC",
        height: "50px",
        width: "250px",
        borderRadius: "5px",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        margin: "15px 0",
        alignItems: "center",
        paddingLeft: "20px",
        boxShadow: "0 2px 8px rgb(14 19 24 / 7%)",
      },
    };
  };

  //input即時畫面更新
  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  //一般登入邏輯
  function handleSignin() {
    const email = document.querySelector('input[name="email"]').value;
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log(userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        //IIFE立即調用函數表達式
        //(function() {函數內部的程式碼})();
        const alertContent = (() => {
          console.log(errorCode);
          if (errorCode === "auth/invalid-email") {
            return <div className="alert">信箱格式錯誤</div>;
          } else if (errorCode === "auth/wrong-password") {
            if (email.endsWith("@gmail.com")) {
              return (
                <>
                  <div className="alert">帳號密碼有誤或帳號已由Google註冊</div>
                  <div className="alert-link" onClick={handleGoogle}>
                    <img src="/images/google.png" className="icon" />{" "}
                    以Google繼續
                  </div>
                </>
              );
            } else {
              return <div className="alert">帳號密碼有誤</div>;
            }
          } else if (errorCode === "auth/user-not-found") {
            return (
              <>
                <div className="alert">請檢查信箱是否正確</div>
                <div className="alert-link" onClick={handleCreate}>
                  <img src="/images/newauth.png" className="icon" />{" "}
                  以此帳號密碼註冊
                </div>
              </>
            );
          } else if (errorCode === "auth/too-many-requests") {
            return <div className="alert">登入錯誤次數過多，請稍後再試</div>;
          }
        })();
        setAlert(alertContent);
      });
  }

  //一般註冊
  const handleCreate = () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        console.log(userCredential.user);
      })
      .catch((error) => {
        const errorCode = error.code;

        console.log(errorCode);
      });
  };

  //取消
  const handleCancell = () => {
    setShowInput(!showInput);
    setAlert(null);
  };

  return (
    <>
      <div className="singin">
        <div className="button-container">
          <div className="sigin-logo">
            <Link to={"/"} className="canvas-logo"></Link>
          </div>
          {alert}
          {showInput && (
            <>
              <div className="register-input-container">
                {/* <form> */}
                <p>
                  <input
                    className="register-input"
                    name="email"
                    placeholder="Email"
                    onChange={(event) => handleInput(event)}
                  ></input>
                </p>
                <p>
                  <input
                    className="register-input"
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={(event) => handleInput(event)}
                  ></input>
                </p>
                <p>
                  <button
                    className="email-signin-button"
                    onClick={handleSignin}
                  >
                    繼續
                  </button>
                </p>
                {/* </form> */}
                <p>
                  <button
                    className="email-signin-button"
                    onClick={handleCancell}
                  >
                    取消
                  </button>
                </p>
              </div>
            </>
          )}
          <div {...handleDisplay()} onClick={() => setShowInput(!showInput)}>
            <img src="/images/email.png" className="icon" />
            　以Email繼續
          </div>
          <div {...handleDisplay()} onClick={handleGoogle}>
            <img src="/images/google.png" className="icon" />
            　以Google繼續
          </div>
          <div {...handleDisplay()} onClick={handleFacebook}>
            <img src="/images/facebook.png" className="icon" />
            　以Facebook繼續
          </div>
        </div>
      </div>
    </>
  );
}
export default Signin;
