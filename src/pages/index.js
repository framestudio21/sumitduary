//page/index.js

import React from "react";
import dynamic from "next/dynamic";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./home";
import Contact from "./contact";
import About from "./about";
import Photography from "./photography";
import Digitalart from "./digitalart";
import Product from "./procat/[id]";

import ErrorPage from "./_error";

import Admin from "./admin";
import AdminHome from "./admin/home";
import AdminLogin from './admin/login';
import AdminEdit from "./admin/home/edit";
import AdminUpload from "./admin/home/upload";
import AdminSignup from "./admin/signup"
import AdminContact from './admin/home/contact'
import AdminUpdate from "./admin/home/edit/update/[id]";
import AdminProduct from "./admin/home/product/[id]";

export default dynamic(() => Promise.resolve(App), { ssr: false });
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/digitalart" element={<Digitalart />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/procat/:id" element={<Product />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/lgoin" element={<AdminLogin />} />
          <Route path="/admin/home/edit" element={<AdminEdit />} />
          <Route path="/admin/home/upload" element={<AdminUpload />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/home/contact" element={<AdminContact />} />
          <Route path="/admin/home/edit/update/:id" element={<AdminUpdate />} />
          <Route path="/admin/home/product/:id" element={<AdminProduct />} />

          {/* Default 404 Error Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
};
