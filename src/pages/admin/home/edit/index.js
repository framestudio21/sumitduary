"use client";

//admin/home/edit-index.js
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "../../../../components/Navbar";
import Layout from "../../../../components/PageLayout";
import Logout from "../../../../components/Logout";

import getDirectDriveLink from "../../../../utils/getDirectDriveLink";

import styles from "../../../../styles/AdminEdit.module.css";

export default function Edit() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState("none");
  const [selectedCategory, setSelectedCategory] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");

  const [productsByType, setProductsByType] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/getProduct`);
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        const categorizedProducts = data.products.reduce((acc, product) => {
          const type = product.type || "uncategorized";
          if (!acc[type]) acc[type] = [];
          acc[type].push({
            ...product,
            thumbnail: getDirectDriveLink(product.thumbnail.webViewLink),
          });
          return acc;
        }, {});
        setProductsByType(categorizedProducts);
        setFilteredProducts(categorizedProducts);
      } else {
        console.error("Error fetching data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/deleteProduct`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Product deleted successfully");
        fetchFiles(); // Refresh the product list
      } else {
        const error = await response.json();
        alert(`Failed to delete product: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleEdit = (id, specialID, title) => {
    router.push(`/admin/home/edit/update/${id}-${specialID}-${title}`); // Navigate to edit page
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const filter = async () => {
      setLoading(true); // Start loading
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading delay

      const filtered = Object.keys(productsByType).reduce((acc, type) => {
        if (selectedType !== "none" && type !== selectedType) return acc;

        const filteredProducts = productsByType[type].filter((product) => {
          const searchFields = [
            product._id,
            product.specialID,
            product.title,
            product.uniqueID,
            product.clientDetails,
          ];
          const searchMatch = searchFields.some((field) =>
            field
              ? field
                  .toString()
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              : false
          );

          if (
            selectedCategory !== "none" &&
            product.category !== selectedCategory
          ) {
            return false;
          }

          return searchMatch;
        });

        if (filteredProducts.length > 0) acc[type] = filteredProducts;

        return acc;
      }, {});

      setFilteredProducts(filtered);
      setLoading(false); // End loading
    };

    filter();
  }, [selectedType, selectedCategory, searchQuery, productsByType]);

  return (
    <>
      <Navbar />
      <Layout>
        <Logout />
        <div className={styles.editmainpagebody}>
          {/* Title & Search Bar */}
          <div className={styles.titleandsearchbar}>
            <div className={styles.title}>search & filter</div>
            <input
              type="text"
              placeholder="search the product"
              className={styles.searchbar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.selectoption}>
              <select
                name="type"
                id="type"
                className={styles.selectwindow}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option className={styles.selectoption} value="none">Select type</option>
                <option className={styles.selectoption} value="product">Product</option>
                <option className={styles.selectoption} value="digitalart">Digital Art</option>
                <option className={styles.selectoption} value="photography">Photography</option>
              </select>
              <select
                name="category"
                id="category"
                className={styles.selectwindow}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option className={styles.selectoption} value="none">Select category</option>
                <option className={styles.selectoption} value="graphic">Graphic</option>
                <option className={styles.selectoption} value="website">Website</option>
              </select>
            </div>
          </div>

          {/* Display Products or Loading */}
          {loading ? (
            <div className={styles.loadingAnimation}>
              <p>Loading products...</p>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.productsDisplay}>
              {Object.keys(filteredProducts).length > 0 ? (
                Object.keys(filteredProducts).map((type, typeIndex) => (
                  <div
                    key={`type-${typeIndex}`}
                    className={styles.productTypeSection}
                  >
                    <div className={styles.productTypeTitle}>{type}</div>

                    <div className={styles.productGrid}>
                      {filteredProducts[type].map((product) => (
                        <div key={product._id} className={styles.productCard}>
                          <Link href={`/admin/home/product/${product._id}-${product.specialID}-${encodeURIComponent(
                            product.title
                          )}`} className={styles.productlink} >
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            width={150}
                            height={150}
                            className={styles.productImage}
                            priority
                          />
                          </Link>
                          <div className={styles.cardtextsection}>
                            <div className={styles.productTitle}>
                              {product.title}
                            </div>
                            <div className={styles.productID}>
                              <span className={styles.productidspan}>ID :</span> {product._id}
                            </div>
                            <div className={styles.productID}>
                            <span className={styles.productidspan}>specialID :</span> {product.specialID}
                            </div>
                            <div className={styles.productID}>
                            <span className={styles.productidspan}>uniqueID :</span> {product.uniqueID}
                            </div>
                            <div className={styles.productID}>
                            <span className={styles.productidspan}>type :</span> {product.type} <span className={styles.productidspan}> / category :</span>{" "}
                              {product.category}
                            </div>
                            <div className={styles.productID}>
                            <span className={styles.productidspan}>subCategories :</span> {product.subCategories[0]},{" "}
                              {product.subCategories[1]},{" "}
                              {product.subCategories[2]}
                            </div>

                            <div className={styles.productDescription}>
                            <span className={styles.productidspan}>description :</span> {product.description}
                            </div>
                            <div className={styles.btnsection}>
                              <button
                                className={styles.editButton}
                                onClick={() =>
                                  handleEdit(
                                    product._id,
                                    product.specialID,
                                    product.title
                                  )
                                }
                              >
                                Edit
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(product._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found matching the criteria.</p>
              )}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
