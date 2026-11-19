import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  ExternalLink,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  FolderKanban,
  Globe,
  Layers3,
} from "lucide-react";

import { motion } from "motion/react";
import axios from "axios";

import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectApi";

import type {
  Project,
  ProjectInput,
} from "../services/projectApi";

type LogoMode = "path" | "upload";

const API_ORIGIN = "http://localhost:5000";

const getProjectLogoSrc = (logo: string): string => {
  if (
    logo.startsWith("http://") ||
    logo.startsWith("https://") ||
    logo.startsWith("data:") ||
    logo.startsWith("blob:")
  ) {
    return logo;
  }

  return `${API_ORIGIN}/${logo.replace(/^\/+/, "")}`;
};

const getErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || fallback;
  }

  if (err instanceof Error) {
    return err.message || fallback;
  }

  return fallback;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [logoMode, setLogoMode] = useState<LogoMode>("path");
  const [logoPath, setLogoPath] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoError, setLogoError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // LOAD PROJECTS
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProjects();
        setProjects(data);
      } catch (err: unknown) {
        console.error("Failed to load projects:", err);

        setError(
          getErrorMessage(
            err,
            "Unable to load projects. Please check your login and backend connection."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, []);

  // FILTER PROJECTS
  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return projects;

    return projects.filter((project) =>
      [
        project.title,
        project.description,
        project.website ?? "",
      ].some((item) => item.toLowerCase().includes(value))
    );
  }, [projects, search]);

  // SUMMARY
  const websiteCount = projects.filter(
    (project) => Boolean(project.website)
  ).length;

  const withoutWebsiteCount =
    projects.length - websiteCount;

  // RESET LOGO
  const resetLogoState = () => {
    setLogoMode("path");
    setLogoPath("");
    setLogoPreview("");
    setLogoFile(null);
    setLogoFileName("");
    setLogoError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ADD PROJECT
  const handleAdd = () => {
    setError("");
    setEditingProject(null);
    resetLogoState();
    setShowModal(true);
  };

  // EDIT PROJECT
  const handleEdit = (project: Project) => {
    setError("");
    setEditingProject(project);

    setLogoMode("path");
    setLogoPath(project.logo);
    setLogoPreview(getProjectLogoSrc(project.logo));
    setLogoFile(null);
    setLogoFileName("");
    setLogoError("");

    setShowModal(true);
  };

  // CLOSE MODAL
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProject(null);
    resetLogoState();
  };

  // LOGO MODE
  const handleLogoModeChange = (mode: LogoMode) => {
    setLogoMode(mode);
    setLogoError("");

    if (mode === "path") {
      setLogoFile(null);
      setLogoFileName("");

      setLogoPreview(
        logoPath.trim()
          ? getProjectLogoSrc(logoPath.trim())
          : ""
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (logoFile) {
      setLogoPreview(logoPreview);
    } else if (editingProject && !logoPath.trim()) {
      setLogoPreview(
        getProjectLogoSrc(editingProject.logo)
      );
    }
  };

  // LOGO PATH
  const handleLogoPathChange = (value: string) => {
    setLogoPath(value);

    setLogoPreview(
      value.trim() ? getProjectLogoSrc(value.trim()) : ""
    );

    setLogoFile(null);
    setLogoFileName("");
    setLogoError("");
  };

  // LOGO UPLOAD
  const handleLogoUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLogoError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setLogoError(
        "Only PNG, JPG, JPEG and WEBP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoError("Image size must be 5MB or less.");

      event.target.value = "";
      return;
    }

    setLogoFile(file);
    setLogoFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoPreview(reader.result);
      }
    };

    reader.onerror = () => {
      setLogoError(
        "Unable to read this image. Please try again."
      );
    };

    reader.readAsDataURL(file);
  };

  // DELETE PROJECT
  const handleDelete = async (id: number) => {
    const project = projects.find(
      (item) => item.id === id
    );

    if (!project) return;

    if (!window.confirm(`Delete "${project.title}"?`)) {
      return;
    }

    try {
      setError("");

      await deleteProject(id);

      setProjects((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err: unknown) {
      console.error("Delete project error:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to delete project. Please check your login and try again."
        )
      );
    }
  };

  // SAVE PROJECT
  const handleSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    const formData = new FormData(event.currentTarget);

    const title = String(
      formData.get("title") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const website = String(
      formData.get("website") || ""
    ).trim();

    // Use the selected File or existing logo path.
    const logo: File | string =
      logoMode === "upload"
        ? logoFile || editingProject?.logo || ""
        : logoPath.trim();

    if (!title || !description) {
      setError(
        "Project name and description are required."
      );
      return;
    }

    if (!logo) {
      setLogoError(
        "Please enter a logo path or upload a logo."
      );
      return;
    }

    const projectData: ProjectInput = {
      title,
      logo,
      description,
      website: website || null,
      status: editingProject?.status ?? "published",
    };

    try {
      setSaving(true);
      setError("");
      setLogoError("");

      if (editingProject) {
        const updatedProject = await updateProject(
          editingProject.id,
          projectData
        );

        setProjects((previous) =>
          previous.map((project) =>
            project.id === editingProject.id
              ? updatedProject
              : project
          )
        );
      } else {
        const newProject = await createProject(projectData);

        setProjects((previous) => [
          newProject,
          ...previous,
        ]);
      }

      setShowModal(false);
      setEditingProject(null);
      resetLogoState();
    } catch (err: unknown) {
      console.error("Save project error:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to save project. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-w-0 p-2.5 sm:p-4 md:p-5 lg:p-6 xl:p-7">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-[#E7E6F1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FolderKanban
                size={15}
                className="text-[#7779C6]"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7779C6] sm:text-[10px]">
                Portfolio Management
              </p>
            </div>

            <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#0B2545] sm:text-xl md:text-2xl">
              Projects
            </h1>

            <p className="mt-1 max-w-xl text-[12px] leading-5 text-[#667085] sm:text-[11px] sm:leading-5 md:text-xs">
              Organize and manage the projects showcased on the Vinyasa Tech website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#302A78] sm:h-10 sm:text-xs"
          >
            <Plus size={15} />
            Add New Project
          </button>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">

        <div className="min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#77778A] sm:text-[9px]">
              Total Projects
            </p>

            <FolderKanban
              size={13}
              className="text-[#7779C6]"
            />
          </div>

          <p className="mt-1 text-xl font-semibold text-[#0B2545] sm:text-xl md:text-2xl">
            {projects.length}
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#77778A] sm:text-[9px]">
              With Website
            </p>

            <Globe
              size={13}
              className="text-[#3F3A8F]"
            />
          </div>

          <p className="mt-1 text-xl font-semibold text-[#3F3A8F] sm:text-xl md:text-2xl">
            {websiteCount}
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-[#E7E6F1] bg-white p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#77778A] sm:text-[9px]">
              Without Link
            </p>

            <Layers3
              size={13}
              className="text-[#667085]"
            />
          </div>

          <p className="mt-1 text-xl font-semibold text-[#667085] sm:text-xl md:text-2xl">
            {withoutWebsiteCount}
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#E7E6F1] bg-white p-2.5 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:p-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by project name, description or website..."
            className="h-9 w-full rounded-lg border border-[#E7E6F1] bg-[#FAFAFD] pl-9 pr-3 text-[12px] text-[#0B2545] outline-none placeholder:text-[#98A2B3] focus:border-[#7779C6] sm:text-[11px]"
          />
        </div>

        <p className="text-[11px] text-[#77778A] sm:text-[10px]">
          Showing{" "}
          <span className="font-semibold text-[#0B2545]">
            {filteredProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#0B2545]">
            {projects.length}
          </span>{" "}
          projects
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-700 sm:text-[11px]"
        >
          {error}
        </div>
      )}

      {/* PROJECT LIST */}
      <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">

        {loading ? (
          <div className="rounded-xl border border-[#E7E6F1] bg-white px-4 py-12 text-center">
            <p className="text-sm text-[#667085] sm:text-xs">
              Loading projects...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: index * 0.025,
              }}
              className="group grid min-w-0 grid-cols-[76px_minmax(0,1fr)] gap-3 overflow-hidden rounded-xl border border-[#E7E6F1] bg-white p-2.5 transition-colors hover:border-[#C9C8E2] sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-4 sm:p-3.5 md:grid-cols-[112px_minmax(0,1fr)_auto] md:items-center md:gap-5 lg:p-4"
            >
              {/* LOGO */}
              <div className="flex h-[76px] items-center justify-center rounded-lg border border-[#F0EFF7] bg-[#F8F8FC] p-2 sm:h-[90px] sm:p-3 md:h-[96px]">
                <img
                  src={getProjectLogoSrc(project.logo)}
                  alt={`${project.title} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* PROJECT DETAILS */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="max-w-full truncate text-[14px] font-semibold text-[#0B2545] sm:text-[13px] md:text-sm">
                    {project.title}
                  </h2>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-medium sm:text-[8px] ${
                      project.website
                        ? "bg-[#EAF7EF] text-[#25804D]"
                        : "bg-[#F2F3F6] text-[#667085]"
                    }`}
                  >
                    {project.website
                      ? "Live Website"
                      : "No Website"}
                  </span>
                </div>

                <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-[#667085] sm:text-[11px] sm:leading-5">
                  {project.description}
                </p>

                {project.website ? (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-1.5 text-[11px] font-medium text-[#3F3A8F] hover:text-[#0B2545] sm:text-[10px]"
                  >
                    <ExternalLink
                      size={11}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {project.website}
                    </span>
                  </a>
                ) : (
                  <p className="mt-2 text-[11px] text-[#98A2B3] sm:text-[10px]">
                    Website link not added
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="col-span-2 flex items-center justify-end gap-2 border-t border-[#F0EFF7] pt-2 md:col-span-1 md:border-0 md:pt-0">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#E7E6F1] px-3 text-[11px] font-medium text-[#3F3A8F] transition-colors hover:bg-[#F2F1FA] sm:h-9 sm:text-[10px]"
                >
                  <Pencil size={12} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => void handleDelete(project.id)}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#F1DFE2] px-3 text-[11px] font-medium text-[#A13A45] transition-colors hover:bg-[#FDF0F2] sm:h-9 sm:text-[10px]"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#D8D7ED] bg-white px-4 py-10 text-center sm:py-14">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F3A8F]">
              <Search size={17} />
            </div>

            <h3 className="mt-3 text-[14px] font-semibold text-[#0B2545] sm:text-sm">
              No projects found
            </h3>

            <p className="mt-1 text-[12px] text-[#77778A] sm:text-[11px]">
              {search
                ? "Try another search term."
                : "Add your first project to display it here."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#3F3A8F] px-3 text-[11px] font-medium text-white hover:bg-[#0B2545]"
              >
                <Plus size={12} />
                Add Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/50 px-2.5 py-3 sm:px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex max-h-[94vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl sm:max-w-lg md:max-w-xl"
          >
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E7E6F1] bg-[#FAFAFD] px-4 py-3.5 sm:px-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7779C6] sm:text-[9px]">
                  Project Portfolio
                </p>

                <h2 className="mt-0.5 text-base font-semibold text-[#0B2545] sm:text-base">
                  {editingProject
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>

                <p className="mt-0.5 text-[11px] text-[#77778A] sm:text-[10px]">
                  Enter the details to manage your website project.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                aria-label="Close modal"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#667085] hover:bg-[#EDECF5] disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSave}
              className="min-h-0 flex-1 space-y-3.5 overflow-y-auto p-3.5 sm:space-y-4 sm:p-5"
            >
              {/* PROJECT NAME */}
              <div>
                <label
                  htmlFor="project-title"
                  className="text-[12px] font-semibold text-[#0B2545] sm:text-[11px]"
                >
                  Project Name *
                </label>

                <input
                  id="project-title"
                  type="text"
                  name="title"
                  defaultValue={editingProject?.title ?? ""}
                  required
                  placeholder="Enter project name"
                  className="mt-1.5 h-9 w-full rounded-lg border border-[#E7E6F1] px-3 text-[12px] text-[#0B2545] outline-none focus:border-[#7779C6] sm:h-10 sm:text-xs"
                />
              </div>

              {/* LOGO */}
              <div>
                <label className="text-[12px] font-semibold text-[#0B2545] sm:text-[11px]">
                  Project Logo *
                </label>

                <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-[#F3F3F9] p-1">
                  <button
                    type="button"
                    onClick={() => handleLogoModeChange("path")}
                    className={`flex h-8 items-center justify-center gap-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      logoMode === "path"
                        ? "bg-white text-[#3F3A8F] shadow-sm"
                        : "text-[#667085] hover:text-[#3F3A8F]"
                    }`}
                  >
                    <ImagePlus size={13} />
                    Logo Path
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLogoModeChange("upload")}
                    className={`flex h-8 items-center justify-center gap-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      logoMode === "upload"
                        ? "bg-white text-[#3F3A8F] shadow-sm"
                        : "text-[#667085] hover:text-[#3F3A8F]"
                    }`}
                  >
                    <Upload size={13} />
                    Upload Image
                  </button>
                </div>

                {logoMode === "path" ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={logoPath}
                      onChange={(event) =>
                        handleLogoPathChange(event.target.value)
                      }
                      placeholder="/images/projects/project-logo.png"
                      className="h-9 w-full rounded-lg border border-[#E7E6F1] px-3 text-[12px] text-[#0B2545] outline-none focus:border-[#7779C6] sm:h-10 sm:text-[11px]"
                    />

                    <p className="mt-1 text-[11px] text-[#98A2B3] sm:text-[9px]">
                      Enter an existing public image path or URL.
                    </p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <label
                      htmlFor="project-logo-upload"
                      className="flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#C9C8E2] bg-[#FAFAFD] px-3 py-3 text-center transition-colors hover:border-[#7779C6] hover:bg-[#F2F1FA]"
                    >
                      <Upload
                        size={17}
                        className="text-[#3F3A8F]"
                      />

                      <span className="mt-1 text-[12px] font-semibold text-[#0B2545] sm:text-[10px]">
                        Choose logo image
                      </span>

                      <span className="mt-0.5 text-[11px] text-[#98A2B3] sm:text-[9px]">
                        PNG, JPG, JPEG or WEBP · Max 5MB
                      </span>

                      {logoFileName && (
                        <span className="mt-1 max-w-full truncate text-[11px] font-medium text-[#3F3A8F] sm:text-[9px]">
                          {logoFileName}
                        </span>
                      )}
                    </label>

                    <input
                      ref={fileInputRef}
                      id="project-logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                  </div>
                )}

                {logoError && (
                  <p className="mt-1 text-[11px] font-medium text-[#A13A45] sm:text-[9px]">
                    {logoError}
                  </p>
                )}

                {/* PREVIEW */}
                {logoPreview && (
                  <div className="mt-2 rounded-lg border border-[#E7E6F1] bg-[#FAFAFD] p-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#77778A] sm:text-[9px]">
                        Logo Preview
                      </p>
                    </div>

                    <div className="mt-2 flex min-h-20 items-center justify-center rounded-lg border border-[#E7E6F1] bg-white p-3">
                      <img
                        src={logoPreview}
                        alt="Project logo preview"
                        className="max-h-16 max-w-[180px] object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="project-description"
                  className="text-[12px] font-semibold text-[#0B2545] sm:text-[11px]"
                >
                  Description *
                </label>

                <textarea
                  id="project-description"
                  name="description"
                  defaultValue={editingProject?.description ?? ""}
                  required
                  rows={3}
                  placeholder="Write a short project description..."
                  className="mt-1.5 w-full resize-y rounded-lg border border-[#E7E6F1] px-3 py-2.5 text-[12px] leading-5 text-[#0B2545] outline-none focus:border-[#7779C6] sm:text-[11px]"
                />
              </div>

              {/* WEBSITE */}
              <div>
                <label
                  htmlFor="project-website"
                  className="text-[12px] font-semibold text-[#0B2545] sm:text-[11px]"
                >
                  Website URL
                </label>

                <input
                  id="project-website"
                  type="url"
                  name="website"
                  defaultValue={editingProject?.website ?? ""}
                  placeholder="https://example.com"
                  className="mt-1.5 h-9 w-full rounded-lg border border-[#E7E6F1] px-3 text-[12px] text-[#0B2545] outline-none focus:border-[#7779C6] sm:h-10 sm:text-[11px]"
                />

                <p className="mt-1 text-[11px] text-[#98A2B3] sm:text-[9px]">
                  Leave empty if the project does not have a public website.
                </p>
              </div>

              {/* FORM ERROR */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700 sm:text-[10px]">
                  {error}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-2 border-t border-[#E7E6F1] pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="h-9 rounded-lg border border-[#E7E6F1] px-4 text-[12px] font-medium text-[#667085] hover:bg-[#F8F8FC] disabled:opacity-50 sm:text-[11px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#3F3A8F] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#0B2545] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[11px]"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Plus size={13} />
                      {editingProject
                        ? "Save Changes"
                        : "Add Project"}
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

export default Projects;