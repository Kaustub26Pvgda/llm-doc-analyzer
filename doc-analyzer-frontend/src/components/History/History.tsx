import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./History.module.css";
import { fetchDocuments } from "../../services/api";

const History: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(documents.length / pageSize);
  const filteredDocs = documents.filter(doc =>
    doc.filename.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);
  const filteredTotalPages = Math.ceil(filteredDocs.length / pageSize);

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      setError(null);
      try {
  const data = await fetchDocuments();
  // Sort by most recent first
  const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  setDocuments(sorted);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className={styles.tableWrapper}>
      <h2 className={styles.title}>Document History</h2>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search by document name..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ marginBottom: "1.5rem", width: "100%", maxWidth: 400, padding: "0.5rem 1rem", fontSize: "1rem", borderRadius: 6, border: "1px solid #cbd5e1" }}
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Created At</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocs.map((doc, idx) => (
              <tr key={doc.id} className={idx % 2 === 0 ? styles.even : styles.odd}>
                <td>
                  <Link to={`/documents/${doc.id}`} className={styles.link}>
                    {doc.filename}
                  </Link>
                </td>
                <td>{new Date(doc.created_at).toLocaleString(undefined, { hour12: false })}</td>
                <td className={styles.previewCell}>{doc.content.slice(0, 80)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {filteredTotalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {filteredTotalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={() => setPage(page + 1)}
            disabled={page === filteredTotalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default History;
