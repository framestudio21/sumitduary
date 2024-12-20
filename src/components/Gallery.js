"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import getDirectDriveLink from "../utils/getDirectDriveLink";

import styles from "./Gallery.module.css";

function Gallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const [scale, setScale] = useState(1);
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Open the full-sized image viewer
  const viewImage = (index) => {
    setCurrentIndex(index);
    setScale(1);
  };

  // Close the image viewer
  const close = (e) => {
    e.stopPropagation();
    setCurrentIndex(null);
    setCopySuccess("");
  };

  // Copy the image reference to clipboard
  const copyToClipboard = (e) => {
    e.stopPropagation();
    const image = images[currentIndex];
    const urlToCopy = `${encodeURIComponent(image.type)}+${encodeURIComponent(
      image._id
    )}+${encodeURIComponent(image.uniqueID)}=${encodeURIComponent(
      image.title
    )}`;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopySuccess("Image link copied to clipboard!");
        setTimeout(() => {
          setCopySuccess("");
        }, 5000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy!");
      });
  };

  // Navigate to the previous image
  const previousImage = (e) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      const newIndex =
        currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    }
  };

  // Navigate to the next image
  const nextImage = (e) => {
    e.stopPropagation();
    if (currentIndex !== null) {
      const newIndex =
        currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }
  };

  // Handle image zoom on scroll
  const handleScroll = (e) => {
    e.preventDefault();
    setScale((prevScale) =>
      Math.max(1, Math.min(prevScale + (e.deltaY < 0 ? 0.1 : -0.1), 5))
    );
  };

  const downloadAsJPG = async (imageURL, fileName) => {
    try {
      // Ensure fileName is defined and valid
      if (!fileName) {
        fileName = "image"; // Fallback filename
      }
  
      // Proxy the image to bypass CORS
      const proxiedURL = `http://localhost:4000/proxy?url=${encodeURIComponent(imageURL)}`;
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = proxiedURL;
  
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
  
          canvas.width = img.width;
          canvas.height = img.height;
  
          context.drawImage(img, 0, 0);
  
          const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
  
          const link = document.createElement("a");
          link.href = jpgDataUrl;
  
          // Safely replace file extension
          link.download = fileName.replace(/\.[^/.]+$/, ".jpg");
          link.click();
        } catch (error) {
          console.error("Error converting image:", error);
        }
      };
  
      img.onerror = (err) => {
        console.error("Failed to load image for download:", err);
        alert("Failed to load the image. Check the URL or CORS settings.");
      };
    } catch (error) {
      console.error("Error during image download:", error);
    }
  };
  

  return (
    <div>
      <div className={styles.gallery}>
        {/* Check if images is a valid array */}
        {Array.isArray(images) &&
          images.map((image, index) => {
            const aspectRatio = image.width / image.height;
            const calculatedWidth = 200 * aspectRatio; // Fixed height is 300px

            return (
              <div
                key={index}
                className={styles.galleryItem}
                style={{
                  width: `${calculatedWidth}px`,
                  height: windowWidth < 480 ? "auto" : "200px",
                }}
                onClick={() => viewImage(index)} // Properly attach click handler
              >
                <Image
                  src={image.thumbnail}
                  alt={image.title}
                  width={calculatedWidth || 1000}
                  height={200}
                  className={styles.galleryImage}
                  priority
                />
              </div>
            );
          })}
      </div>

      {currentIndex !== null && images[currentIndex] && (
        <div
          className={styles.imagedisplaydiv}
          onClick={close}
          onWheel={handleScroll}
        >
          <div className={styles.leftside} onClick={previousImage}>
            <button className={styles.btn} onClick={previousImage}>
              <i className={`material-icons ${styles.icon}`}>arrow_back_ios</i>
            </button>
          </div>

          <div
            className={styles.imageContainer}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
              transition: "transform 0.2s ease",
              zIndex: 1,
            }}
          >
            <Image
              src={images[currentIndex].thumbnail}
              className={styles.image}
              priority
              width={images[currentIndex].width || 600}
              height={images[currentIndex].height || 300}
              alt={images[currentIndex].title}
              style={{
                maxHeight: "700px",
                width: "auto",
              }}
            />
          </div>

          <div className={styles.imagetitle}>
            title : {images[currentIndex].title}
          </div>

          <div className={styles.imagereferencelink} onClick={copyToClipboard}>
            <i className={`material-symbols-outlined ${styles.icon}`}>
              file_copy
            </i>{" "}
            copy reference
          </div>
          <button
            className={styles.imagedownload}
            onClick={() =>
              downloadAsJPG(
                images[currentIndex].thumbnailDownload ||
                  getDirectDriveLink(images[currentIndex].thumbnail),
                images[currentIndex].name
              )
            }
          >
            <i className={`material-symbols-outlined ${styles.icon}`}>
              download
            </i>{" "}
            download
          </button>

          {copySuccess && <p className={styles.copySuccess}>{copySuccess}</p>}

          <div className={styles.rightside} onClick={nextImage}>
            <button className={styles.btn} onClick={nextImage}>
              <i className={`material-icons ${styles.icon}`}>
                arrow_forward_ios
              </i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
