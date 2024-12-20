//product/id.js

"use client";

import DOMPurify from "dompurify";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "../../components/Navbar";
import PageLayout from "../../components/PageLayout";
// import PreLoader from "../../../../components/Preloader";
import ImageCarousel from "../../components/ImageCarousel";
// import Logout from "../components/Logout";

import styles from "../../styles/Id.module.css";

// import BehanceLogo from "@/icon/behance.png";
// import DribbleLogo from "@/icon/dribble.png";
// import FacebookLogo from "@/icon/facebook.png";
// import InstagramLogo from "@/icon/instagram.png";
// import PinterestLogo from "@/icon/pinterest.png";
// import TwitterLogo from "@/icon/twitter.png";

import getDirectDriveLink from "../../utils/getDirectDriveLink";

export default function Id() {
  const [data, setData] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const [prevItems, setPrevItems] = useState([]);
  const [nextItems, setNextItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (!pathname) {
      console.warn(
        "Pathname is not available yet. Component will retry rendering."
      );
      return;
    }

    const cleanPathname = pathname.replace("/procat/", "");
    const pathParts = cleanPathname.split("-");
    if (pathParts.length < 2) {
      console.error("Invalid URL format. Expected at least two parts.");
      router.replace("/404"); // Redirect to 404 if the URL format is invalid
      return;
    }
    const [_id, specialID, ...titleParts] = pathParts;

    if (!_id || !specialID) {
      router.replace("/404");
      return;
    }

    setIsLoading(true);
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
          setData({ ...responseData.currentProduct, additionalFiles });

          // Check for specific types and redirect if needed
          const type = responseData.currentProduct?.type?.toLowerCase();
          if (type === "digitalart" || type === "photography") {
            router.back(); // Redirect to the previous page
            return;
          }

          // home-specific data
          setPrevItems(
            responseData.prevProductItem ? [responseData.prevProductItem] : []
          );
          setNextItems(
            responseData.nextProductItem ? [responseData.nextProductItem] : []
          );
          setRelatedItems([
            ...(Array.isArray(responseData.cardPrevProduct)
              ? responseData.cardPrevProduct
              : []),
            ...(Array.isArray(responseData.cardNextProduct)
              ? responseData.cardNextProduct
              : []),
          ]);
          responseData;
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        router.replace("/404");
      })
      .finally(() => setIsLoading(false));
  }, [pathname]);

  const copyToClipboard = () => {
    if (!data) return;
    const urlToCopy = `${window.location.origin}/procat/${data._id}-${
      data.specialID
    }-${encodeURIComponent(data.title)}`;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopySuccess("Image link copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 5000);
      })
      .catch(() => setCopySuccess("Failed to copy!"));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <div className={styles.copylink} onClick={copyToClipboard}>
        click to copy reference
      </div>
      {copySuccess && <div className={styles.copySuccess}>{copySuccess}</div>}

      <PageLayout>

              {/* Loading Indicator */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          {/* <p>Loading data, please wait...</p> */}
        </div>
      )}


        <div className={styles.idmainbody}>
        {!isLoading && (
            <>
          <div className={styles.producttitle}>
            {data ? data.title : "Loading..."}
          </div>
          <div className={styles.producttypeowner}>
            <div className={styles.owner}>
              by sumit kumar duary :{" "}
              <span className={styles.date}>
                {data?.createdAt
                  ? formatDate(data.createdAt)
                  : "Date unavailable"}
              </span>
            </div>
            <div className={styles.type}>
              {data?.subCategories?.length ? (
                <>
                  <Link
                    href={`/procat/category/subcategory/${data.subCategories[0]}`}
                    className={styles.typelink}
                  >
                    {data.subCategories[0]},
                  </Link>
                  <Link
                    href={`/procat/category/subcategory/${data.subCategories[1]}`}
                    className={styles.typelink}
                  >
                    {data.subCategories[1]},
                  </Link>
                  <Link
                    href={`/procat/category/subcategory/${data.subCategories[2]}`}
                    className={styles.typelink}
                  >
                    {data.subCategories[2]}
                  </Link>
                </>
              ) : (
                "Loading categories..."
              )}
            </div>
            <div className={styles.typecategory}>
              <Link
                href={`/procat/type/${data?.type || "#"}`}
                className={styles.owner}
              >
                {data ? `type: ${data.type}` : "Loading type..."}
              </Link>
              <Link
                href={`/procat/category/${data?.category || "#"}`}
                className={styles.owner}
              >
                {data
                  ? `category: ${data.category} design`
                  : "Loading category..."}
              </Link>
            </div>
          </div>

          {/* details body */}
          <div className={styles.bodydatadiv}>
            {data ? (
              <>
                <div
                  className={styles.dataparagraph}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.details),
                  }}
                />
                {data.base64Image && (
                  <Image
                    src={`data:image/${getImageFormat(
                      data.base64Image
                    )};base64,${data.base64Image}`}
                    alt={data.title}
                    width={0} // Setting width to 0 here since it's controlled via style
                    height={0} // Same for height, we'll use 'style' to control dimensions
                    style={{
                      width: "100%", // Set width to 100% to fill the container
                      height: "auto", // Maintain the aspect ratio automatically
                    }}
                    layout="responsive"
                  />
                )}
              </>
            ) : (
              "Loading..."
            )}
          </div>

          {/* Image Carousel */}
          {data?.additionalFiles?.length > 0 ? (
            <ImageCarousel images={data.additionalFiles} />
          ) : (
            <div>No images available</div>
          )}

          {/* description details div */}
          <div className={styles.descriptiondiv}>
            <div className={styles.title}>description</div>
            <div className={styles.text}>
              {data ? data.description : "Loading description..."}
            </div>
          </div>
          <div className={styles.clientdetailsdiv}>
            <div className={styles.title}>client</div>
            <div className={styles.text}>
              {data ? data.clientDetails : "Loading clientdetails..."}
            </div>
          </div>

          {/* Previous & Next Product Links */}
          <div className={styles.productlink}>
            {prevItems.length > 0 ? (
              prevItems.map((item) => (
                <Link
                  key={item._id}
                  href={`/procat/${item._id}-${
                    item.specialID
                  }-${encodeURIComponent(item.title)}`}
                  className={styles.prevLink}
                >
                  <div className={styles.arrow}>&lt;</div>
                  <div className={styles.text}>
                    {item.title || "Previous Product"}
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.placeholder}>No previous product</div>
            )}

            {nextItems.length > 0 ? (
              nextItems.map((item) => (
                <Link
                  key={item._id}
                  href={`/procat/${item._id}-${
                    item.specialID
                  }-${encodeURIComponent(item.title)}`}
                  className={styles.nextLink}
                >
                  <div className={styles.text}>
                    {item.title || "Next Product"}
                  </div>
                  <div className={styles.arrow}>&gt;</div>
                </Link>
              ))
            ) : (
              <div className={styles.placeholder}>No next product</div>
            )}
          </div>

          {/* card carousel */}
          <div
            className={`${styles.cardcarousel} ${
              relatedItems.length === 0 ? styles.hidden : ""
            }`}
          >
            {relatedItems.length > 0 ? (
              relatedItems.map((item, index) => (
                <div className={styles.cardbody} key={`${item._id}-${index}`}>
                  <Image
                    src={
                      item.thumbnail && item.thumbnail.webViewLink
                        ? getDirectDriveLink(item.thumbnail.webViewLink)
                        : "/image/image1.webp"
                    }
                    className={styles.cardimage}
                    width={100}
                    height={100}
                    alt={item.title || "Item Image"}
                    priority
                  />
                  <div className={styles.cardtext}>
                    <Link
                      href={`/procat/${item._id}-${
                        item.specialID
                      }-${encodeURIComponent(item.title)}`}
                      className={styles.cardtitle}
                    >
                      {item.title}
                    </Link>
                    {item.description && (
                      <div className={styles.carddescription}>
                        {item.description.substring(0, 100)}...
                      </div>
                    )}
                    <Link
                      href={`/procat/${item._id}-${
                        item.specialID
                      }-${encodeURIComponent(item.title)}`}
                      className={styles.cardlink}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div>No related products available</div>
            )}
          </div>
          </>
          )}
        </div>
      </PageLayout>
    </>
  );
}
