import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    lab: { type: String, default: "Certified Laboratory", trim: true },
    status: { type: String, default: "Certified Pure", trim: true },
    date: { type: String, default: "", trim: true },
    pdfUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    storageType: {
      type: String,
      enum: ["local", "cloudinary"],
      default: "cloudinary",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LabReport = mongoose.model("LabReport", labReportSchema);

export default LabReport;
