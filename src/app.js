import React from "react";
import HOME from "./Pages/home";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import EDIT from "./Pages/edit";
import POSTER from "./Pages/poster";

function APP() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/poster" element={<POSTER />} />
                <Route path="/canvas" element={<EDIT />} />
                <Route path="*" element={<HOME />} />
            </Routes>
        </BrowserRouter>
    );
}

export default APP



