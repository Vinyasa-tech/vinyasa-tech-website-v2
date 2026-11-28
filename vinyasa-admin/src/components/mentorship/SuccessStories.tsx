
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ChangeEvent, FormEvent } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Award,
  Check,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Users,
  CalendarDays,
} from "lucide-react";
import { motion } from "motion/react";

import {
  createSuccessStory,
  deleteSuccessStory,
  getSuccessStories,
  updateSuccessStory,
} from "../../services/successStoryApi";

import type { ApiSuccessStory } from "../../services/successStoryApi";
import { API_ORIGIN } from "../../config/constants";

interface StoryForm {
  name: string;
  program: string;
  year: string;
  role: string;
  title: string;
  company: string;
  story: string;
  status: "published" | "draft";
}

const emptyForm: StoryForm = {
  name: "",
  program: "",
  year: "",
  role: "",
  title: "",
  company: "",
  story: "",
  status: "draft",
};

const programOptions = [
  "AI & Machine Learning",
  "Software & Mobile Engineering",
  "Web & Digital Solutions",
  "Cloud & Infrastructure",
  "Data Management",
  "Graphic Designing",
  "Digital Marketing",
  "Data & Analysis",
];

const currentYear = new Date().getFullYear();

const yearOptions = Array.from(
  { length: 12 },
  (_, index) => String(currentYear - index)
);

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const getImageSrc = (
  imagePath: string | null | undefined
) => {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  return `${API_ORIGIN}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

const getRows = (response: any): ApiSuccessStory[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.message ||
      response?.data?.error ||
      "The server could not complete the request."
    );
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong.";
};

// Convert the selected image into a cropped JPEG blob.
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error("Unable to load the selected image."));

    image.src = imageSrc;
  });

  const maxDimension = 1200;

  const scale = Math.min(
    1,
    maxDimension / Math.max(pixelCrop.width, pixelCrop.height)
  );

  const outputWidth = Math.max(
    1,
    Math.round(pixelCrop.width * scale)
  );

  const outputHeight = Math.max(
    1,
    Math.round(pixelCrop.height * scale)
  );

  const canvas = document.createElement("canvas");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  for (const quality of [0.92, 0.85, 0.78, 0.7, 0.62, 0.55]) {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });

    if (blob && blob.size <= MAX_IMAGE_SIZE_BYTES) {
      return blob;
    }
  }

  throw new Error(
    "The cropped image is still larger than 2 MB. Please choose another image."
  );
};

const SuccessStories = () => {
  const [stories, setStories] = useState<ApiSuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"all" | "published" | "draft">("all");

  const [showForm, setShowForm] = useState(false);

  const [editingStory, setEditingStory] =
    useState<ApiSuccessStory | null>(null);

  const [formData, setFormData] = useState<StoryForm>({
    ...emptyForm,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [removeExistingImage, setRemoveExistingImage] =
    useState(false);

  const [showCropper, setShowCropper] = useState(false);
  const [pendingImageFile, setPendingImageFile] =
    useState<File | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Close action menu when scrolling or resizing.
  useEffect(() => {
    if (openMenu === null) return;

    const closeOnViewportChange = () => {
      setOpenMenu(null);
      setMenuPosition(null);
    };

    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);

    return () => {
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [openMenu]);

  // LOAD STORIES
  const loadStories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuccessStories();

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to load success stories."
        );
      }

      setStories(getRows(response));
    } catch (err) {
      console.error("Loading success stories failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStories();
  }, []);

  // SEARCH AND FILTER
  const filteredStories = useMemo(() => {
    const query = search.toLowerCase().trim();

    return stories.filter((story) => {
      const matchesSearch =
        !query ||
        (story.name || "").toLowerCase().includes(query) ||
        (story.program || "").toLowerCase().includes(query) ||
        String(story.year || "").toLowerCase().includes(query) ||
        (story.role || "").toLowerCase().includes(query) ||
        (story.title || "").toLowerCase().includes(query) ||
        (story.company || "").toLowerCase().includes(query) ||
        (story.story || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || story.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stories, search, statusFilter]);

  const publishedCount = stories.filter(
    (story) => story.status === "published"
  ).length;

  const draftCount = stories.length - publishedCount;

  // RESET IMAGE
  const resetImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setRemoveExistingImage(false);
    setPendingImageFile(null);
    setShowCropper(false);

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  // OPEN ADD FORM
  const openAddForm = () => {
    resetImage();

    setEditingStory(null);
    setFormData({ ...emptyForm });

    setError("");
    setSuccessMessage("");
    setShowForm(true);

    setOpenMenu(null);
    setMenuPosition(null);
  };

  // OPEN EDIT FORM
  const openEditForm = (story: ApiSuccessStory) => {
    resetImage();

    setEditingStory(story);

    setFormData({
      name: story.name || "",
      program: story.program || "",
      year: story.year ? String(story.year) : "",
      role: story.role || "",
      title: story.title || "",
      company: story.company || "",
      story: story.story || "",
      status: story.status === "published" ? "published" : "draft",
    });

    setImageFile(null);
    setPendingImageFile(null);
    setRemoveExistingImage(false);
    setImagePreview(getImageSrc(story.image_url));

    setError("");
    setSuccessMessage("");
    setShowForm(true);

    setOpenMenu(null);
    setMenuPosition(null);
  };

  // CLOSE FORM
  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingStory(null);
    setFormData({ ...emptyForm });

    resetImage();
    setError("");
  };

  // IMAGE SELECTION
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, JPEG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image size must not exceed 2 MB.");
      event.target.value = "";
      return;
    }

    // Release the previous temporary image URL.
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setError("");
    setImageFile(null);
    setPendingImageFile(file);
    setImagePreview(previewUrl);
    setRemoveExistingImage(false);

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    setShowCropper(true);

    // Allows selecting the same image again.
    event.target.value = "";
  };

  // CROP COMPLETE
  const onCropComplete = (_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  };

  // APPLY CROPPED IMAGE
  const applyCrop = async () => {
    if (!imagePreview || !croppedAreaPixels || !pendingImageFile) {
      return;
    }

    try {
      setError("");

      const croppedBlob = await createCroppedImage(
        imagePreview,
        croppedAreaPixels
      );

      const croppedFile = new File(
        [croppedBlob],
        "alumni-profile.jpg",
        {
          type: "image/jpeg",
        }
      );

      const oldPreview = imagePreview;
      const newPreview = URL.createObjectURL(croppedBlob);

      setImageFile(croppedFile);
      setImagePreview(newPreview);

      setPendingImageFile(null);
      setShowCropper(false);

      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      if (oldPreview.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }
    } catch (cropError) {
      console.error("Cropping alumni image failed:", cropError);

      setError(
        cropError instanceof Error
          ? cropError.message
          : "Unable to crop image. Please try again."
      );
    }
  };

  // CANCEL CROPPING
  const cancelCrop = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setPendingImageFile(null);
    setImageFile(null);

    setImagePreview(
      editingStory?.image_url
        ? getImageSrc(editingStory.image_url)
        : ""
    );

    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setShowCropper(false);
  };

  // REMOVE IMAGE
  const removeSelectedImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Remove the newly selected image and restore the saved image.
    if (imageFile || pendingImageFile) {
      setImageFile(null);
      setPendingImageFile(null);
      setShowCropper(false);

      if (editingStory?.image_url && !removeExistingImage) {
        setImagePreview(getImageSrc(editingStory.image_url));
      } else {
        setImagePreview("");
      }

      return;
    }

    // Remove the existing saved image.
    setImagePreview("");
    setRemoveExistingImage(Boolean(editingStory?.image_url));
  };

  // SUBMIT FORM
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !formData.name.trim() ||
      !formData.program.trim() ||
      !formData.year.trim() ||
      !formData.role.trim() ||
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.story.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Do not submit while an image is still waiting to be cropped.
    if (pendingImageFile) {
      setError("Please apply or cancel the selected image before saving.");
      return;
    }

    const payload = new FormData();

    payload.append("name", formData.name.trim());
    payload.append("program", formData.program.trim());
    payload.append("year", formData.year.trim());
    payload.append("role", formData.role.trim());
    payload.append("title", formData.title.trim());
    payload.append("company", formData.company.trim());
    payload.append("story", formData.story.trim());
    payload.append("status", formData.status);

    if (imageFile) {
      payload.append("image", imageFile);
    } else if (editingStory && removeExistingImage) {
      payload.append("removeImage", "true");
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingStory);

      const response = isEditing
        ? await updateSuccessStory(editingStory!.id, payload)
        : await createSuccessStory(payload);

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to save the story."
        );
      }

      await loadStories();

      setShowForm(false);
      setEditingStory(null);
      setFormData({ ...emptyForm });

      resetImage();

      setSuccessMessage(
        isEditing
          ? "Success story updated successfully."
          : "Success story added successfully."
      );
    } catch (err) {
      console.error("Saving success story failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // PUBLISH / UNPUBLISH
  const togglePublished = async (story: ApiSuccessStory) => {
    try {
      setError("");
      setSuccessMessage("");

      const response = await updateSuccessStory(story.id, {
        status:
          story.status === "published"
            ? "draft"
            : "published",
      });

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to update story status."
        );
      }

      await loadStories();

      setOpenMenu(null);
      setMenuPosition(null);

      setSuccessMessage(
        story.status === "published"
          ? "Story moved to drafts."
          : "Story published successfully."
      );
    } catch (err) {
      console.error("Updating story status failed:", err);
      setError(getErrorMessage(err));
    }
  };

  // DELETE STORY
  const deleteStory = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this success story?"
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await deleteSuccessStory(id);

      if (response?.success === false) {
        throw new Error(
          response.message || "Unable to delete success story."
        );
      }

      await loadStories();

      setOpenMenu(null);
      setMenuPosition(null);

      setSuccessMessage("Success story deleted successfully.");
    } catch (err) {
      console.error("Deleting success story failed:", err);
      setError(getErrorMessage(err));
    }
  };

  // INPUT STYLE
  const inputClass =
    "mt-1.5 h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs text-[#0B2545] outline-none transition placeholder:text-[#A0A4AD] focus:border-[#3F3A8F] focus:ring-2 focus:ring-[#3F3A8F]/10";

  return (
    <div
      className="w-full min-w-0 p-3 sm:p-5 lg:p-6"
      onClick={() => {
        setOpenMenu(null);
        setMenuPosition(null);
      }}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7779C6] sm:text-[9px]">
            Mentorship Management
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#0B2545]">
            Success Stories
          </h1>

          <p className="mt-1 text-xs text-[#667085] sm:text-xs">
            Manage alumni profiles, career journeys and testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void loadStories();
            }}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#475467] transition hover:border-[#3F3A8F] hover:bg-[#F8F7FC] disabled:opacity-50 sm:text-[10px]"
          >
            <RefreshCw
              size={13}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openAddForm();
            }}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#3F3A8F] px-3.5 text-xs font-medium text-white transition hover:bg-[#0B2545] sm:text-[10px]"
          >
            <Plus size={14} />
            Add Story
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 sm:text-[10px]"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs text-green-700 sm:text-[10px]">
          <span className="flex items-center gap-2">
            <Check size={13} />
            {successMessage}
          </span>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3">
        {[
          {
            label: "Total Stories",
            value: stories.length,
            icon: Users,
            color: "text-[#3F3A8F]",
            bg: "bg-[#F0EFFA]",
          },
          {
            label: "Published",
            value: publishedCount,
            icon: Check,
            color: "text-[#20834C]",
            bg: "bg-[#EAF7EF]",
          },
          {
            label: "Drafts",
            value: draftCount,
            icon: Award,
            color: "text-[#A96800]",
            bg: "bg-[#FFF5E6]",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex min-w-0 flex-row items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white p-2 text-left transition hover:border-[#D0CEE8] sm:gap-3 sm:p-3.5"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${item.bg} ${item.color}`}
              >
                <Icon size={17} className="sm:h-[18px] sm:w-[18px]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold leading-tight text-[#85899A] sm:text-[9px] sm:font-medium sm:uppercase sm:tracking-wide">
                  {item.label}
                </p>

                <p className="mt-1 text-xl font-semibold leading-none text-[#0B2545] sm:text-xl">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SEARCH AND FILTER */}
      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            placeholder="Search alumni, program, year or company..."
            className="h-10 w-full rounded-lg border border-[#E5E7EB] pl-9 pr-3 text-xs outline-none transition focus:border-[#3F3A8F] sm:h-9 sm:text-[11px]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["all", "All Stories"],
              ["published", "Published"],
              ["draft", "Drafts"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setStatusFilter(value);
              }}
              className={`rounded-lg px-3 py-2 text-[11px] font-medium transition sm:text-[9px] ${
                statusFilter === value
                  ? "bg-[#3F3A8F] text-white"
                  : "bg-[#F5F3FB] text-[#667085] hover:bg-[#EEEDF8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ALUMNI RECORDS */}
      <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-[#0B2545] sm:text-xs">
              Alumni Records
            </h2>

            <p className="mt-0.5 text-[10px] text-[#98A2B3] sm:text-[9px]">
              {filteredStories.length} records found
            </p>
          </div>

          <span className="rounded-md bg-[#F5F3FB] px-2 py-1 text-[10px] font-medium text-[#3F3A8F] sm:text-[9px]">
            {statusFilter === "all" ? "All statuses" : statusFilter}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-14 text-sm text-[#667085] sm:text-xs">
            <RefreshCw
              size={14}
              className="animate-spin text-[#3F3A8F]"
            />
            Loading alumni records...
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead>
                <tr className="bg-[#F8F8FC]">
                  {[
                    "Alumni",
                    "Program",
                    "Year",
                    "Internship Role",
                    "Current Career",
                    "Testimonial",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-4 py-3 text-[9px] font-semibold uppercase tracking-wide text-[#85899A] ${
                        heading === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0F0F5]">
                {filteredStories.map((story) => (
                  <tr
                    key={story.id}
                    className="transition hover:bg-[#FAFAFD]"
                  >
                    {/* ALUMNI */}
                    <td className="px-4 py-3">
                      <div className="flex min-w-[150px] items-center gap-2.5">
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-[#302A78] text-xs font-semibold text-white">
                          <span aria-hidden="true">
                            {story.name?.charAt(0).toUpperCase() || "A"}
                          </span>

                          {story.image_url && (
                            <img
                              src={getImageSrc(story.image_url)}
                              alt={`${story.name} profile`}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                              className="absolute inset-0 h-full w-full rounded-full object-cover"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-[#0B2545]">
                            {story.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PROGRAM */}
                    <td className="px-4 py-3">
                      <span
                        title={story.program || "Not specified"}
                        className="inline-block max-w-[160px] truncate rounded-full bg-[#F0EFFA] px-2.5 py-1 text-[9px] font-medium text-[#3F3A8F]"
                      >
                        {story.program || "Not specified"}
                      </span>
                    </td>

                    {/* YEAR */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F5F3FB] px-2 py-1 text-[10px] font-semibold text-[#3F3A8F]">
                        <CalendarDays size={11} />
                        {story.year || "—"}
                      </span>
                    </td>

                    {/* INTERNSHIP ROLE */}
                    <td className="px-4 py-3">
                      <span className="inline-block max-w-[160px] truncate rounded-full bg-[#EEF0FA] px-2.5 py-1 text-[9px] font-medium text-[#3F3A8F]">
                        {story.role || "Not specified"}
                      </span>
                    </td>

                    {/* CURRENT CAREER */}
                    <td className="px-4 py-3">
                      <div className="min-w-[145px]">
                        <p className="text-[10px] font-semibold text-[#0B2545]">
                          {story.title || "Not specified"}
                        </p>

                        <p className="mt-0.5 text-[9px] text-[#85899A]">
                          {story.company || "Not specified"}
                        </p>
                      </div>
                    </td>

                    {/* TESTIMONIAL */}
                    <td className="px-4 py-3">
                      <p
                        title={story.story}
                        className="line-clamp-2 max-w-[220px] text-[9px] leading-4 text-[#667085]"
                      >
                        {story.story}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {story.status === "published" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF7EF] px-2 py-1 text-[9px] font-medium text-[#20834C]">
                          <Check size={10} />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[#FFF5E6] px-2 py-1 text-[9px] font-medium text-[#A96800]">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex w-full items-center justify-end">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            if (openMenu === story.id) {
                              setOpenMenu(null);
                              setMenuPosition(null);
                              return;
                            }

                            const rect =
                              event.currentTarget.getBoundingClientRect();

                            const menuWidth = 160;
                            const menuHeight = 124;

                            const left = Math.max(
                              8,
                              Math.min(
                                rect.right - menuWidth,
                                window.innerWidth - menuWidth - 8
                              )
                            );

                            const top =
                              rect.bottom + menuHeight + 8 > window.innerHeight
                                ? Math.max(8, rect.top - menuHeight - 6)
                                : rect.bottom + 6;

                            setMenuPosition({ top, left });
                            setOpenMenu(story.id);
                          }}
                          aria-label={`Actions for ${story.name}`}
                          aria-expanded={openMenu === story.id}
                          aria-haspopup="menu"
                          className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#EEEDF8] hover:text-[#3F3A8F] focus:outline-none focus:ring-2 focus:ring-[#3F3A8F]/20"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {openMenu === story.id &&
                          menuPosition &&
                          createPortal(
                            <div
                              role="menu"
                              className="fixed z-[9999] w-40 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white py-1 text-left shadow-xl"
                              style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                              }}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => openEditForm(story)}
                                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[10px] font-medium text-[#344054] transition hover:bg-[#F8F7FC] hover:text-[#3F3A8F]"
                              >
                                <Edit3 size={13} />
                                Edit Story
                              </button>

                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => void togglePublished(story)}
                                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[10px] font-medium text-[#344054] transition hover:bg-[#F8F7FC] hover:text-[#3F3A8F]"
                              >
                                <Award size={13} />
                                {story.status === "published"
                                  ? "Unpublish"
                                  : "Publish"}
                              </button>

                              <div className="my-1 border-t border-[#F0F0F5]" />

                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => void deleteStory(story.id)}
                                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[10px] font-medium text-red-600 transition hover:bg-red-50"
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </div>,
                            document.body
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-14 text-center">
            <Award
              size={24}
              className="mx-auto text-[#3F3A8F]"
            />

            <p className="mt-3 text-sm font-semibold text-[#0B2545] sm:text-xs">
              No alumni records found
            </p>

            <p className="mt-1 text-xs text-[#85899A] sm:text-[10px]">
              Try another search or add a new success story.
            </p>
          </div>
        )}
      </div>

      {/* IMAGE CROPPER */}
      {showCropper && imagePreview && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-3">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">
              <div>
                <h2 className="text-base font-semibold text-[#0B2545]">
                  Edit Alumni Photo
                </h2>

                <p className="mt-1 text-xs text-[#667085]">
                  Drag to reposition or pinch to zoom
                </p>
              </div>

              <button
                type="button"
                onClick={cancelCrop}
                className="rounded-full p-2 text-[#667085] hover:bg-gray-100"
                aria-label="Close image editor"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative h-[320px] w-full bg-black sm:h-[380px]">
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                minZoom={1}
                maxZoom={4}
              />
            </div>

            <div className="px-5 py-5">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="alumni-image-zoom"
                  className="text-sm font-medium text-[#344054]"
                >
                  Zoom
                </label>

                <span className="text-xs text-[#667085]">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((value) =>
                      Math.max(1, Number((value - 0.2).toFixed(1)))
                    )
                  }
                  className="h-9 w-9 rounded-full border border-[#E5E7EB] text-lg text-[#344054]"
                  aria-label="Zoom out"
                >
                  −
                </button>

                <input
                  id="alumni-image-zoom"
                  type="range"
                  min={1}
                  max={4}
                  step={0.1}
                  value={zoom}
                  onChange={(event) =>
                    setZoom(Number(event.target.value))
                  }
                  className="w-full accent-[#3F3A8F]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setZoom((value) =>
                      Math.min(4, Number((value + 0.2).toFixed(1)))
                    )
                  }
                  className="h-9 w-9 rounded-full border border-[#E5E7EB] text-lg text-[#344054]"
                  aria-label="Zoom in"
                >
                  +
                </button>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={cancelCrop}
                  className="h-10 rounded-lg border border-[#E5E7EB] px-5 text-sm font-medium text-[#667085] hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void applyCrop()}
                  disabled={!croppedAreaPixels || !pendingImageFile}
                  className="h-10 rounded-lg bg-[#3F3A8F] px-5 text-sm font-medium text-white hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#0B2545]/45 p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="my-4 w-full max-w-2xl overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xl"
          >
            {/* FORM HEADER */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3.5 sm:px-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#7779C6] sm:text-[8px]">
                  Mentorship Management
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#0B2545] sm:text-base">
                  {editingStory ? "Edit Success Story" : "Add Success Story"}
                </h2>

                <p className="mt-0.5 text-xs text-[#85899A] sm:text-[9px]">
                  Enter alumni details and career information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#F1F0F8] hover:text-[#3F3A8F]"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM BODY */}
            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] overflow-y-auto px-4 py-4 sm:px-5"
            >
              <div className="grid gap-3.5 sm:grid-cols-2">
                {/* ALUMNI NAME */}
                <div>
                  <label
                    htmlFor="story-name"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Alumni Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="story-name"
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Enter alumni name"
                    className={inputClass}
                    required
                  />
                </div>

                {/* MENTORSHIP PROGRAM */}
                <div>
                  <label
                    htmlFor="story-program"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Mentorship Program <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="story-program"
                    value={formData.program}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        program: event.target.value,
                      }))
                    }
                    className={inputClass}
                    required
                  >
                    <option value="">Select a program</option>

                    {programOptions.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                {/* YEAR */}
                <div>
                  <label
                    htmlFor="story-year"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Year <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="story-year"
                    value={formData.year}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        year: event.target.value,
                      }))
                    }
                    className={inputClass}
                    required
                  >
                    <option value="">Select year</option>

                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* INTERNSHIP ROLE */}
                <div>
                  <label
                    htmlFor="story-role"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Internship Role <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="story-role"
                    type="text"
                    value={formData.role}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                    placeholder="e.g. MERN Stack Developer Intern"
                    className={inputClass}
                    required
                  />
                </div>

                {/* CURRENT POSITION */}
                <div>
                  <label
                    htmlFor="story-title"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Current Position <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="story-title"
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    placeholder="e.g. Software Developer"
                    className={inputClass}
                    required
                  />
                </div>

                {/* CURRENT COMPANY */}
                <div>
                  <label
                    htmlFor="story-company"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Current Company <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="story-company"
                    type="text"
                    value={formData.company}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: event.target.value,
                      }))
                    }
                    placeholder="Enter company name"
                    className={inputClass}
                    required
                  />
                </div>

                {/* ALUMNI IMAGE */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#0B2545] sm:text-[10px]">
                    Alumni Image (Optional)
                  </label>

                  <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-dashed border-[#C9C6E5] bg-[#FAFAFD] p-2.5">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5E7EB] bg-white">
                      {imagePreview ? (
                        <img
                          key={imagePreview}
                          src={imagePreview}
                          alt="Alumni preview"
                          className="absolute inset-0 h-full w-full rounded-full object-cover"
                          onError={() => {
                            setError(
                              "Unable to display the selected image. Please choose another image."
                            );
                          }}
                        />
                      ) : (
                        <ImageIcon
                          size={18}
                          className="text-[#A5A3C8]"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-4 text-xs font-medium text-white transition hover:bg-[#0B2545] sm:text-[10px]">
                        <Upload size={13} />
                        Choose Image

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      <p className="mt-1.5 text-[10px] leading-4 text-[#667085] sm:text-[9px]">
                        JPG, PNG or WEBP · Maximum 2 MB
                      </p>

                      {imageFile && (
                        <p className="mt-1 truncate text-[10px] font-medium text-[#3F3A8F] sm:text-[9px]">
                          {imageFile.name}
                        </p>
                      )}

                      {!imageFile && editingStory?.image_url && !removeExistingImage && (
                        <p className="mt-1 text-[10px] text-[#667085] sm:text-[9px]">
                          Existing photo will be retained.
                        </p>
                      )}

                      {removeExistingImage && (
                        <p className="mt-1 text-[10px] text-red-600 sm:text-[9px]">
                          Existing photo will be removed when saved.
                        </p>
                      )}
                    </div>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-2.5 text-[10px] font-medium text-red-600 transition hover:bg-red-50 sm:text-[9px]"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* TESTIMONIAL */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="story-testimonial"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Testimonial <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="story-testimonial"
                    value={formData.story}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        story: event.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Write the alumni experience, learning journey and career progress..."
                    className="mt-1.5 w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm leading-5 text-[#0B2545] outline-none transition placeholder:text-[#A0A4AD] focus:border-[#3F3A8F] focus:ring-2 focus:ring-[#3F3A8F]/10 sm:text-xs"
                    required
                  />
                </div>

                {/* STATUS */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="story-status"
                    className="text-xs font-semibold text-[#0B2545] sm:text-[10px]"
                  >
                    Publication Status
                  </label>

                  <select
                    id="story-status"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: event.target.value as
                          | "published"
                          | "draft",
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>

                  <p className="mt-1 text-[10px] text-[#85899A] sm:text-[9px]">
                    Only published stories appear on the public website.
                  </p>
                </div>
              </div>

              {/* FORM ACTIONS */}
              <div className="mt-5 flex flex-col-reverse justify-end gap-2 border-t border-[#E5E7EB] pt-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] px-4 text-xs font-medium text-[#667085] transition hover:border-[#3F3A8F] hover:bg-[#F8F7FC] hover:text-[#3F3A8F] disabled:opacity-50 sm:h-9 sm:text-[10px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || Boolean(pendingImageFile)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-4 text-xs font-medium text-white transition hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:text-[10px]"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={13}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      {editingStory ? "Save Changes" : "Add Story"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;
