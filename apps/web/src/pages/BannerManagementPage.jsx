import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import {
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Plus,
  X,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const BannerManagementPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingBanner, setEditingBanner] =
    useState(null);

  const [desktopFile, setDesktopFile] =
    useState(null);

  const [mobileFile, setMobileFile] =
    useState(null);

  const [desktopPreview, setDesktopPreview] =
    useState("");

  const [mobilePreview, setMobilePreview] =
    useState("");

  const [order, setOrder] = useState(0);

  const [saving, setSaving] = useState(false);

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // FETCH ALL BANNERS
  // ==========================================

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/banners`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch banners."
        );
      }

      setBanners(data.banners || []);

    } catch (error) {
      console.error(
        "FETCH BANNERS ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to fetch banners."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchBanners();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setDesktopFile(null);
    setMobileFile(null);

    setDesktopPreview("");
    setMobilePreview("");

    setOrder(0);

    setEditingBanner(null);

    setShowForm(false);
  };

  // ==========================================
  // DESKTOP FILE CHANGE
  // ==========================================

  const handleDesktopChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setDesktopFile(file);

    setDesktopPreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================
  // MOBILE FILE CHANGE
  // ==========================================

  const handleMobileChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setMobileFile(file);

    setMobilePreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================
  // UPLOAD BANNER IMAGE
  // ==========================================

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error(
        "Image file is required."
      );
    }

    const formData = new FormData();

    formData.append(
      "image",
      file
    );

    const response = await fetch(
      `${API}/upload/banner`,
      {
        method: "POST",

        headers: {
          ...getAuthHeaders(),
        },

        body: formData,
      }
    );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
          "Banner image upload failed."
      );
    }

    return data.imageUrl;
  };

  // ==========================================
  // CREATE / UPDATE BANNER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let desktopImage =
        editingBanner?.desktopImage || "";

      let mobileImage =
        editingBanner?.mobileImage || "";

      // ======================================
      // UPLOAD DESKTOP IMAGE
      // ======================================

      if (desktopFile) {
        desktopImage =
          await uploadImage(
            desktopFile
          );
      }

      // ======================================
      // UPLOAD MOBILE IMAGE
      // ======================================

      if (mobileFile) {
        mobileImage =
          await uploadImage(
            mobileFile
          );
      }

      // ======================================
      // VALIDATION
      // ======================================

      if (!desktopImage) {
        toast.error(
          "Please select a desktop banner."
        );

        return;
      }

      if (!mobileImage) {
        toast.error(
          "Please select a mobile banner."
        );

        return;
      }

      // ======================================
      // CREATE BANNER
      // ======================================

      if (!editingBanner) {
        const response = await fetch(
          `${API}/banners`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...getAuthHeaders(),
            },

            body: JSON.stringify({
              desktopImage,
              mobileImage,

              order:
                Number(order),

              isActive: true,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to create banner."
          );
        }

        toast.success(
          "Banner added successfully."
        );
      }

      // ======================================
      // UPDATE BANNER
      // ======================================

      else {
        const response = await fetch(
          `${API}/banners/${editingBanner._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              ...getAuthHeaders(),
            },

            body: JSON.stringify({
              desktopImage,
              mobileImage,

              order:
                Number(order),
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to update banner."
          );
        }

        toast.success(
          "Banner updated successfully."
        );
      }

      resetForm();

      await fetchBanners();

    } catch (error) {
      console.error(
        "SAVE BANNER ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT BANNER
  // ==========================================

  const handleEdit = (banner) => {
    setEditingBanner(banner);

    setDesktopPreview(
      banner.desktopImage
    );

    setMobilePreview(
      banner.mobileImage
    );

    setOrder(
      banner.order || 0
    );

    setDesktopFile(null);

    setMobileFile(null);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE BANNER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this banner?"
      );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/banners/${id}`,
        {
          method: "DELETE",

          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete banner."
        );
      }

      toast.success(
        "Banner deleted successfully."
      );

      await fetchBanners();

    } catch (error) {
      console.error(
        "DELETE BANNER ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to delete banner."
      );
    }
  };

  // ==========================================
  // TOGGLE BANNER STATUS
  // ==========================================

  const handleToggle = async (id) => {
    try {
      const response = await fetch(
        `${API}/banners/${id}/toggle`,
        {
          method: "PATCH",

          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update banner."
        );
      }

      toast.success(
        data.message
      );

      await fetchBanners();

    } catch (error) {
      console.error(
        "TOGGLE BANNER ERROR:",
        error
      );

      toast.error(
        error.message ||
          "Failed to update banner."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading banners...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Banner Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage homepage desktop and mobile banners.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
        >
          <Plus size={20} />

          Add New Banner
        </button>

      </div>

      {/* ADD / EDIT FORM */}

      {showForm && (
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-semibold">
              {editingBanner
                ? "Edit Banner"
                : "Add New Banner"}
            </h2>

            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-black"
            >
              <X />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* DESKTOP BANNER */}

            <div>
              <label className="block font-medium mb-2">
                Desktop Banner
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleDesktopChange
                }
                className="block w-full border rounded-lg p-2"
              />

              {desktopPreview && (
                <img
                  src={desktopPreview}
                  alt="Desktop Preview"
                  className="mt-4 w-full max-h-80 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* MOBILE BANNER */}

            <div>
              <label className="block font-medium mb-2">
                Mobile Banner
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleMobileChange
                }
                className="block w-full border rounded-lg p-2"
              />

              {mobilePreview && (
                <img
                  src={mobilePreview}
                  alt="Mobile Preview"
                  className="mt-4 max-h-80 max-w-sm object-contain rounded-lg border"
                />
              )}
            </div>

            {/* DISPLAY ORDER */}

            <div>
              <label className="block font-medium mb-2">
                Display Order
              </label>

              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) =>
                  setOrder(
                    e.target.value
                  )
                }
                className="w-full sm:w-40 border rounded-lg px-3 py-2"
              />
            </div>

            {/* FORM BUTTONS */}

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={saving}
                className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingBanner
                  ? "Update Banner"
                  : "Save Banner"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* EMPTY STATE */}

      {banners.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">

          <p className="text-gray-500 mb-4">
            No banners added yet.
          </p>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Add First Banner
          </button>

        </div>
      ) : (

        /* BANNER LIST */

        <div className="space-y-6">

          {banners.map(
            (banner, index) => (

              <div
                key={banner._id}
                className="bg-white border rounded-xl shadow-sm p-5"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                  <div>
                    <h3 className="font-semibold text-lg">
                      Banner {index + 1}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Display Order:{" "}
                      {banner.order}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {/* BANNER IMAGES */}

                <div className="grid md:grid-cols-2 gap-5">

                  <div>
                    <p className="font-medium mb-2">
                      Desktop
                    </p>

                    <img
                      src={
                        banner.desktopImage
                      }
                      alt="Desktop Banner"
                      className="w-full h-52 object-cover rounded-lg border"
                    />
                  </div>

                  <div>
                    <p className="font-medium mb-2">
                      Mobile
                    </p>

                    <img
                      src={
                        banner.mobileImage
                      }
                      alt="Mobile Banner"
                      className="w-full h-52 object-contain rounded-lg border bg-gray-50"
                    />
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3 mt-5">

                  <button
                    onClick={() =>
                      handleEdit(
                        banner
                      )
                    }
                    className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <Edit size={17} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleToggle(
                        banner._id
                      )
                    }
                    className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff size={17} />
                        Disable
                      </>
                    ) : (
                      <>
                        <Eye size={17} />
                        Enable
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        banner._id
                      )
                    }
                    className="flex items-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default BannerManagementPage;