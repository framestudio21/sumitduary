import { useState, useEffect } from "react";
import Image from "next/image";

import styles from "./ImageCarousel.module.css";
import getDirectDriveLink from "../utils/getDirectDriveLink"; // Adjust path as needed

const ImageCarousel = ({ images }) => {
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // const imagesPerView = Math.min(4, images.length); // Max three images in view

  const [imagesPerView, setImagesPerView] = useState(4); // Default to 4 for large screens

  useEffect(() => {
    const updateImagesPerView = () => {
      if (window.matchMedia("(max-width: 480px)").matches) {
        setImagesPerView(1);
      } else if (window.matchMedia("(max-width: 720px)").matches) {
        setImagesPerView(2);
      } else if (window.matchMedia("(max-width: 1020px)").matches) {
        setImagesPerView(3);
      } else {
        setImagesPerView(4);
      }
    };

    // Initial setup
    updateImagesPerView();

    // Add event listener for resizing
    window.addEventListener("resize", updateImagesPerView);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateImagesPerView);
    };
  }, []);

  const customStyle = {
    width: `calc(98% / ${imagesPerView})`, // Dynamically calculate width
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNextSlide = () => {
    if (currentStartIndex + 1 < images.length) {
      setCurrentStartIndex((prev) => prev + 1); // Move forward by 1 image
    }
  };

  const goToPrevSlide = () => {
    if (currentStartIndex > 0) {
      setCurrentStartIndex((prev) => prev - 1); // Move backward by 1 image
    }
  };

  const downloadAsJPG = async (imageURL, fileName) => {
    try {
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
    <>
      {/* Carousel */}
      <div className={styles.carouselcontainer}>
        <button
          className={styles.leftcarouselbtn}
          onClick={goToPrevSlide}
          disabled={currentStartIndex === 0}
        >
          <i className={`material-icons ${styles.icon}`}>chevron_left</i>
        </button>

        <div className={styles.carousel}>
          {images
            .slice(currentStartIndex, currentStartIndex + imagesPerView)
            .map((image, index) => (
              <Image
                key={index}
                src={getDirectDriveLink(image.src)} // Use the utility function here
                alt={image.name}
                style={customStyle} // Dynamically adjust the width
                className={styles.carouselimage}
                onClick={() => openModal(currentStartIndex + index)}
                width={1000}
                height={1000}
                priority={false} // Enable lazy loading by default
                placeholder="blur" // Use placeholder for the loading state
                blurDataURL="/image/preloadimage.svg"
              />
            ))}
        </div>

        <button
          className={styles.rightcarouselbtn}
          onClick={goToNextSlide}
          disabled={currentStartIndex + imagesPerView >= images.length}
        >
          <i className={`material-icons ${styles.icon}`}>chevron_right</i>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalimagebody}>
            <button
              className={styles.modelbtn}
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <i className={`material-icons ${styles.icon}`}>chevron_left</i>
            </button>
            <Image
              src={getDirectDriveLink(images[currentIndex].src)} // Use the utility function for the modal as well
              alt={images[currentIndex].name}
              className={styles.modalcontentimage}
              width={1000}
              height={1000}
              priority={false} // Enable lazy loading by default
              placeholder="blur" // Use placeholder for the loading state
              blurDataURL="/image/preloadimage.svg"
            />

            <button
              className={styles.modelbtn}
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }
            >
              <i className={`material-icons ${styles.icon}`}>chevron_right</i>
            </button>
          </div>
          <i className={`material-icons ${styles.closebtn}`} onClick={closeModal}>
            cancel
          </i>
          <div className={styles.imagename}>{images[currentIndex].name}</div>
          <button
            onClick={() => {
              window.open(getDirectDriveLink(images[currentIndex].src))
              const link = document.createElement("a");
              link.href = images[currentIndex].webContentLink; // Use webContentLink for direct download
              link.download = images[currentIndex].name; // Suggest a filename for download
              link.click();
            }}
            // onClick={() =>
            //   downloadAsJPG(
            //     images[currentIndex].webContentLink || getDirectDriveLink(images[currentIndex].src),
            //     images[currentIndex].name
            //   )
            // }
            className={styles.downloadbtn}
          >
            <i className={`material-icons ${styles.icon}`}>download</i> Download
          </button>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
