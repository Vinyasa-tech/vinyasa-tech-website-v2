interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <div
      className={
        isCenter
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600 sm:text-xs">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[32px]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;