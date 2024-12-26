"use client";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "../styles/Home.module.css";

import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";
import getDirectDriveLink from "../utils/getDirectDriveLink"; // Ensure this function works correctly

export default function Home() {
  const [products, setProducts] = useState([]); // Initialize as an array for easier mapping
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/getProduct`);
        const data = await response.json();

        if (response.ok) {
          // Filter products by type "product" and map relevant data
          const photographyProducts = data.products
            .filter((product) => product.type === "product")
            .map((product) => ({
              ...product,
            }))
            .reverse(); // Reverse the array to make the last item first

          setProducts(photographyProducts);
        } else {
          console.error("Error fetching data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchFiles();
  }, []);

  // Check the products and the image URLs
  // console.log(products);

  return (
    <>
      <Head>
        <title>SUMIT DUARY</title>
        <meta
          name="description"
          content="This page invites people to see, buy and contact with us for purpose of the art/design/coding in graphic, website, AI art, digital art, photography"
        />
      </Head>

      <Navbar />
      <PageLayout>
        {loading ? (
          <div className="loadingOverlay">
            <div className="loadingSpinner"></div>
            <p>Loading data, please wait...</p>
            <Image
              src="/logo/sumitduarylogowhite1.svg"
              className="loadingLogo"
              width={200}
              height={50}
              alt="sumit-duary-logo"
            />
          </div>
        ) : (
          <div className={styles.homemainbody}>
            {products.map((item) => (
              <div key={item._id} className={styles.imagecard}>
                {item.thumbnail && (
                  <Link
                    href={`/procat/${item._id}-${
                      item.specialID
                    }-${encodeURIComponent(item.title)}`}
                  >
                    <div className={styles.imagebody}>
                      <Image
                        src={getDirectDriveLink(item.thumbnail.webViewLink)} // Ensure this returns a direct image URL
                        className={styles.image}
                        alt={item.title}
                        width={200}
                        height={250}
                        priority={false} // Enable lazy loading by default
                        placeholder="blur" // Use placeholder for the loading state
                        blurDataURL="/image/preloadimage.svg" // Path to your placeholder image
                      />
                      <div className={styles.text}>
                        <i
                          className={`material-symbols-outlined ${styles.icon}`}
                        >
                          search
                        </i>
                        <p>{item.title}</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </PageLayout>
    </>
  );
}
