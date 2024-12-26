// app/search/[id]/page.js
"use client";

import DOMPurify from "dompurify";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


import Navbar from "../components/Navbar";
import PageLayout from "../components/PageLayout";

import styles from "../styles/SearchID.module.css";

export default function ProductCategory() {
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

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

  // Filtered products to exclude "photography" type
  const filteredProducts = productImages
    .filter((product) =>
      [
        "title",
        "clientdetails",
        "details",
        "description",
        "subcategory",
        "category",
        "type",
      ].some((key) => product[key]?.toLowerCase().includes(searchQuery))
    )
    .filter((product) => product.type?.toLowerCase() !== "photography");

  // Group products by their type
  const groupedByType = filteredProducts.reduce((acc, product) => {
    const type = product.type || "Unknown";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
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
                       <p>Loading data, please wait...</p>
                       <Image src="/logo/sumitduarylogowhite1.svg" className="loadingLogo" width={200} height={50} alt="sumit-duary-logo"/>
                     </div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : Object.keys(groupedByType).length > 0 ? (
            Object.entries(groupedByType).map(([type, products]) => (
              <div key={type} className={styles.productSection}>
                <div className={styles.sectionTitle}>{type}</div>
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
                        {product.subCategories?.map((subCategory, index) => (
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
              No products found for "{searchQuery}".
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
