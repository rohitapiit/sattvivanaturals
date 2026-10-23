import LabReport from "../models/LabReport.js";
import cloudinary from "../config/cloudinary.js";

const LEGACY_REPORTS = [
  {
    title: "Wood Pressed Mustard Oil",
    lab: "FARELABS",
    status: "Certified Pure",
    pdfUrl: "/pds/mustardoil.pdf",
    storageType: "local",
    order: 0,
  },
  {
    title: "Wood Pressed Groundnut Oil",
    lab: "FARELABS",
    status: "Certified Pure",
    pdfUrl: "/pds/groundnut.pdf",
    storageType: "local",
    order: 1,
  },
];

const ensureLegacyReports = async () => {
  const count = await LabReport.countDocuments();
  if (count > 0) return;

  await LabReport.insertMany(LEGACY_REPORTS);
};

export const getActiveReports = async (req, res) => {
  try {
    await ensureLegacyReports();

    const reports = await LabReport.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });

    res.json({ success: true, reports });
  } catch (error) {
    console.error("GET ACTIVE LAB REPORTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lab reports.",
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    await ensureLegacyReports();

    const reports = await LabReport.find().sort({
      order: 1,
      createdAt: 1,
    });

    res.json({ success: true, reports });
  } catch (error) {
    console.error("GET ALL LAB REPORTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lab reports.",
    });
  }
};

export const createReport = async (req, res) => {
  try {
    const { title, lab, status, date, pdfUrl, publicId, storageType, order, isActive } =
      req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report title is required.",
      });
    }

    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        message: "PDF URL is required.",
      });
    }

    const report = await LabReport.create({
      title: title.trim(),
      lab: lab?.trim() || "Certified Laboratory",
      status: status?.trim() || "Certified Pure",
      date: date?.trim() || "",
      pdfUrl,
      publicId: publicId || "",
      storageType: storageType || "cloudinary",
      order: Number(order) || 0,
      isActive: isActive !== false,
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error("CREATE LAB REPORT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create lab report.",
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found.",
      });
    }

    const { title, lab, status, date, pdfUrl, publicId, storageType, order, isActive } =
      req.body;

    const previousPublicId = report.publicId;
    const previousStorageType = report.storageType;

    if (title !== undefined) report.title = title.trim();
    if (lab !== undefined) report.lab = lab.trim();
    if (status !== undefined) report.status = status.trim();
    if (date !== undefined) report.date = date.trim();
    if (pdfUrl !== undefined) report.pdfUrl = pdfUrl;
    if (publicId !== undefined) report.publicId = publicId;
    if (storageType !== undefined) report.storageType = storageType;
    if (order !== undefined) report.order = Number(order) || 0;
    if (isActive !== undefined) report.isActive = Boolean(isActive);

    await report.save();

    if (
      previousStorageType === "cloudinary" &&
      previousPublicId &&
      publicId &&
      previousPublicId !== publicId
    ) {
      try {
        await cloudinary.uploader.destroy(previousPublicId, {
          resource_type: "raw",
          type: "upload",
        });
      } catch (cloudinaryError) {
        console.warn(
          "OLD LAB REPORT CLOUDINARY DELETE WARNING:",
          cloudinaryError.message
        );
      }
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error("UPDATE LAB REPORT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lab report.",
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found.",
      });
    }

    // Legacy PDFs live inside the website's public/pds folder.
    // Keep their DB record so they do not get re-seeded, but hide them
    // from the public site when an admin deletes one.
    if (report.storageType === "local") {
      report.isActive = false;
      await report.save();

      return res.json({
        success: true,
        message: "Lab report removed from the website.",
      });
    }

    if (report.storageType === "cloudinary" && report.publicId) {
      try {
        await cloudinary.uploader.destroy(report.publicId, {
          resource_type: "raw",
          type: "upload",
        });
      } catch (cloudinaryError) {
        console.warn(
          "LAB REPORT CLOUDINARY DELETE WARNING:",
          cloudinaryError.message
        );
      }
    }

    await report.deleteOne();

    res.json({ success: true, message: "Lab report deleted successfully." });
  } catch (error) {
    console.error("DELETE LAB REPORT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lab report.",
    });
  }
};

export const toggleReportStatus = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found.",
      });
    }

    report.isActive = !report.isActive;
    await report.save();

    res.json({
      success: true,
      message: report.isActive
        ? "Lab report activated."
        : "Lab report hidden.",
      report,
    });
  } catch (error) {
    console.error("TOGGLE LAB REPORT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lab report status.",
    });
  }
};
