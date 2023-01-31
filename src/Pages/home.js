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
                <button className="start"><Link to={"/canvas"} className="link">Start Production</Link></button>
            </div>
            <Footer />
        </div>
    </>
}

export default HOME