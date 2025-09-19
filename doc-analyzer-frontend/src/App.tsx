// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./components/Home";
import Upload from "./components/Upload/Upload";
import History from "./components/History/History";
import DocumentDetail from "./components/DocumentDetail/DocumentDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Wrap all pages with MainLayout for consistent header/nav */}
        <Route path="/" element={<MainLayout />}>
          {/* Default home page */}
          <Route index element={<Home />} />
          {/* Upload page */}
          <Route path="upload" element={<Upload />} />
          {/* History page */}
          <Route path="history" element={<History />} />
          {/* Document detail page */}
          <Route path="documents/:id" element={<DocumentDetail />} />
          {/* Optional: fallback for unmatched routes */}
          <Route path="*" element={<div style={{ padding: "2rem" }}>Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
