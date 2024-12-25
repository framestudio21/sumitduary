// admin/signup.js

"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


import Logout from '../../components/Logout';
import Navbar from '../../components/Navbar';
import Layout from '../../components/PageLayout';
import styles from "../../styles/Login.module.css";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    try {
      const response = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        window.alert("Signup successful! Redirecting to login page..."); 
        setSuccessMessage("Login successful!");// Alert on success
        setError("");
        router.push('/admin/login'); // Redirect after successful signup
      } else {
        const data = await response.json();
        setError(data.message || 'Error during signup');
        setSuccessMessage("");
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Signup error:', error);
      setSuccessMessage("");
    }
  };
  
  

  return (
    <>
      <Navbar />
      <Layout>
          <Logout/>
        <div className={styles.signunmainbody}>
          <div className={styles.logindiv}>
            <Image
              src="/logo/sumitduarylogoblack1.svg"
              className={styles.logoimage}
              alt="Frame-Logo"
              width={200}
              height={80}
              priority
            />
            <div className={styles.title}>signup page</div>
            <form className={styles.formdiv} onSubmit={handleSignup}>
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
