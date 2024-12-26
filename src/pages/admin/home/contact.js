"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import Navbar from "../../../components/Navbar";
import Layout from "../../../components/PageLayout";
import Logout from "../../../components/Logout";
import getDirectDriveLink from "@/utils/getDirectDriveLink";

import styles from "../../../styles/AdminContact.module.css";
import Link from "next/link";

// Reusable component for rendering each contact item
function ContactItem({
  item,
  formatTimestamp,
  deleteContact,
  updateStatus,
  openModal,
}) {
  return (
    <div className={styles.contactdatabody}>
      <div className={styles.iddatediv}>

        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>date :</div>
          <div className={styles.iddetails}>
            {formatTimestamp(item.createdAt)}
          </div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>name :</div>
          <div className={styles.iddetails}>{item.name}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>email :</div>
          <div className={styles.iddetails}>{item.email}</div>
        </div>
      </div>
      <div className={styles.iddatediv}>
        <div className={styles.uniqueIDdiv}>
          <div className={styles.title}>subject :</div>
          <div className={styles.iddetails}>{item.subject}</div>
        </div>
      </div>
      <div className={styles.massagediv}>
        <div className={styles.title}>message :</div>
        <div className={styles.iddetails}>{item.message}</div>
      </div>
      <div className={styles.btnsection}>
        <select
          className={styles.donebtn}
          value={item.status}
          onChange={(e) => updateStatus(item._id, e.target.value)}
        >
          <option value="incomplete">Incomplete</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="complete">Complete</option>
        </select>
        <button
          className={styles.deletebtn}
          onClick={() => deleteContact(item._id)}
        >
          Delete
        </button>
        <button className={styles.deletebtn} onClick={() => openModal(item)}>
          View
        </button>
      </div>
    </div>
  );
}

