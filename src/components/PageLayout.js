

"use client"

import { useState, useEffect } from "react";
import { Lexend } from "next/font/google";

import Navbar from "./Navbar";

const lexend = Lexend({ subsets: ["latin"] });

import styles from "./PageLayout.module.css";

export default function PageLayout({ children, className = "default-class" }) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getWidth = () => {
    if (windowWidth < 768) {
      return "calc(100% - 0px)";
    }
    return isNavbarOpen ? "calc(100% - 430px)" : "calc(100% - 0px)";
  };

  return (
    <div className={`${styles.layout} ${lexend.className}`}>
      <Navbar onToggle={setIsNavbarOpen} />

      <div
        className={`${styles.mainbody} ${className}`}
        style={{
          marginLeft: isNavbarOpen ? "430px" : "30px", 
          width: getWidth(),
          transition: "all 0.3s ease",
          height: "100vh", 
          overflowY: "scroll",  
          position: "relative",
          top: windowWidth < 480 ? "30px" : "0px",
          left: windowWidth < 480 ? "-30px" : "0px",
          width: windowWidth < 480 ? "100%" : (isNavbarOpen ? "calc(100% - 412px)" : "100%"),
        }}
      >
        {children}
      </div>
    </div>
  );
}
