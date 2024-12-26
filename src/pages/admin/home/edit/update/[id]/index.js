//admin/home/edit/update/[id].js

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "../../../../../../components/Navbar";
import Layout from "../../../../../../components/PageLayout";
import Logout from "../../../../../../components/Logout";
import RichTextEditor from "../../../../../../components/RichTextEditor";
import getDirectDriveLink from "@/utils/getDirectDriveLink";

import styles from "../../../../../../styles/Upload.module.css";

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
    clientDetails: "",
  });
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const cleanPathname = pathname.replace("/admin/home/edit/update/", "");
    const pathParts = cleanPathname.split("-");
    const [_id, specialID] = pathParts;

    if (!_id || !specialID) {
      router.replace("/404");
      return;
    }

    fetch(`/api/getProduct?productId=${_id}&specialID=${specialID}`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData.error) {
          console.error("Error fetching data:", responseData.error);
        } else {
          const additionalFiles = responseData.currentProduct?.additionalFiles
            ? Object.values(responseData.currentProduct.additionalFiles).map(
                (file) => ({
                  src: file.webViewLink,
                  name: file.name,
                  webContentLink: file.webContentLink,
                })
              )
            : [];

          // Map subcategories array to individual fields
          const [subcategory1, subcategory2, subcategory3] = responseData
            .currentProduct?.subCategories || ["none", "none", "none"];

          setFormData({
            ...responseData.currentProduct,
            thumbnail:
              responseData.currentProduct.thumbnail?.webViewLink || null,
            additionalfiles: additionalFiles,
            subcategory1,
            subcategory2,
            subcategory3,
          });
          setData(responseData.currentProduct);
        }
      })
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading(false));
  }, [pathname]);

  console.log(data);

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({ ...prevData, details: content }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (!file) return;

      if (name === "thumbnail") {
        setFormData((prevData) => ({ ...prevData, thumbnail: file }));
      } else if (name === "productfiles") {
        if (formData.additionalfiles.length >= 10) {
          alert("You can upload a maximum of 10 files.");
          return;
        }
        const isDuplicate = formData.additionalfiles.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (isDuplicate) {
          alert("This file has already been uploaded.");
          return;
        }
        setFormData((prevData) => ({
          ...prevData,
          additionalfiles: [...prevData.additionalfiles, file],
        }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
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

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "additionalfiles") {
        formData.additionalfiles.forEach((file) => data.append("files", file));
      } else if (key === "thumbnail") {
        if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
      } else if (
        key !== "subcategory1" &&
        key !== "subcategory2" &&
        key !== "subcategory3"
      ) {
        data.append(key, formData[key]); // Include other fields
      }
    });

    const subCategories = [
      formData.subcategory1,
      formData.subcategory2,
      formData.subcategory3,
    ].filter((subcategory) => subcategory !== "none"); // Exclude "none"

    data.append("subcategory1", subCategories[0] || ""); // Optional fallback
    data.append("subcategory2", subCategories[1] || ""); // Optional fallback
    data.append("subcategory3", subCategories[2] || ""); // Optional fallback

    try {
      const response = await fetch("/api/updateProduct", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Upload successful!");
        handleReset();
        router.push("/admin/home/edit"); // Redirect to the specified page
      } else {
        const result = await response.json();
        alert(`Upload failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploadInProgress(false);
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
      clientDetails: "",
    });
  };

  return (
    <>
      <Navbar />
      <Layout>
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
        <div>
        <Logout />
        <div className={styles.uploadmainbody}>
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
                name="clientDetails"
                value={formData.clientDetails}
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

            {/* old thumbnail image file */}
            {data && data.thumbnail && (
              <div className={styles.blocks}>
                <div className={styles.title}>Thumbnail Image</div>
                <div className={styles.thumbnailcontainerblocks}>
                  <label className={styles.uploadBox}>
                    <div className={styles.imagename}>
                      <Image
                        src={getDirectDriveLink(data.thumbnail.webViewLink)}
                        alt="Thumbnail Preview"
                        className={styles.thumbnailImage}
                        style={ { width:"400px", height: "400px" }}
                        width={400} // Replace with desired width
                        height={300} // Replace with desired height
                      />
                      <div className={styles.thumbnailname}>
                        {data.thumbnail.name || "Thumbnail Image"}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {data && data.additionalFiles && (
              <div className={styles.blocks}>
                <div className={styles.title}>Additional Files</div>
               <div className={styles.additionalfilesdisplaybox}>
                  {Object.keys(data.additionalFiles).map((key) => {
                    const file = data.additionalFiles[key];
                    return (
                      <div key={file.id} className={styles.thumbnailcontainerblocks}>
                      <div  className={styles.uploadBox}>
                        <div className={styles.imagename}>
                          <Image
                            src={getDirectDriveLink(file.webViewLink)}
                            alt={`${file.name || "File"} Preview`}
                            className={styles.thumbnailImage}
                            width={1000} // Replace with desired width
                            height={1000} // Replace with desired height
                          />
                          <div className={styles.thumbnailname}>
                            {file.name || "Unnamed File"}
                          </div>
                        </div>
                      </div>
                </div>
                    );
                  })}
               </div>
              </div>
            )}

            {/* product details */}
            {formData.type !== "photography" &&
              formData.type !== "digitalart" && (
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
              <button
                type="reset"
                className={styles.submitbtn}
                onClick={handleReset}
              >
                reset
              </button>
            </div>
          </form>
        </div>
        </div>
        )}
      </Layout>
    </>
  );
}
