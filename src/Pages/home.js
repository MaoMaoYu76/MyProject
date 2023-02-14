import LogoBar from "../Components/LogoBar";
import Footer from "../Components/Footer";
import React from "react";
import "../Components/home.css";
import { Link } from "react-router-dom";

function HOME() {
    return <>
        <div className="body">
            <LogoBar />
            <div className="main">
                <div className="description">輕鬆設計</div>
                <button className="start"><Link to={"/canvas"} className="link">Start Production</Link></button>
                <div className="description">　圖像生活</div>
            </div>
            <Footer />
        </div>
    </>
}

export default HOME