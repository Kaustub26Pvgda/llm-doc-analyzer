import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import homeIcon from "../assets/home.png";

const MainLayout: React.FC = () => (
  <div className={styles.container}>
    <header className={styles.header}>
      <h1 className={styles.title}>Document Analyzer</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link} title="Home">
          <img src={homeIcon} alt="Home" style={{ width: 22, height: 22, verticalAlign: "middle", marginRight: 8 }} />
          <span style={{ verticalAlign: "middle" }}>Home</span>
        </Link>
        <Link to="/upload" className={styles.link}>Upload & Analyze</Link>
        <Link to="/history" className={styles.link}>History</Link>
      </nav>
    </header>
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
