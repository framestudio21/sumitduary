// app/search/[id]/page.js
"use client";

import DOMPurify from "dompurify";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


import Navbar from "../../../components/Navbar";
import PageLayout from "../../../components/PageLayout";

import styles from "../../../styles/SearchID.module.css";

export default function ProductCategory() {
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState(null);

  // Extract the type from the URL
  const pathname = usePathname();
  // const type = pathname ? pathname.split("/procat/category/").pop() : null;

  useEffect(() => {
    if (!pathname) {
      console.warn("Pathname is not available yet.");
      return;
    }

    const basePath = "/procat/category/";
    const typeIndex = pathname.lastIndexOf(basePath);

    if (typeIndex === -1) {
      console.error("Base path not found in the URL");
      setType(null); // Set type to null if the base path isn't found
    } else {
      const extractedType = pathname.substring(typeIndex + basePath.length);
      setType(extractedType);
      console.log("Extracted type:", extractedType);
    }
  }, [pathname]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/getProduct`);
      if (!response.ok) throw new Error("Failed to fetch product data.");
      const data = await response.json();
      setProductImages(data.products || []);
    } catch (err) {
      console.error(err.message);
      setError("Error fetching product data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Filter and group products
  const groupedByType = productImages
    .filter(
      (product) =>
        product.type?.toLowerCase() !== "photography" && // Exclude photography
        product.category?.toLowerCase() === type?.toLowerCase() // Match category
    )
    .reduce((acc, product) => {
      const productType = product.type || "Unknown";
      if (!acc[productType]) {
        acc[productType] = [];
      }
      acc[productType].push(product);
      return acc;
    }, {});

  return (
    <>
      <Navbar />
      <PageLayout>
        <div className={styles.productcateogryidpagemainbody}>
          {loading ? (
            <div className="loadingOverlay">
                        <div className="loadingSpinner"></div>
                        {/* <p>Loading data, please wait...</p> */}
                        <Image src="/logo/sumitduarylogowhite1.svg" className="loadingLogo" width={200} height={50} alt="sumit-duary-logo"/>
                      </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : Object.keys(groupedByType).length > 0 ? (
            Object.entries(groupedByType).map(([groupType, products]) => (
              <div key={groupType} className={styles.productSection}>
                <div className={styles.sectionTitle}>{groupType}</div>
                <div className={styles.cardcontainermainbody}>
                  {products.map((product) => (
                    <div key={product._id} className={styles.cardcontainer}>
                      <Link
                        href={`/procat/${product._id}-${
                          product.specialID
                        }-${encodeURIComponent(product.title)}`}
                        className={styles.title}
                      >
                        {product.title}
                      </Link>
                      <div className={styles.ownerdatedetails}>
                        <Link href="/about" className={styles.name}>
                          by {product.owner || "Unknown"}
                        </Link>
                        <div className={styles.date}>
                          {new Date(product.createdAt).toLocaleString("en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <Link
                          href={`/procat/type/${product.type}`}
                          className={styles.type}
                        >
                          : {product.type}
                        </Link>
                        <Link
                          href={`/procat/category/${product.category}`}
                          className={styles.type}
                        >
                          : {product.category}
                        </Link>
                        {product.subCategories
                          ?.filter(
                            (subCategory) =>
                              subCategory &&
                              subCategory.toLowerCase() !== "none"
                          ) // Exclude null, undefined, or "none"
                          .map((subCategory, index) => (
                            <Link
                              key={index}
                              href={`/procat/category/subcategory/${encodeURIComponent(
                                subCategory
                              )}`}
                              className={styles.subcategories}
                            >
                              <div className={styles.subcategory}>
                                : {subCategory}
                              </div>
                            </Link>
                          ))}
                      </div>
                      <div className={styles.description}>
                        Client: {product.clientdetails || "N/A"}
                      </div>
                      <div className={styles.description}>
                        {product.description || "No description available."}
                      </div>
                      <div
                        className={styles.details}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(product.details || ""),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noproductmessage}>
              No products found for type "{pathname}".
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
