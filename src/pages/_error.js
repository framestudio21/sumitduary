"use client";

//_error.js
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import Layout from "../components/PageLayout";

import styles from "../styles/Error.module.css";

export default function _error() {
  // const [searchText, setSearchText] = useState(""); // To hold the search text
  // const router = useRouter(); // To handle redirection
  // const inputRef = useRef(null); // Reference to the input field

  // const handleSearch = (e) => {
  //   e.preventDefault(); // Prevent page reload on form submit
  //   if (searchText.trim()) {
  //     // Redirect to the URL with the search query parameter
  //     router.push(`/search?query=${encodeURIComponent(searchText)}`);
  //   }
  // };

  // const handleContainerClick = () => {
  //   // Focus on the input field when the searchbox div is clicked
  //   inputRef.current?.focus();
  // };

  // const handleBackClick = () => {
  //     // Navigate back to the previous page
  //     router.back();
  //   };

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.errormainbody}>
          <div className={styles.searchboxdiv}>
            <div className={styles.titlebar}>
              <div className={styles.title}>404 Error. Oops! Not Found!</div>
              <div className={styles.subtitle}>
                Apologies, but we were unable to find what you were looking for.
              </div>
            </div>
            <form
              className={styles.searchbox}
              // onSubmit={handleSearch}
              // onClick={handleContainerClick}
            >
              <i className={`material-icons ${styles.icon}`} alt="search">
                search
              </i>
              <input
                type="text"
                className={styles.searchbar}
                name="search"
                id="search"
                placeholder="search the site ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)} // Update state with input
                ref={inputRef} // Attach the ref to the input
              />
            </form>
          </div>

          <button className={styles.backbtn} onClick={handleBackClick}>
            back to previous
          </button>
        </div>
      </Layout>
    </>
  );
}
