import React, { useState, useRef } from "react";
import styles from "./Upload.module.css";
import { uploadDocument, analyzeDocument } from "../../services/api";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setUploadResult(null);
    setAnalysis(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadResult(null);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadDocument(file);
      if (data.id) {
        setUploadResult(data);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadResult) return;
    setAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeDocument(uploadResult.id);
      if (data.document_type) {
        setAnalysis(data);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Upload PDF Document</h2>
      <div
        className={dragActive ? styles.dropAreaActive : styles.dropArea}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: "none" }}
        />
        <div className={styles.dropText}>
          {file ? (
            <span className={styles.fileName}>{file.name}</span>
          ) : (
            <>
              <span>Drag & drop PDF here</span>
              <span className={styles.or}>or</span>
              <button type="button" className={styles.browseButton}>
                Browse
              </button>
            </>
          )}
        </div>
      </div>
      <button className={styles.button} onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {uploadResult && (
        <>
          <div className={styles.previewBox}>
            <h3>Extracted Text Preview</h3>
            <div className={styles.textPreview}>{uploadResult.text}</div>
          </div>
          <button className={styles.button} onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>
        </>
      )}
      {analysis && (
        <div className={styles.analysisCard}>
          <div className={styles.analysisType}>Document type: <span style={{ color: "#22c55e", fontWeight: 600 }}>{analysis.document_type.charAt(0).toUpperCase() + analysis.document_type.slice(1)}</span></div>
          <div>
            <strong>Missing Fields:</strong>
            <ul className={styles.list}>
              {analysis.missing_fields.map((field: string) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
          {analysis.recommendations && (
            <div className={styles.recommendations}><strong>Recommendations:</strong> {analysis.recommendations}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
