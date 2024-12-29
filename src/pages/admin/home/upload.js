//admin/home/upload.js

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import Navbar from "../../../components/Navbar";
import Layout from "../../../components/PageLayout";
import Logout from "../../../components/Logout";
import RichTextEditor from "../../../components/RichTextEditor";

import styles from "../../../styles/Upload.module.css";

export default function Upload() {
  const options = [
    { value: "none", label: "Select subCategory" },
    { value: "logo design", label: "Logo Design" },
    {
      value: "Brand design (visual identity design / corporate design)",
      label: "Brand design (visual identity design / corporate design)",
    },
    { value: "illustration design", label: "Illustration Design" },
    { value: "typography design", label: "Typography Design" },
    { value: "advertisement design", label: "Advertisement Design" },
    { value: "marketing design", label: "Marketing Design" },
    { value: "Packaging design", label: "Packaging Design" },
    { value: "Label & sticker design", label: "Label & sticker Design" },
    {
      value: "Publication graphic design",
      label: "Publication graphic Design",
    },
    {
      value: "Environmental graphic design",
      label: "Environmental graphic Design",
    },
    {
      value: "Web design (digital design)",
      label: "Web design (digital design) Design",
    },
    { value: "3D Graphic design", label: "3D Graphic Design" },
    { value: "UI design", label: "UI Design" },
    { value: "Motion graphics design", label: "Motion graphics Design" },
    { value: "Powerpoint design", label: "Powerpoint Design" },
    { value: "layout design", label: "Layout Design" },
    {
      value: "Vehicle wraps and decal design",
      label: "Vehicle wraps and decal Design",
    },
    { value: "other design", label: "Other Design" },
  ];

  const [formData, setFormData] = useState({
    type: "none",
    title: "",
    description: "",
    details: "",
    thumbnail: null,
    additionalfiles: [],
    category: "none",
    subcategory1: "none",
    subcategory2: "none",
    subcategory3: "none",
    clientdetails: "",
  });
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      details: content,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (files) {
      const file = files[0];
      if (!file) return;

      if (file.size > maxFileSize) {
        setPopupMessage(`File size exceeds the 5MB limit: ${file.name}`);
        return;
      }

      if (name === "thumbnail") {
        setFormData((prevData) => ({ ...prevData, thumbnail: file }));
      } else if (name === "productfiles") {
        if (formData.additionalfiles.length >= 20) {
          setPopupMessage("You can upload a maximum of 20 files.");
          return;
        }

        const isDuplicate = formData.additionalfiles.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (isDuplicate) {
          setPopupMessage("This file has already been uploaded.");
          return;
        }

        setFormData((prevData) => ({
          ...prevData,
          additionalfiles: [...prevData.additionalfiles, file],
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const removeThumbnail = () => {
    setFormData((prevData) => ({ ...prevData, thumbnail: null }));
  };

  const removeFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      additionalfiles: prevData.additionalfiles.filter((_, i) => i !== index),
    }));
  };

  const getFilteredOptions = (selectedCategory) => {
    const selectedValues = [
      formData.subcategory1,
      formData.subcategory2,
      formData.subcategory3,
    ];
    return options.filter(
      (option) =>
        option.value === "none" ||
        !selectedValues.includes(option.value) ||
        option.value === selectedCategory
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadInProgress(true);
    setPopupMessage("Uploading data...");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "additionalfiles") {
        formData.additionalfiles.forEach((file) => data.append("files", file));
      } else if (key === "thumbnail") {
        if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
      } else {
        data.append(key, formData[key]);
      }
    });

    // console.log(formdata)

    try {
      const response = await fetch("/api/uploadProduct", {
        method: "POST",
        body: data,
      });
      console.log("data sent to api/apload")

      if (response.ok) {
        setPopupMessage("Upload successful!");
        setFormData({
          type: "none",
          title: "",
          description: "",
          details: "",
          thumbnail: null,
          additionalfiles: [],
          category: "none",
          subcategory1: "none",
          subcategory2: "none",
          subcategory3: "none",
          clientdetails: "",
        });
      } else {
        const result = await response.json();
        setPopupMessage(`Upload failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setPopupMessage("An error occurred during upload.");
    } finally {
      setUploadInProgress(false);
      setTimeout(() => {
        setPopupMessage(null);
      }, 8000); // Clear the popup after 8 seconds
    }
  };

  const handleReset = () => {
    setFormData({
      type: "none",
      title: "",
      description: "",
      details: "",
      thumbnail: null,
      additionalfiles: [],
      category: "none",
      subcategory1: "none",
      subcategory2: "none",
      subcategory3: "none",
      clientdetails: "",
    });
  };
  

  return (
    <>
      <Navbar />
      <Layout>
        <Logout />
        <div className={styles.uploadmainbody}>

        {popupMessage && (
            <div className={styles.popup}>{popupMessage}</div>
          )}

          <form
            className={styles.uploadsectionbody}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            method="POST"
          >
            {/* product title */}
            <div className={styles.blocks}>
              <div className={styles.title}>Product Title</div>
              <input
                type="text"
                className={styles.inputfield}
                placeholder="Enter product title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* product type & category */}
            <div className={styles.blocks}>
              <div className={styles.titlediv}>
                <div className={styles.title}>Product type</div>
                <div className={styles.title}>Product category</div>
              </div>
              <div className={styles.selectdiv}>
                <select
                  name="type"
                  id="type"
                  className={styles.inputfield}
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="none">select product type</option>
                  <option value="product">Product</option>
                  <option value="digitalart">Digital Art</option>
                  <option value="photography">Photography</option>
                </select>
                <select
                  name="category"
                  id="category"
                  className={styles.inputfield}
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="none">Select product category</option>
                  <option value="graphic">Graphic</option>
                  <option value="website">website</option>
                </select>
              </div>
            </div>

            {/* product sub category */}
            <div className={styles.blocks}>
              <div className={styles.title}>Product sub Categories</div>
              <div className={styles.selectdiv}>
                {[1, 2, 3].map((num) => (
                  <select
                    key={`subcategory${num}`}
                    name={`subcategory${num}`}
                    className={styles.inputfield}
                    onChange={handleInputChange}
                    value={formData[`subcategory${num}`]}
                  >
                    {getFilteredOptions(formData[`subcategory${num}`]).map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                ))}
              </div>
            </div>

            {/* product client details */}
            <div className={styles.blocks}>
              <div className={styles.title}>Product client details</div>
              <input
                type="text"
                className={styles.inputfield}
                placeholder="Enter client details"
                name="clientdetails"
                value={formData.clientdetails}
                onChange={handleInputChange}
              />
            </div>

            {/* product description */}
            <div className={styles.blocks}>
              <div className={styles.title}>Product Description</div>
              <textarea
                className={styles.textarea}
                placeholder="Enter the product description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* product thumbnail files */}
            <div className={styles.blocks}>
              <div className={styles.title}>upload Thumbnail</div>
              <div className={styles.thumbnailcontainerblocks}>
                <label className={styles.uploadBox}>
                  {formData.thumbnail ? (
                    <>
                      <div className={styles.imagename}>
                        <Image
                          src={URL.createObjectURL(formData.thumbnail)}
                          alt="Thumbnail Preview"
                          className={styles.thumbnailImage}
                          width={0}
                          height={0}
                        />
                        <div className={styles.thumbnailname}>
                          {formData.thumbnail.name}
                        </div>
                      </div>
                      <button
                        className={styles.thumbnailrevomeicon}
                        onClick={removeThumbnail}
                      >
                        <i
                          className={`material-symbols-outlined ${styles.icon}`}
                        >
                          cancel
                        </i>
                      </button>
                    </>
                  ) : (
                    <div className={styles.addPhoto}>
                      <i className={`material-symbols-outlined ${styles.icon}`}>
                        image
                      </i>
                      <div>Add thumbnail</div>
                    </div>
                  )}
                  <input
                    type="file"
                    className={styles.thumbnailinputfield}
                    name="thumbnail"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>

            {/* product image files */}
            {formData.type !== "photography" && formData.type !== "digitalart" && (
            <div className={styles.blocks}>
              <div className={styles.title}>Upload Product Files</div>

              <div className={styles.productfilecontainer}>
                <label className={styles.uploadButton}>
                  <input
                    type="file"
                    className={styles.fileinputfield}
                    accept="image/png, image/jpeg, image/svg+xml"
                    name="productfiles"
                    onChange={handleInputChange}
                    multiple
                  />
                  <div className={styles.icondiv}>
                    <i className={`material-symbols-outlined ${styles.icon}`}>
                      image
                    </i>
                    <div className={styles.blocktitle}>
                      Add Photo ({Object.keys(formData.additionalfiles).length}
                      /20)
                    </div>
                  </div>
                </label>

                <div className={styles.thumbnailContainer}>
                  {formData.thumbnail && (
                    <div className={styles.thumbnailpreview}>
                      <div className={styles.imagename}>
                        <Image
                          src={URL.createObjectURL(formData.thumbnail)}
                          alt="Thumbnail Preview"
                          className={styles.thumbnailimg}
                          width={0}
                          height={0}
                        />
                        <div className={styles.thumbnailname}>
                          {/* {formData.thumbnail.name} */}
                          product thumbnail
                        </div>
                      </div>
                    </div>
                  )}
                  {formData.additionalfiles.map((file, index) => (
                    <div className={styles.thumbnailpreview} key={index}>
                      <div className={styles.imagename}>
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`File Preview ${index}`}
                          className={styles.thumbnailimg}
                          width={100}
                          height={100}
                        />
                        <div className={styles.thumbnailname}>{file.name}</div>
                      </div>
                      <button
                        className={styles.thumbnailrevomeicon}
                        onClick={() => removeFile(index)}
                      >
                        <i
                          className={`material-symbols-outlined ${styles.icon}`}
                        >
                          cancel
                        </i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* product details */}
            {formData.type !== "photography" && formData.type !== "digitalart" && (
            <div className={styles.blocks}>
              <div className={styles.title}>Product Details</div>
              <RichTextEditor
                value={formData.details}
                onChange={handleEditorChange}
              />
            </div>
            )}

            {/* submit btn */}
            <div className={styles.btnblocks}>
            <button
                type="submit"
                className={styles.submitbtn}
                disabled={uploadInProgress}
              >
                {uploadInProgress ? "Uploading..." : "Upload"}
              </button>
              <button type="reset" className={styles.submitbtn} onClick={handleReset}>reset</button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}
