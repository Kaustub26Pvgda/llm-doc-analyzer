export const API_BASE = "http://localhost:8000";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function analyzeDocument(document_id: number) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_id }),
  });
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  return res.json();
}

export async function fetchDocument(id: number) {
  const res = await fetch(`${API_BASE}/documents/${id}`);
  return res.json();
}

export async function fetchAnalysis(document_id: number) {
  const res = await fetch(`${API_BASE}/analysis`);
  const data = await res.json();
  return data.find((a: any) => a.document_id === document_id) || null;
}
