import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./DocumentDetail.module.css";
import { fetchDocument, fetchAnalysis } from "../../services/api";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const docData = await fetchDocument(Number(id));
        setDocument(docData);
        const analysisData = await fetchAnalysis(Number(id));
        setAnalysis(analysisData);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className={styles.detailCard}>Loading...</div>;
  if (error) return <div className={styles.detailCard}>{error}</div>;
  if (!document) return <div className={styles.detailCard}>Document not found.</div>;

  return (
    <div className={styles.detailCard}>
      <Link to="/history" className={styles.backLink}>&larr; Back to History</Link>
      <h2 className={styles.title}>{document.filename}</h2>
      <div className={styles.meta}><strong>Uploaded:</strong> {new Date(document.created_at).toLocaleString()}</div>
      <div className={styles.meta}><strong>Document ID:</strong> {document.id}</div>
      <div className={styles.section}><strong>Extracted Text:</strong>
        <div className={styles.textPreview}>{document.content}</div>
      </div>
      {analysis ? (
        <div className={styles.section}>
          <div className={styles.analysisType}>
            Document type:
            <span style={{ color: "#22c55e", fontWeight: 600, marginLeft: 6 }}>
              {analysis.document_type.charAt(0).toUpperCase() + analysis.document_type.slice(1)}
            </span>
          </div>
          <div><strong>Missing Fields:</strong>
            {analysis.missing_fields.length === 0 ? (
              <div style={{ color: "#22c55e", marginTop: "0.5rem" }}>All required fields are present.</div>
            ) : (
              <ul className={styles.list}>
                {analysis.missing_fields.map((field: string) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            )}
          </div>
          {analysis.recommendations && (
            <div className={styles.recommendations}><strong>Recommendations:</strong> {analysis.recommendations}</div>
          )}
        </div>
      ) : (
        <div className={styles.section}>No analysis result found for this document.</div>
      )}
    </div>
  );
};

export default DocumentDetail;
