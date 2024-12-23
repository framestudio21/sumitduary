"use client";

import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Layout from "../components/PageLayout";
import Gallery from "../components/Gallery";
import getDirectDriveLink from "../utils/getDirectDriveLink";

import styles from "../styles/Home.module.css";

export default function Digitalart() {
  const [products, setProducts] = useState([]); // Initialize as an array for easier mapping
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/getProduct`);
        const data = await response.json();
  
        if (response.ok) {
          const photographyProducts = data.products
            .filter((product) => product.type === "digitalart")
            .map((product) => ({
              ...product,
              thumbnail: getDirectDriveLink(product.thumbnail.webViewLink), // Convert to direct view link
              thumbnailDownload: product.thumbnail.webContentLink, // Direct download link
            }))
            .reverse(); // Reverse the order to make the last item first
  
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
  

  return (
    <>
      <Navbar />
      <Layout>
      {loading ? (
            // <div className={styles.preloader}>Loading...</div>
            <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            {/* <p>Loading data, please wait...</p> */}
          </div>
          ) : (
        <div className={styles.photographymainbody}>
          <Gallery images={products} />
        </div>
          )}
      </Layout>
    </>
  );
}