// Modal Component
function ContactModal({ contact, onClose, deleteContact, updateStatus }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.title}>Contact Details</div>
        <div className={styles.contactDetails}>
          <div className={styles.contactDetailssectiongroup}>
            <div className={styles.contactDetailssection}>
              <strong>Name:</strong> {contact.name}
            </div>
            <div className={styles.contactDetailssection}>
              <strong>Email:</strong> {contact.email}
            </div>
          </div>

          <div className={styles.contactDetailssectiongroup}>
            <p className={styles.contactDetailssection}>
              <strong>Category:</strong> {contact.category}
            </p>
            <p className={styles.contactDetailssection}>
              <strong>Date:</strong> {contact.createdAt}
            </p>
          </div>

          <p className={styles.contactDetailssection}>
            <strong>Unique ID:</strong> {contact.uniqueID}
          </p>

          <p className={styles.contactDetailssection}>
            <strong>Special ID:</strong> {contact.specialID}
          </p>

          <p className={styles.contactDetailssection}>
            <strong>Subject:</strong> {contact.subject}
          </p>
          <p className={styles.contactDetailssection}>
            <strong>reference link:</strong> {contact.referenceLink}
          </p>
          <div className={styles.contactDetailssectiongroup}>
            <p className={styles.contactDetailssection}>
              <strong>Message:</strong> {contact.message}
            </p>
          </div>

          {/* Display Images */}
          {contact.referenceImages &&
            Object.keys(contact.referenceImages).length > 0 && (
              <div className={styles.contactDetailssection}>
                <strong>Images:</strong>
                <div className={styles.imageGallery}>
                  {Object.values(contact.referenceImages).map((file, idx) => (
                    <Link
                      key={idx}
                      href={file.webContentLink} // Use webContentLink for the download link
                      download={file.name || `image-${idx}`} // Suggested filename for download
                      target="_blank" // Open in a new tab
                      rel="noopener noreferrer"
                      className={styles.imagelink}
                    >
                      <Image
                        src={getDirectDriveLink(file.webViewLink)} // Display the image using the direct view link
                        alt={file.name || `contact-img-${idx}`}
                        className={styles.contactImage}
                        width={1000}
                        height={1000}
                        priority={false} // Enable lazy loading by default
                        placeholder="blur" // Use placeholder for the loading state
                        blurDataURL="/image/preloadimage.svg"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Status Dropdown */}
          <div className={styles.statusUpdateDiv}>
            <div className={styles.title}>update the Status: </div>
            <select
              className={styles.select}
              value={contact.status}
              onChange={(e) => updateStatus(contact._id, e.target.value)}
            >
              <option className={styles.option} value="incomplete">
                Incomplete
              </option>
              <option className={styles.option} value="pending">
                Pending
              </option>
              <option className={styles.option} value="processing">
                Processing
              </option>
              <option className={styles.option} value="complete">
                Complete
              </option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.btnsection}>
          <button
            onClick={() => deleteContact(contact._id)}
            className={styles.deletebtn}
          >
            Delete
          </button>
          <button onClick={onClose} className={styles.deletebtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("incomplete");
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null); // Modal contact data

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/contact`); // Fetch all contacts
        if (!response.ok) throw new Error("Failed to fetch contacts");
        const data = await response.json();
        setContacts(data.data); // Store all contacts
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, status: newStatus } : contact
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      alert("Failed to update status: " + error.message);
    }
  };

  const deleteContact = async (_id) => {
    try {
      const response = await fetch(`/api/contact`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      if (!response.ok) throw new Error("Failed to delete contact");
      setContacts((prev) => prev.filter((contact) => contact._id !== _id));
      alert("Contact deleted successfully!");
    } catch (error) {
      alert("Failed to delete contact: " + error.message);
    }
  };

  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();

  const openModal = (contact) => setSelectedContact(contact);
  const closeModal = () => setSelectedContact(null);

  // console.log(contacts);

  const groupByStatus = (data) => {
    return data.reduce((groups, contact) => {
      const { status } = contact;
      if (!groups[status]) groups[status] = [];
      groups[status].push(contact);
      return groups;
    }, {});
  };

  return (
    <>
      <Navbar />
      <Layout>
        <Logout />
        <div className={styles.admincontactmainbody}>
          <div className={styles.contactbody}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {loading ? (
             <div className="loadingOverlay">
                         <div className="loadingSpinner"></div>
                         {/* <p>Loading data, please wait...</p> */}
                         <Image src="/logo/sumitduarylogowhite1.svg" className="loadingLogo" width={200} height={50} alt="sumit-duary-logo"/>
                       </div>
            ) : contacts.length === 0 ? (
              <div>No contacts found.</div>
            ) : (
              <>
                {/* Status filter dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={styles.selectFilterOption}
                >
                  <option className={styles.option} value="all">
                    All
                  </option>
                  <option className={styles.option} value="incomplete">
                    Incomplete
                  </option>
                  <option className={styles.option} value="pending">
                    Pending
                  </option>
                  <option className={styles.option} value="processing">
                    Processing
                  </option>
                  <option className={styles.option} value="complete">
                    Complete
                  </option>
                </select>

                <div className={styles.contactdatamainbody}>
                  {statusFilter === "all" ? (
                    // Group by status and render
                    Object.entries(groupByStatus(contacts)).map(
                      ([status, group]) => (
                        <div key={status} className={styles.groupSection}>
                          <div className={styles.groupTitle}>
                            {status.toUpperCase()}
                          </div>
                          <div className={styles.groupdata}>
                            {group.map((item) => (
                              <ContactItem
                                key={item._id}
                                item={item}
                                formatTimestamp={formatTimestamp}
                                deleteContact={deleteContact}
                                updateStatus={updateStatus}
                                openModal={openModal}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    // Filter by selected status
                    <div className={styles.groupSection}>
                      {/* <div className={styles.groupTitle}>
                        {statusFilter.toUpperCase()}
                      </div> */}
                      <div className={styles.groupdata}>
                        {contacts
                          .filter((item) => item.status === statusFilter)
                          .map((item) => (
                            <ContactItem
                              key={item._id}
                              item={item}
                              formatTimestamp={formatTimestamp}
                              deleteContact={deleteContact}
                              updateStatus={updateStatus}
                              openModal={openModal}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal */}
                {selectedContact && (
                  <ContactModal
                    contact={selectedContact}
                    onClose={closeModal}
                    deleteContact={deleteContact}
                    updateStatus={updateStatus}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
