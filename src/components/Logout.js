
//components/logout.js

"use client"

import React from 'react'
import { useRouter } from 'next/navigation';

import styles from "./Logout.module.css"

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to the login page after successful logout
        router.push('/admin/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


      const handleContactClick = () => {
        router.push("/admin/home/contact");
      };

      const handleUploadClick = () => {
        router.push("/admin/home/upload");
      };
    
      const handleEditClick = () => {
        router.push("/admin/home/edit");
      };

      const handleHomeClick = () => {
        router.push("/admin/home");
      };
    
  return (
    <>
                {/* log out button */}
          <div className={styles.topnavbar}>
            <div className={styles.text}>Welcome back</div>
            
            <div className={styles.btnsection}>
            <button type="button" className={styles.logoutbtn} onClick={handleHomeClick}>
              home
            </button>
            <button type="button" className={styles.logoutbtn} onClick={handleContactClick}>
              contact
            </button>
            <button type="button" className={styles.logoutbtn} onClick={handleEditClick}>
              edit
            </button>
            <button type="button" className={styles.logoutbtn} onClick={handleUploadClick}>
              upload
            </button>
            <button type="button" className={styles.logoutbtn} onClick={handleLogout}>
              Log out
            </button>
            </div>

          </div>
    </>
  )
}
