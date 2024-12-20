// admin/signup.js

"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


import Navbar from '../../components/Navbar';
import Layout from '../../components/PageLayout';
import styles from "../../styles/Login.module.css";

import Framelogo from "@/image/spacelogoblack.svg"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        window.alert("Signup successful! Redirecting to login page..."); // Alert on success
        router.push('/admin/login'); // Redirect after successful signup
      } else {
        const data = await response.json();
        setError(data.message || 'Error during signup');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error('Signup error:', error);
    }
  };
  
  

  return (
    <>
      <Navbar />
      <Layout>
        <div className={styles.loginmainbody}>
          <div className={styles.logindiv}>
            <Image
              src={Framelogo}
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
              {success && <p className={styles.successMessage}>{success}</p>}
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
