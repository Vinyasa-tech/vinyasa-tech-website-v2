
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

import { API_ORIGIN } from "../../config/constants";


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

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.website || "#"}
      target={project.website ? "_blank" : undefined}
      rel={project.website ? "noopener noreferrer" : undefined}
      className="group relative block w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-500 ease-out hover:border-blue-200 hover:shadow-lg"
      aria-label={
        project.website
          ? `Visit ${project.title} website`
          : project.title
      }
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-12 w-12 rounded-full bg-blue-500/5 transition-all duration-700 group-hover:scale-150 group-hover:bg-blue-500/10" />

      <div className="pointer-events-none absolute -bottom-7 -left-7 h-14 w-14 rounded-full bg-cyan-400/5 transition-all duration-700 group-hover:scale-125 group-hover:bg-cyan-400/10" />

      {/* Arrow */}
      <div className="relative z-10 flex justify-end p-2 pb-0">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white sm:h-6 sm:w-6">
          <ArrowUpRight
            size={10}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {/* Logo Area */}
      <div className="relative z-10 mt-1 flex h-16 items-center justify-center overflow-hidden bg-slate-50 sm:h-18 md:h-20">
        {/* Soft Glow */}
        <div className="pointer-events-none absolute h-8 w-8 rounded-full bg-blue-400/10 blur-lg transition-all duration-700 group-hover:h-12 group-hover:w-12 group-hover:bg-blue-400/20" />

        {/* Ripple 1 */}
        <div className="pointer-events-none absolute h-8 w-8 rounded-full border border-blue-500/10 transition-all duration-700 ease-out group-hover:scale-[2.2] group-hover:border-blue-500/20" />

        {/* Ripple 2 */}
        <div className="pointer-events-none absolute h-5 w-5 rounded-full border border-cyan-400/10 opacity-0 transition-all duration-700 ease-out group-hover:scale-[3] group-hover:opacity-100 group-hover:border-cyan-400/20" />

        {/* Larger Logo Image */}
        <img
          src={getProjectLogoSrc(project.logo)}
          alt={`${project.title} logo`}
          loading="lazy"
          className="relative z-10 h-14 w-14 object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:h-16 sm:w-16 md:h-18 md:w-18"
        />
      </div>

      {/* Info */}
      <div className="relative z-10 -mt-0.5 px-2 pb-3 pt-1 text-center">
        <h3 className="truncate text-[10px] font-medium tracking-tight text-[#0b2545] transition-colors duration-300 group-hover:text-blue-600 sm:text-[11px] md:text-xs">
          {project.title}
        </h3>

        <p className="mt-0.5 line-clamp-1 text-[7px] font-normal leading-3 text-slate-400 sm:text-[8px] md:text-[9px]">
          {project.description}
        </p>
      </div>

      {/* Bottom Accent */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 group-hover:w-full" />
    </a>
  );
}

export default ProjectCard;
