// admin/index.js

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Layout from "@/components/PageLayout";
import PreLoader from "@/components/Preloader";

export default function Index() {
  //   const router = useRouter();

  //   useEffect(() => {
  //     router.push('/admin/login');
  //   }, [router]);

  return (
    <>
      <Navbar />
      <Layout>
        <div>
          <PreLoader />
          <div
            style={{
              backgroundColor: "#000",
              width: "100%",
              height: "100vh",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "3px",
              gap: "10px",
            }}
          >
            welcome admin
            <Link href="/admin/login">
              <button
                style={{
                  background: "none",
                  border: "1px solid #fff",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "0.5rem 2rem",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontWeight: "400",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                login
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
