
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const newErrors: Record<string, string> = {};

    if (!name) {
      newErrors.name = "Please enter your name";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!message) {
      newErrors.message = "Please enter your message";
    } else if (message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const companyEmail = "vinyasatechsolution@gmail.com";
    const subject = `New Project Enquiry from ${name}`;

    const body = `Hello Vinyasa Team,

I would like to discuss a project with you.

Name: ${name}
Email: ${email}

Message:
${message}

Thank you,
${name}`;

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(companyEmail)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");

    form.reset();
    setErrors({});
    setSubmitted(true);
  };

  const inputClass = (field: string) =>
    `block w-full min-w-0 max-w-full box-border rounded-lg border ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-[#D8D4F0] bg-[#EEF0FA]"
    } px-3 py-3 text-sm font-normal text-[#302A78]
    placeholder:text-sm placeholder:font-normal placeholder:text-[#77778A]
    outline-none transition-all
    focus:border-[#8C8BD1] focus:bg-white focus:ring-2
    focus:ring-[#8C8BD1]/15 sm:px-3.5 sm:py-3 sm:text-base
    sm:placeholder:text-sm`;

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-white">
      {/* HERO */}
      <section className="w-full min-w-0 overflow-hidden bg-[#302A78]">
        <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:py-7 2xl:max-w-[1800px] 2xl:px-10 min-[2400px]:max-w-[2200px] min-[2400px]:px-14">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#D8D4F0] sm:text-[10px]">
            Get In Touch
          </p>

          <h1 className="mt-1.5 break-words text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl md:text-4xl lg:text-[42px]">
            Let's build something
            <span className="text-[#D8D4F0]"> meaningful</span>
          </h1>

          <p className="mt-2 max-w-2xl text-xs font-normal leading-5 text-[#EEF0FA]/80 sm:text-sm md:text-base">
            Have a project or idea? Tell us what you need and let's find the
            right solution.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="w-full min-w-0 overflow-x-clip bg-[#EEF0FA] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:py-14">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
            {/* CONTACT INFORMATION */}
            <div className="w-full min-w-0 rounded-xl bg-[#44398F] p-4 sm:p-5 md:p-6 lg:p-7">
              <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#D8D4F0] sm:text-[10px]">
                Contact Information
              </p>

              <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl md:text-3xl">
                Get in touch
              </h2>

              <p className="mt-2 max-w-md text-xs font-normal leading-5 text-[#EEF0FA]/80 sm:text-sm">
                Let's discuss your project, requirements, and ideas.
              </p>

              <div className="mt-5 min-w-0 space-y-4 sm:space-y-5">
                {/* PHONE */}
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D8D4F0] text-[#302A78]">
                    <Phone size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#D8D4F0] sm:text-xs">
                      Phone
                    </p>

                    <a
                      href="tel:+918277968916"
                      className="mt-1 block break-words text-sm font-normal !text-white transition-colors hover:!text-[#D8D4F0] sm:text-sm"
                    >
                      +91 8277968916
                    </a>

                    <a
                      href="tel:+919148758916"
                      className="mt-0.5 block break-words text-sm font-normal !text-white transition-colors hover:!text-[#D8D4F0] sm:text-sm"
                    >
                      +91 9148758916
                    </a>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D8D4F0] text-[#302A78]">
                    <Mail size={15} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#D8D4F0] sm:text-xs">
                      Email
                    </p>

                    <a
                      href="mailto:vinyasatechsolution@gmail.com"
                      className="mt-1 block break-all text-sm font-normal !text-white transition-colors hover:!text-[#D8D4F0] sm:break-words sm:text-sm"
                    >
                      vinyasatechsolution@gmail.com
                    </a>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D8D4F0] text-[#302A78]">
                    <MapPin size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#D8D4F0] sm:text-xs">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-normal leading-5 text-white sm:text-sm">
                      Smart Tower, 1st Floor,
                      <br />
                      Balmatt New Road,
                      <br />
                      Mangalore – 575003
                    </p>
                  </div>
                </div>

                {/* WORKING HOURS */}
                <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D8D4F0] text-[#302A78]">
                    <Clock3 size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#D8D4F0] sm:text-xs">
                      Working Hours
                    </p>

                    <p className="mt-1 text-sm font-normal text-white sm:text-sm">
                      Mon – Fri
                    </p>

                    <p className="text-xs font-normal text-[#EEF0FA]/80 sm:text-sm">
                      9:30 AM – 5:30 PM
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/services"
                className="group mt-5 inline-flex max-w-full items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] !text-[#D8D4F0] transition-all duration-300 hover:translate-x-1 hover:!text-white sm:text-xs"
              >
                Explore Services
                <ArrowRight
                  size={13}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* FORM */}
            <div className="w-full min-w-0 rounded-xl border border-[#D8D4F0] bg-white p-4 sm:p-5 md:p-6 lg:p-7">
              <p className="text-[7px] font-medium uppercase tracking-[0.18em] text-[#44398F] sm:text-[10px]">
                Send A Message
              </p>

              <h2 className="mt-1.5 break-words text-xl font-semibold leading-tight tracking-[-0.035em] text-[#302A78] sm:text-2xl md:text-3xl">
                Tell us about your project
              </h2>

              <p className="mt-2 text-xs font-normal leading-5 text-[#55556A] sm:text-sm">
                Fill in the details and we'll get back to you.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-5 w-full min-w-0 space-y-4 sm:space-y-5"
              >
                {/* NAME + EMAIL */}
                <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3.5">
                  <div className="min-w-0">
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-[#55556A] sm:text-xs"
                    >
                      Your Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={inputClass("name")}
                    />

                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-1.5 text-xs font-normal text-red-500 sm:text-sm"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-[#55556A] sm:text-xs"
                    >
                      Email *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={inputClass("email")}
                    />

                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1.5 text-xs font-normal text-red-500 sm:text-sm"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="min-w-0">
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-[#55556A] sm:text-xs"
                  >
                    Message *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project requirements..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className={`${inputClass("message")} resize-y`}
                  />

                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-1.5 text-xs font-normal text-red-500 sm:text-sm"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* SUBMIT ERROR */}
                {errors.submit && (
                  <p className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-normal text-red-500 sm:text-sm">
                    {errors.submit}
                  </p>
                )}

                {/* SUCCESS */}
                {submitted && (
                  <p
                    aria-live="polite"
                    className="rounded-lg border border-[#D8D4F0] bg-[#EEF0FA] px-3 py-2.5 text-xs font-medium text-[#44398F] sm:text-sm"
                  >
                    Gmail compose has been opened with your enquiry details.
                    Please send the email to complete your enquiry.
                  </p>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  className="group relative inline-flex min-h-11 max-w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#44398F] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.12em] !text-white transition-all duration-300 hover:-translate-y-0.5 sm:text-xs"
                >
                  <span className="absolute inset-0 -translate-x-full bg-[#D8D4F0] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />

                  <span className="relative z-10 transition-colors duration-300 group-hover:!text-[#302A78]">
                    Send Message
                  </span>

                  <ArrowRight
                    size={14}
                    className="relative z-10 shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#302A78]"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
