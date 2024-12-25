
"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./Navbar.module.css";

import NavBarMainLogo from "../image/spacelogowhite.svg"
// import MenuBargerIcon from "@/icon/menu-burger.svg"

export default function Navbar ({ onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen); // Notify the parent component (Layout)
  };

  const year = new Date().getFullYear();

  return (
    <div>
      <nav className={styles.mainnavbody}>
        <div className={styles.sidenav}>
          <button className={styles.sidenavbtn} onClick={toggleSidebar}>
          <div className={styles.menuicon} onClick={toggleSidebar}>
            <div className={styles.square}></div>
            <div className={styles.square}></div>
            <div className={styles.square}></div>
          </div>
          </button>
          <Link href="/about" className={styles.logolink}>
            <Image
              // src={NavBarMainLogo}
              src="/logo/sumitduarylogowhite1.svg"
              className={styles.mainlogo}
              alt="Logo"
              width={140} // Correct width
              height={50} // Correct height
              optimized="true"
              id="mainlogo"
              priority
            />
          </Link>
        </div>

        {/* Full display navbar */}
        {isOpen && (
          <div className={styles.navbar}>

            <div className={styles.middlesection}>
              <Link href="/" className={styles.navlist}>
                <li>Home</li>
              </Link>
              <Link href="/digitalart" className={styles.navlist}>
                <li>Digital Art</li>
              </Link>
              <Link href="/photography" className={styles.navlist}>
                <li>Photography</li>
              </Link>
              <Link href="/about" className={styles.navlist}>
                <li>About</li>
              </Link>
              <Link href="/contact" className={styles.navlist}>
                <li>Contact</li>
              </Link>
            </div>

            <div className={styles.bottomsection}>
              Powered by <span className={styles.span}>sumitduary</span>
              <br />
              @ All rights reserved by Sumit Kumar Duary. {year}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

// Dynamically export the Navbar (no SSR)
// export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
