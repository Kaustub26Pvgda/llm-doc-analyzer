import React from "react";
import styles from "./Home.module.css";

const Home: React.FC = () => (
  <div className={styles.homeCard}>
    <h2 className={styles.title}>Welcome to Document Analyzer</h2>
    <p className={styles.desc}>
      Upload PDF documents, extract and analyze their contents, and view your document history. Use the navigation above to get started.
    </p>
    <ul className={styles.features}>
      <li>Upload and preview PDF text</li>
      <li>Analyze documents for type and missing fields</li>
      <li>View history and details for each document</li>
    </ul>
  </div>
);

export default Home;
