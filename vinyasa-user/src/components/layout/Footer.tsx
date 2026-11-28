import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { services } from "@/data/services";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/company/vinyasa-tech-solutions",
    icon: FaLinkedinIn,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vinyasa_tech/",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/vinyasagroup/",
    icon: FaFacebookF,
  },
  {
    label: "X",
    href: "https://x.com/vinyasa_group",
    icon: FaXTwitter,
  },
];

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProjectsClick = () => {
    const scrollToProjects = () => {
      const section = document.getElementById("projects");
      if (!section) return false;

      const top =
        section.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({
        top: Math.max(0, top),
        left: 0,
        behavior: "smooth",
      });

      return true;
    };

    if (location.pathname === "/") {
      requestAnimationFrame(() =>
        requestAnimationFrame(scrollToProjects),
      );
      return;
    }

    navigate("/");

    let attempts = 0;

    const tryScroll = () => {
      if (scrollToProjects()) return;

      if (++attempts < 30) {
        window.setTimeout(tryScroll, 100);
      }
    };

    window.setTimeout(tryScroll, 100);
  };

  return (
    <footer className="w-full bg-[#17144F] !text-white">
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-5 sm:py-5 md:px-6 md:py-6 lg:px-8">
<div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:gap-x-6 md:gap-x-7 lg:grid-cols-[1.25fr_0.7fr_1.2fr_1fr] lg:gap-7">
          <div className="order-1">
            <Link
              to="/"
              className="group inline-flex items-center"
              aria-label="VINYASA Home"
            >
              <img
                src="/images/vinyasa-logo.png"
                alt="VINYASA - Expect the unexpected"
                className="w-[145px] object-contain sm:w-[165px] md:w-[175px]"
              />
            </Link>

            <p className="mt-2 max-w-[230px] text-[12px] leading-5 text-white md:text-[13px]">
              Digital solutions designed to help businesses build, grow and
              move forward.
            </p>

            <div className="mt-3 flex gap-1.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 !text-[#D8D4F0] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D8D4F0] hover:bg-[#D8D4F0] hover:!text-[#3D358B]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* SERVICES */}

          <div className="order-4 ml-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] !text-white md:text-[13px]">
              Services
            </h2>

            <ul className="mt-2 space-y-0.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="group inline-flex items-center gap-1 text-[12px] leading-5 text-white transition-colors duration-200 hover:!text-white md:text-[13px]"
                  >
                    {service.title}

                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}

          <div className="order-2 ml-5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white md:text-[13px]">
              Quick Links
            </h2>

            <ul className="mt-2 space-y-1">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  {item.label === "Projects" ? (
                    <button
                      type="button"
                      onClick={handleProjectsClick}
                      className="group inline-flex items-center gap-1 !text-[12px] !text-white transition-colors duration-200 hover:!text-white"
                    >
                      Projects
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-1 text-[12px] text-white transition-colors duration-200 hover:!text-white md:text-[13px]"
                    >
                      {item.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}

          <div className="order-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] !text-white md:text-[13px]">
              Contact
            </h2>

            <div className="mt-2 space-y-3">
              {/* EMAIL */}
<div className="flex min-w-0 items-start gap-2">
  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 !text-[#D8D4F0]">
    <Mail className="h-3.5 w-3.5" />
  </div>

  <div className="min-w-0 flex-1">
    

<a
  href="mailto:vinyasatechsolution@gmail.com"
  className="mt-0.5 block whitespace-nowrap text-[11.5px] !leading-5 !text-white hover:!text-[#D8D4F0]"
>
  vinyasatechsolution@gmail.com
</a>

  </div>
</div>

              {/* PHONE */}

              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 !text-[#D8D4F0]">
                  <Phone className="h-3.5 w-3.5" />
                </div>

                <div>
                  

                  <a
                    href="tel:+918277968916"
                    className="mt-0.5 block text-[12px] !text-white hover:!text-[#D8D4F0] md:text-[13px]"
                  >
                    +91 8277968916
                  </a>

                  <a
                    href="tel:+919148758916"
                    className="block text-[12px] !text-white hover:!text-[#D8D4F0] md:text-[13px]"
                  >
                    +91 9148758916
                  </a>
                </div>
              </div>

              {/* LOCATION */}

              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 !text-[#D8D4F0]">
                  <MapPin className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                 

                  <p className="mt-0.5 text-[12px] leading-5 !text-white md:text-[13px]">
                    Smart Tower, 1st Floor,
                    <br />
                    Balmata New Road,
                    <br />
                    Mangalore – 575003
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM FOOTER
      ===================================================== */}

      <div className="border-t border-[#D8D4F0]/15 bg-[#17144F]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3">
          <p className="text-center text-[11px] text-white sm:text-[12px]">
            © 2026 VINYASA. All rights reserved.
          </p>
        </div>
      </div>
      
    </footer>
  );
}

export default Footer;