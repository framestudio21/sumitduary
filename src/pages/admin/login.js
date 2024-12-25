// admin/login.js

"use client"


import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


import Navbar from '@/components/Navbar';
import Layout from '@/components/PageLayout';
import styles from "@/styles/Login.module.css";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

  
      const data = await response.json();
  
      if (response.ok) {
        setSuccessMessage("Login successful!");
        setError("");
        setTimeout(() => {
          router.push("/admin/home");
        }, 500);
        // router.push("/admin/home");
        // window.location.href = data.redirect || "/admin/home";
      } else {
        setError(data.error || "Login failed");
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setSuccessMessage("");
    }
  };
  


  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.loginmainbody}>
          <div className={styles.logindiv}>
            <Image
              src="/logo/sumitduarylogoblack1.svg"
              className={styles.logoimage}
              alt="Frame-Logo"
              width={200}
              height={80}
              priority
            />
            {/* <div className={styles.title}>login page</div> */}
            <form className={styles.formdiv} onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                className={styles.inputfield}
                placeholder="user@service.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                className={styles.inputfield}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className={styles.errorMessage}>{error}</p>}
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>} {/* Display success message */}
              <button type="submit" className={styles.submitbtn}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}
