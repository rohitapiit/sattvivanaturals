import Banner from "../models/Banner.js";

// ==========================================
// GET ALL BANNERS
// ==========================================

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("GET BANNERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch banners.",
    });
  }
};


// ==========================================
// GET ACTIVE BANNERS
// ==========================================

export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error(
      "GET ACTIVE BANNERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch active banners.",
    });
  }
};


// ==========================================
// CREATE BANNER
// ==========================================

export const createBanner = async (req, res) => {
  try {
    const {
      desktopImage,
      mobileImage,
      order = 0,
      isActive = true,
    } = req.body;

    // Validate desktop image
    if (!desktopImage) {
      return res.status(400).json({
        success: false,
        message: "Desktop banner image is required.",
      });
    }

    // Validate mobile image
    if (!mobileImage) {
      return res.status(400).json({
        success: false,
        message: "Mobile banner image is required.",
      });
    }

    const banner = await Banner.create({
      desktopImage,
      mobileImage,
      order: Number(order),
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully.",
      banner,
    });
  } catch (error) {
    console.error("CREATE BANNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create banner.",
    });
  }
};


// ==========================================
// UPDATE BANNER
// ==========================================

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      desktopImage,
      mobileImage,
      order,
      isActive,
    } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    if (desktopImage !== undefined) {
      banner.desktopImage = desktopImage;
    }

    if (mobileImage !== undefined) {
      banner.mobileImage = mobileImage;
    }

    if (order !== undefined) {
      banner.order = Number(order);
    }

    if (isActive !== undefined) {
      banner.isActive = isActive;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully.",
      banner,
    });
  } catch (error) {
    console.error("UPDATE BANNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update banner.",
    });
  }
};


// ==========================================
// DELETE BANNER
// ==========================================

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE BANNER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete banner.",
    });
  }
};


// ==========================================
// TOGGLE BANNER STATUS
// ==========================================

export const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    banner.isActive = !banner.isActive;

    await banner.save();

    res.status(200).json({
      success: true,
      message: banner.isActive
        ? "Banner activated successfully."
        : "Banner deactivated successfully.",
      banner,
    });
  } catch (error) {
    console.error(
      "TOGGLE BANNER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update banner status.",
    });
  }
};