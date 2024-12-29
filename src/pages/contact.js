//contact.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "../styles/Contact.module.css";
import Navbar from "../components/Navbar";
import Layout from "../components/PageLayout";

export default function Contact() {
  const [hoveredRadio, setHoveredRadio] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    referenceLink: "",
    category: "",
    message: "",
    referenceImages: [],
  });

  const handleHover = (category) => {
    setHoveredRadio(category);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    // Validate file size
  for (const file of files) {
    if (file.size > maxFileSize) {
      setError(`File ${file.name} exceeds the 5MB size limit.`);
      return;
    }
  }
    if (files.length + formData.referenceImages.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    const imagesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      referenceImages: [...prev.referenceImages, ...imagesWithPreview],
    }));
    setError(""); // Clear any previous error
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => {
      const updatedImages = prev.referenceImages.filter((_, i) => i !== index);
      updatedImages.forEach((img) => URL.revokeObjectURL(img.preview));
      return { ...prev, referenceImages: updatedImages };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.category
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading...");

    try {
      const data = new FormData();

      // Append form data fields
    Object.keys(formData).forEach((key) => {
      if (key === "referenceImages") {
        // Append each image file
        formData.referenceImages.forEach(({ file }) => {
          data.append("referenceImages", file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

      const response = await fetch("/api/uploadContact", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Submission failed");

      const responseData = await response.json();
      console.log("Server response:", responseData);

      setStatus("Upload successful!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        referenceLink: "",
        category: "",
        message: "",
        referenceImages: [],
      });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
       // Reset status after 3 seconds
    setTimeout(() => {
      setStatus(""); // Reset status after 3 seconds
    }, 5000);
    }
  };

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.contactmainbody}>
          {status && <div className={styles.statusMessage}>{status}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formdivbody}>
            <div className={styles.titlesection}>
              <div className={styles.title}>
                Got ideas? We've got the skills. Let's team up.
              </div>
              <div className={styles.subtitle}>
                Tell us more about yourself and what you've got in mind.
              </div>
            </div>

            <form
              className={styles.formsection}
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              method="POST"
            >
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  className={styles.emailtextinput}
                  name="email"
                  placeholder="Your email (Gmail only)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.blocks}>
                <input
                  type="text"
                  className={styles.textinput}
                  name="referenceLink"
                  placeholder="image reference link"
                  value={formData.referenceLink}
                  onChange={handleChange}
                />
              </div>

              {/* radio blocks */}
              <div className={styles.radioblocks}>
                <div className={styles.title}>
                  What is the matter of your query?
                </div>
                <div className={styles.inputfield}>
                  {[
                    "graphicdesign",
                    "logodesign",
                    "advertisement",
                    "typography",
                    "branding",
                    "layoutdesign",
                    "otherdesign",
                  ].map((category) => (
                    <div
                      key={category}
                      className={`${styles.radiodiv} ${
                        hoveredRadio === category ? styles.hovered : ""
                      }`}
                      onMouseEnter={() => handleHover(category)}
                      onMouseLeave={() => handleHover(null)}
                    >
                      <input
                        type="radio"
                        id={category}
                        value={category}
                        name="category"
                        className={styles.radio}
                        onChange={handleChange}
                      />
                      <label
                        className={styles.radioinputlabel}
                        htmlFor={category}
                      >
                        {category.replace("design", " Design")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* reference Image */}
              <div className={styles.imageblocks}>
                <div className={styles.title}>Reference Images</div>
                <div className={styles.imageUploadContainer}>
                  {formData.referenceImages.map((image, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <Image
                        src={image.preview}
                        alt="preview"
                        width={1000}
                        height={1000}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className={styles.removeButton}
                      >
                        <i
                          className={`material-symbols-outlined ${styles.icon}`}
                        >
                          cancel
                        </i>
                      </button>
                    </div>
                  ))}
                  {formData.referenceImages.length < 5 && (
                    <label className={styles.addImageLabel}>
                      <input
                        type="file"
                        accept="image/*, image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                        onChange={handleImageUpload}
                        multiple
                        className={styles.fileInput}
                      />
                      <i className={`material-symbols-outlined ${styles.icon}`}>
                        image
                      </i>
                      <div className={styles.text}>
                        Add Photo ({formData.referenceImages.length}/5)
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className={styles.blocks}>
                <textarea
                  className={styles.textarea}
                  name="message"
                  placeholder="Tell us about it..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.btnblocks}>
                <button
                  type="submit"
                  className={styles.sendbtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Uploading..." : "Submit"}
                </button>
                <button
                  type="button"
                  className={styles.resetbtn}
                  onClick={() =>
                    setFormData({
                      name: "",
                      email: "",
                      subject: "",
                      referenceLink: "",
                      category: "",
                      message: "",
                      referenceImages: [],
                    })
                  }
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
