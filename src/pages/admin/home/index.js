//admin/home.js

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import Layout from "../../../components/PageLayout";
import Logout from "../../../components/Logout";

import getDirectDriveLink from "../../../utils/getDirectDriveLink";

import styles from "../../../styles/AdminHome.module.css";

export default function AdminHome() {

  const [productsByType, setProductsByType] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/getProduct`);
      const data = await response.json();

      if (response.ok) {
        // Categorize products by their type
        const categorizedProducts = data.products.reduce((acc, product) => {
          const type = product.type || "uncategorized"; // Handle cases where type is undefined
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push({
            ...product,
            thumbnail: getDirectDriveLink(product.thumbnail.webViewLink), // Convert file link to a direct link
          });
          return acc;
        }, {});

        setProductsByType(categorizedProducts);
      } else {
        console.error("Error fetching data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);


  return (
    <>
      <Navbar />
      <Layout>
      {loading ? (
            <div className="loadingOverlay">
            <div className="loadingSpinner"></div>
            <p>Loading data, please wait...</p>
            <Image src="/logo/sumitduarylogowhite1.svg" className="loadingLogo" width={200} height={50} alt="sumit-duary-logo"/>
          </div>
          ) : (
          <div className={styles.adminhome}>
            <Logout />
            <div className={styles.adminhomemainbody}>
          <div className={styles.productsection}>
            {Object.entries(productsByType).map(([type, products]) => (
              <div key={type} className={styles.producttype}>
                <div className={styles.title}>{type.toUpperCase()}</div>
                <div className={styles.productimage}>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div key={product._id} className={styles.imagelink}>
                        <Link
                          href={`/admin/home/product/${product._id}-${product.specialID}-${encodeURIComponent(
                            product.title
                          )}`}
                          className={styles.imagelink}
                        >
                        <Image
                          src={product.thumbnail}
                          className={styles.image}
                          width={1000}
                          height={1000}
                          alt={product.title}
                          priority={false} // Enable lazy loading by default
                          placeholder="blur" // Use placeholder for the loading state
                          blurDataURL="/image/preloadimage.svg"
                        /></Link>
                      </div>
                    ))
                  ) : (
                    <div className={styles.nodata}>No data available</div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
          </div>
         )}
      </Layout>
    </>
  );
}
