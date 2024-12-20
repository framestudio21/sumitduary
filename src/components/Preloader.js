import styles from "./Preloader.module.css";
import React, { useEffect, useState } from "react";

export default function PreLoader() {
  const [load, setLoad] = useState(0); // State for percentage
  const [loadingComplete, setLoadingComplete] = useState(false); // State to hide preloader after loading

  const getFontFamily = () => {
    // Change font based on the load percentage
    if (load >= 95) return "'Roboto', sans-serif"; // 95% and above uses Roboto
    if (load >= 85) return "'PT Serif', serif"; 
    if (load >= 75) return "'Montserrat', sans-serif"; 
    if (load >= 65) return "'Josefin Slab', slab-serif"; 
    if (load >= 55) return "'Poppins', sans-serif";
    if (load >= 45) return "'PT Serif', serif"; 
    if (load >= 35) return "'Montserrat', sans-serif"; 
    if (load >= 25) return "'Josefin Slab', slab-serif"; 
    if (load >= 15) return "'Poppins', sans-serif";
    if (load >= 5) return "'Josefin Slab', slab-serif"; 
    return "'Raleway', sans-serif"; // Default and 0-64% uses Raleway
  };

  useEffect(() => {
    // Simulating a loading process
    const loading = setInterval(() => {
      setLoad((prevLoad) => {
        if (prevLoad >= 100) {
          clearInterval(loading);
          setLoadingComplete(true); // Set loadingComplete to true when loading is finished
          return 100;
        }
        return prevLoad + 5;
      });
    }, 460);

    return () => clearInterval(loading); // Clear interval when component unmounts
  }, []);

  if (loadingComplete) return null; // Return null when loading is complete to remove the preloader from the DOM

  return (
    <div className={styles.loadingbody} id="preloader">
      <div
        className={styles.loader}
        style={{ fontFamily: getFontFamily() }}
      >
        {load}%
      </div>
    </div>
  );
}
