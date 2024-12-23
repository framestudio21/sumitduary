
"use client"

import Image from "next/image";

import styles from "../styles/About.module.css";


import Navbar from "../components/Navbar";
import Layout from "../components/PageLayout";

export default function About () {
  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.aboutmainbody}>
          <Image
            className={styles.aboutlogo}
            src="/logo/framestudiologo.svg"
            alt="Frame-Studio-Logo"
            loading="lazy"
            unoptimized
            width={300}
            height={150}
          />

          <div className={styles.paragraphsection}>
            <div className={styles.paragraphheader}>Visual designer</div>
            <div className={styles.paragraphtext}>
              <span className={styles.hello}>Hello !</span>
              <br />
              I am<span>sumit kumar duary</span>a
              <span>visual designer / graphic designer and website developer</span>based in
              kolkata, India. I am passionate about making detailed, interative
              and created designs, regardless of the medium, i am working
              with.
              <br />
              <span>I am passionate with other topics that interest us.</span>
            </div>
            <div className={styles.paragraphheader}>About Me</div>
          </div>
        </div>
      </Layout>
    </>
  );
};
