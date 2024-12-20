// app/search/[id]/page.js
"use client";

import DOMPurify from "dompurify";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Navbar from "../../../../components/Navbar";
import PageLayout from "../../../../components/PageLayout";

import styles from "../../../../styles/SearchID.module.css";

export default function ProductCategory() {
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract and decode the subcategory from the URL
  const pathname = usePathname();
  // const type = pathname
  //   ? decodeURIComponent(pathname.split("/procat/category/subcategory/").pop())
  //   : null;

  const type = pathname
  ? decodeURIComponent(
      pathname.substring(
        pathname.lastIndexOf("/procat/category/subcategory/") +
          "/procat/category/subcategory/".length
      )
    )
  : null;

  
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
        product.subCategories?.some(
          (subCategory) => subCategory.toLowerCase() === type?.toLowerCase() // Match decoded subcategory
        )
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
          <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          {/* <p>Loading data, please wait...</p> */}
        </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : Object.keys(groupedByType).length > 0 ? (
          Object.entries(groupedByType).map(([groupType, products]) => (
            <div key={groupType} className={styles.productSection}>
              <div className={styles.sectionTitle}>{groupType}</div>
              {/* <br/> */}
              {/* <div className={styles.sectionTitle}>{type}</div> */}
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
                      <Link href={`/procat/category/${product.category}`} className={styles.type}>
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
            No products found for type "{type}".
          </div>
        )}
      </div>
    </PageLayout>
  </>
  );
}
