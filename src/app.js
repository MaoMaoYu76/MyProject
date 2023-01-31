import React from "react";
import HOME from "./Pages/home";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import REGISTER from "./Pages/register";
import CANVAS from "./Pages/Canvas";

function APP(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/canvas" element={<CANVAS />} />
                <Route path="/register" element={<REGISTER />} />
                <Route path="*" element={<HOME />} />
            </Routes>
        </BrowserRouter>
    );}

export default APP



