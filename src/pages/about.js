
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
              We are a group of people, work as a
              <span>visual designer / graphic designer and website developer</span> based in
              kolkata, India. We are passionate abou making detailed, interative
              and created designs, regardless of the medium, we are working
              with.
              <br />
              We are passionate with other topics that interest us.
            </div>
            <div className={styles.paragraphheader}>About Us</div>
          </div>
        </div>
      </Layout>
    </>
  );
};
