//admin/home.js

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../../../components/Navbar";
import Layout from "../../../components/PageLayout";
import Logout from "../../../components/Logout";
import ImageCarousel from "../../../components/ImageCarousel";

import getDirectDriveLink from "../../../utils/getDirectDriveLink";

import styles from "../../../styles/AdminHome.module.css";

export default function AdminHome() {
  const Photos = [
    {
      id: "1",
      src: "/image/image1.webp",
      name: "Image 1",
    },
    {
      id: "2",
      src: "/image/image3.jpg",
      name: "Image 2",
    },
    {
      id: "3",
      src: "/image/image4.webp",
      name: "Image 3",
    },
    {
      id: "4",
      src: "/image/image5.jpg",
      name: "Image 4",
    },
    {
      id: "5",
      src: "/image/image6.jpg",
      name: "Image 5",
    },
    {
      id: "6",
      src: "/image/image7.webp",
      name: "Image 6",
    },
    {
      id: "7",
      src: "/image/image8.webp",
      name: "Image 7",
    },
    {
      id: "8",
      src: "/image/img1.JPG",
      name: "Image 8",
    },
    {
      id: "9",
      src: "/image/img2.JPG",
      name: "Image 9",
    },
  ];

  const [productsByType, setProductsByType] = useState({});

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
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);


  return (
    <>
      <Navbar />
      <Layout>
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
                          width={100}
                          height={100}
                          alt={product.title}
                          priority
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

          {/* <ImageCarousel images={Photos} /> */}
        </div>
      </Layout>
    </>
  );
}
