
"use client"

import Image from "next/image";
import Link from "next/link";

import styles from "../styles/About.module.css";


import Navbar from "../components/Navbar";
import Layout from "../components/PageLayout";

export default function About () {
  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.aboutmainbody}>

          {/* logosection */}
          <Image
            className={styles.aboutlogo}
            src="/logo/sumitkrduaryblack.svg"
            alt="sumit-kumar-duary-logo"
            loading="lazy"
            unoptimized
            width={300}
            height={150}
          />

          {/* visual designer & about me paragraph section */}
          <div className={styles.paragraphsection}>

          {/* visual designer paragraph section */}
            <div className={styles.paragraphheader}>Visual designer</div>
            <div className={styles.paragraphtext}>
              <span className={styles.hello}>Hello !</span>
              <br />
              I am<span>sumit kumar duary</span>a
              <span>visual / graphic designer and website developer</span>based in
              kolkata, India. I am passionate about making detailed, interative
              and created designs, regardless of the medium, i am working
              with.
              <br />
              <span>I am passionate with other topics that interest us.</span>
            </div>

          {/* about me paragraph section */}
            <div className={styles.paragraphheader}>About Me</div>
            <div className={styles.imagetextsection}>

              {/* description section */}
              <div className={styles.imagesection}>
                <Image src="/image/sumitimage.jpg" alt="sumitduaryimage" className={styles.sumitimage} width={100} height={100}/>
                <p className={styles.paragraph}>Welcome to my corner of creativity and expertise! Based in the vibrant city of Kolkata, I am a seasoned advocate with a passion for delivering sound legal solutions. Beyond the courtroom, I channel my creativity into graphic design and website development, crafting visually compelling designs and dynamic websites tailored to your needs. With a unique blend of professional rigor and artistic flair, I strive to provide comprehensive services that empower individuals and businesses alike.</p>
              </div>

              {/* link section */}
              <div className={styles.textsection}>
                <Link href="/procat/category/graphic" className={styles.iconlink}>
                <Image src="/icon/graphic.svg" alt="icon" className={styles.icon} width={100} height={100}/>
                  <div className={styles.icontext}>graphic</div>
                </Link>
                <Link href="/procat/category/website" className={styles.iconlink}>
                <Image src="/icon/website.svg" alt="icon" className={styles.icon} width={100} height={100}/>
                  <div className={styles.icontext}>website</div>
                </Link>
                <Link href="/procat/category/subcategory/layout%20design" className={styles.iconlink}>
                <Image src="/icon/branding.svg" alt="icon" className={styles.icon} width={100} height={100}/>
                  <div className={styles.icontext}>branding</div>
                </Link>
                <Link href="/procat/category/subcategory/packaging%20design" className={styles.iconlink}>
                <Image src="/icon/packaging.svg" alt="icon" className={styles.icon} width={100} height={100}/>
                  <div className={styles.icontext}>packaging</div>
                </Link>
                <Link href="/procat/category/subcategory/typography%20design" className={styles.iconlink}>
                <Image src="/icon/typography.svg" alt="icon" className={styles.icon} width={100} height={100}/>
                  <div className={styles.icontext}>typography</div>
                </Link>
                <Link href="/photography" className={styles.iconlink}>
                <Image src="/icon/camera.svg" alt="icon" className={styles.icon} width={100} height={100}/>
                  <div className={styles.icontext}>photography</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
