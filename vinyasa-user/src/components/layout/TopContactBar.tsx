import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

function TopContactBar() {
  return (
    <div className="hidden border-b border-white/10 bg-[#302A78] text-white lg:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-8 xl:px-10 2xl:h-10 2xl:max-w-[1800px] 2xl:px-16 min-[2400px]:h-11 min-[2400px]:max-w-[2100px] min-[2400px]:px-24">

        {/* LEFT CONTACT DETAILS */}
        <div className="flex items-center gap-5 xl:gap-7 2xl:gap-9">
          {/* EMAIL */}
          <a
            href="mailto:vinyasatechsolution@gmail.com"
            className="flex items-center gap-1.5 text-[10px] text-white transition-colors hover:text-[#D8D4F0] 2xl:text-[11px] min-[2400px]:text-xs"
          >
            <Mail className="h-3 w-3 shrink-0 text-[#D8D4F0] 2xl:h-3.5 2xl:w-3.5" />
            vinyasatechsolution@gmail.com
          </a>

          <div className="h-3 w-px bg-white/20" />

          {/* PHONE */}
          <a
            href="tel:+918277968916"
            className="flex items-center gap-1.5 text-[10px] text-white transition-colors hover:text-[#D8D4F0] 2xl:text-[11px] min-[2400px]:text-xs"
          >
            <Phone className="h-3 w-3 shrink-0 text-[#D8D4F0] 2xl:h-3.5 2xl:w-3.5" />
            +91 8277968916
          </a>

          <div className="h-3 w-px bg-white/20" />

          {/* LOCATION */}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-[#D8D4F0] 2xl:h-3.5 2xl:w-3.5" />

            <span className="text-[10px] text-white 2xl:text-[11px] min-[2400px]:text-xs">
              Mangalore, Karnataka
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 xl:gap-7 2xl:gap-9">
          {/* WORKING HOURS */}
          <div className="flex items-center gap-1.5 text-[10px] text-white 2xl:text-[11px] min-[2400px]:text-xs">
            <Clock3 className="h-3 w-3 shrink-0 text-[#D8D4F0] 2xl:h-3.5 2xl:w-3.5" />

            <span>
              Mon - Fri: 9:30 AM - 5:30 PM
            </span>
          </div>

          <div className="h-3 w-px bg-white/20" />

          {/* SOCIAL MEDIA */}
          <div className="flex items-center gap-2.5 2xl:gap-3.5">
            <a
              href="https://www.instagram.com/vinyasa_tech/"
              aria-label="Instagram"
              className="text-white transition-all hover:-translate-y-0.5 hover:text-[#D8D4F0]"
            >
              <FaInstagram size={12} />
            </a>

            <a
              href="https://www.facebook.com/vinyasagroup/"
              aria-label="Facebook"
              className="text-white transition-all hover:-translate-y-0.5 hover:text-[#D8D4F0]"
            >
              <FaFacebookF size={11} />
            </a>

            <a
              href="https://in.linkedin.com/company/vinyasa-tech-solutions"
              aria-label="LinkedIn"
              className="text-white transition-all hover:-translate-y-0.5 hover:text-[#D8D4F0]"
            >
              <FaLinkedinIn size={12} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TopContactBar;