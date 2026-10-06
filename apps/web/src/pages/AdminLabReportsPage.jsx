import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Upload,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const emptyForm = {
  title: "",
  lab: "",
  status: "Certified Pure",
  date: "",
  order: 0,
  isActive: true,
};

const AdminLabReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/lab-reports`, {
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load lab reports.");
      }

      setReports(data.reports || []);
    } catch (error) {
      console.error("FETCH ADMIN LAB REPORTS ERROR:", error);
      toast.error(error.message || "Failed to load lab reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setPdfFile(null);
    setEditingReport(null);
    setShowForm(false);
  };

  const startAdd = () => {
    setEditingReport(null);
    setForm(emptyForm);
    setPdfFile(null);
    setShowForm(true);
  };

  const startEdit = (report) => {
    setEditingReport(report);
    setForm({
      title: report.title || "",
      lab: report.lab || "",
      status: report.status || "Certified Pure",
      date: report.date || "",
      order: report.order || 0,
      isActive: report.isActive !== false,
    });
    setPdfFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await fetch(`${API}/upload/lab-report`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "PDF upload failed.");
    }

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a report title.");
      return;
    }

    if (!editingReport && !pdfFile) {
      toast.error("Please select a PDF report.");
      return;
    }

    if (pdfFile && pdfFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    try {
      setSaving(true);

      let pdfUrl = editingReport?.pdfUrl || "";
      let publicId = editingReport?.publicId || "";
      let storageType = editingReport?.storageType || "local";

      if (pdfFile) {
        setUploading(true);
        const uploaded = await uploadPdf(pdfFile);
        pdfUrl = uploaded.pdfUrl;
        publicId = uploaded.publicId;
        storageType = "cloudinary";
        setUploading(false);
      }

      const payload = {
        ...form,
        title: form.title.trim(),
        lab: form.lab.trim(),
        status: form.status.trim(),
        pdfUrl,
        publicId,
        storageType,
        order: Number(form.order) || 0,
      };

      const response = await fetch(
        editingReport
          ? `${API}/lab-reports/${editingReport._id}`
          : `${API}/lab-reports`,
        {
          method: editingReport ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save report.");
      }

      toast.success(
        editingReport
          ? "Lab report updated successfully."
          : "Lab report uploaded successfully."
      );

      resetForm();
      await fetchReports();
    } catch (error) {
      console.error("SAVE LAB REPORT ERROR:", error);
      setUploading(false);
      toast.error(error.message || "Failed to save lab report.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (report) => {
    if (!window.confirm(`Delete "${report.title}"?`)) return;

    try {
      const response = await fetch(`${API}/lab-reports/${report._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete report.");
      }

      toast.success("Lab report deleted.");
      await fetchReports();
    } catch (error) {
      console.error("DELETE LAB REPORT ERROR:", error);
      toast.error(error.message || "Failed to delete report.");
    }
  };

  const handleToggle = async (report) => {
    try {
      const response = await fetch(
        `${API}/lab-reports/${report._id}/toggle`,
        {
          method: "PATCH",
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update report.");
      }

      toast.success(data.message);
      await fetchReports();
    } catch (error) {
      console.error("TOGGLE LAB REPORT ERROR:", error);
      toast.error(error.message || "Failed to update report.");
    }
  };

  return (
    <div className="min-h-full bg-[#f7f8f5] p-5 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#173c2b]">
              Lab Reports Management
            </h1>
            <p className="text-gray-500 mt-1">
              Upload, edit, hide, replace and delete product lab reports.
            </p>
          </div>

          <button
            onClick={startAdd}
            className="inline-flex items-center justify-center gap-2 bg-[#173c2b] text-white px-5 py-3 rounded-xl hover:bg-[#0f2c20] transition"
          >
            <Plus size={19} />
            Add New Report
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingReport ? "Edit Lab Report" : "Upload New Lab Report"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  PDF files are securely uploaded and stored separately from the website code.
                </p>
              </div>

              <button onClick={resetForm} className="text-gray-500 hover:text-black">
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Report Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Wood Pressed Mustard Oil"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Laboratory</label>
                <input
                  value={form.lab}
                  onChange={(e) => setForm({ ...form, lab: e.target.value })}
                  placeholder="FARELABS"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <input
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  placeholder="Certified Pure"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Test Date</label>
                <input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="e.g. September 2026"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  {editingReport ? "Replace PDF (optional)" : "PDF File *"}
                </label>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-green-700 hover:bg-green-50/30 transition">
                  <Upload className="text-green-700 mb-2" size={28} />
                  <span className="font-medium">
                    {pdfFile ? pdfFile.name : "Choose PDF report"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF only • maximum 10 MB
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </label>

                {editingReport && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current file:{" "}
                    <a
                      href={editingReport.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-700 underline"
                    >
                      Open current PDF
                    </a>
                  </p>
                )}
              </div>

              <label className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm">Show this report on the website</span>
              </label>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173c2b] text-white disabled:opacity-60"
                >
                  {saving && <Loader2 size={17} className="animate-spin" />}
                  {uploading ? "Uploading PDF..." : editingReport ? "Save Changes" : "Upload Report"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-green-700" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <FileText className="text-green-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {report.lab || "Certified Laboratory"}
                          {report.date ? ` • ${report.date}` : ""}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          report.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {report.isActive ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {report.status}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <a
                        href={report.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                      >
                        <ExternalLink size={15} />
                        View PDF
                      </a>

                      <button
                        onClick={() => startEdit(report)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggle(report)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                      >
                        {report.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                        {report.isActive ? "Hide" : "Show"}
                      </button>

                      <button
                        onClick={() => handleDelete(report)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="lg:col-span-2 text-center py-16 bg-white border rounded-2xl text-gray-500">
                No lab reports found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLabReportsPage;
