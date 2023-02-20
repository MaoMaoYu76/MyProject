import LogoBar from "../Components/LogoBar";
import Footer from "../Components/Footer";
import React from "react";
import "../Styles/home.css";
import { Link } from "react-router-dom";

function HOME() {

    return <>
        <div className="body">
            <LogoBar />
            <div className="main">
                <div className="description"><Link to={"/poster/1235"} className="logo"></Link>　猴子也能輕鬆上手</div>
                <Link to={"/canvas"} className="start-link"><div className="start"><div className="inner-start">開始設計</div></div></Link>
                <div className="description">
                    <p>想製作海報、賀卡等宣傳圖文，卻沒有任何設計技巧？沒關係！</p>
                    <p>簡單易懂的拖放工具，讓你 10 分鐘即可在線編輯出精美的成品。</p>
                </div>
            </div>
            <Footer />
        </div>
    </>
}

export default HOME