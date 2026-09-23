import React, { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  Home,
  BookOpen,
  FileText,
  Phone,
  ShoppingBag,
  Truck,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // ==========================================
  // SHOP DROPDOWN STATE
  // ==========================================

  const [shopOpen, setShopOpen] = useState(false);

  // ==========================================
  // SCROLL TO TOP
  // ==========================================

  const scrollToTop = () => {
    const container = document.getElementById("main-content");

    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ==========================================
  // NAVIGATION ITEMS
  // ==========================================

  const navItems = [
    {
      name: "Our Story",
      path: "/our-story",
      icon: BookOpen,
    },
    {
      name: "Lab Reports",
      path: "/lab-reports",
      icon: FileText,
    },
    {
      name: "Contact Us",
      path: "/contact",
      icon: Phone,
    },
  ];

  // ==========================================
  // SOCIAL LINKS
  // ==========================================

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/sattvivanaturals?igsh=MXVnNXF2N3R0NmYxaQ==",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: "https://www.facebook.com/profile.php?id=61592279585289",
      label: "Facebook",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/918448349300",
      label: "WhatsApp",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/@sattvivanaturals?si=NbMIDWtBZRoBm_Ry",
      label: "YouTube",
    },
  ];

  // ==========================================
  // ACTIVE SHOP CHECK
  // ==========================================

  const isShopActive =
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||
    location.pathname.startsWith("/product/");

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <aside
      className="
        hidden
        md:flex

        fixed
        top-0
        left-0

        h-[100dvh]
        w-[280px]

        z-50

        flex-col

        bg-gradient-to-b
        from-green-800
        via-green-800
        to-green-900

        text-white

        shadow-2xl
      "
    >
      {/* ====================================== */}
      {/* LOGO */}
      {/* ====================================== */}

      <div
        className="
          px-6
          pt-8
          pb-5

          flex
          flex-col
          items-center
        "
      >
        <Link
          to="/"
          className="flex justify-center"
          onClick={scrollToTop}
        >
          <img
            src="/images/logo.png"
            alt="SattViva Naturals"
            className="
              w-[220px]
              h-auto
              object-contain
            "
          />
        </Link>
      </div>

      {/* ====================================== */}
      {/* NAVIGATION */}
      {/* ====================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-4
          py-4
          space-y-1
          hide-scrollbar
        "
      >
        {/* ==================================== */}
        {/* HOME */}
        {/* ==================================== */}

        <Link
          to="/"
          onClick={scrollToTop}
          className={`
            flex
            items-center
            gap-4

            px-4
            py-3

            rounded-xl

            transition-all
            duration-200

            ${
              location.pathname === "/"
                ? `
                  bg-white
                  text-green-800
                  shadow-lg
                `
                : `
                  text-white/80
                  hover:bg-white/10
                  hover:text-white
                `
            }
          `}
        >
          <Home size={20} />

          <span className="font-medium text-sm tracking-wide">
            Home
          </span>
        </Link>

        {/* ==================================== */}
        {/* SHOP */}
        {/* ==================================== */}

        <div
          className="relative"
          onMouseEnter={() => setShopOpen(true)}
          onMouseLeave={() => setShopOpen(false)}
        >
          <div
            className={`
              flex
              items-center
              justify-between

              px-4
              py-3

              rounded-xl

              transition-all
              duration-200

              ${
                isShopActive || shopOpen
                  ? `
                    bg-white
                    text-green-800
                    shadow-lg
                  `
                  : `
                    text-white/80
                    hover:bg-white/10
                    hover:text-white
                  `
              }
            `}
          >
            {/* SHOP LINK */}

            <Link
              to="/products"
              onClick={scrollToTop}
              className="
                flex
                items-center
                gap-4
                flex-1
              "
            >
              <ShoppingBag size={20} />

              <span className="font-medium text-sm tracking-wide">
                Shop
              </span>
            </Link>

            {/* ARROW */}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShopOpen((prev) => !prev);
              }}
              className="
                p-1
                rounded-md
                transition
                hover:bg-black/10
              "
              aria-label="Toggle shop categories"
            >
              {shopOpen ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>

          {/* ================================== */}
          {/* SHOP CATEGORIES */}
          {/* ================================== */}

          <div
            className={`
              overflow-hidden

              transition-all
              duration-300
              ease-in-out

              ${
                shopOpen
                  ? `
                    max-h-[320px]
                    opacity-100
                    mt-2
                  `
                  : `
                    max-h-0
                    opacity-0
                    mt-0
                  `
              }
            `}
          >
            <div
              className="
                ml-8
                pl-4

                border-l
                border-white/20

                space-y-1
              "
            >
              <Link
                to="/products/oils"
                onClick={() => {
                  scrollToTop();
                  setShopOpen(false);
                }}
                className={`
                  block
                  py-2
                  text-sm
                  transition

                  ${
                    location.pathname.startsWith("/products/oils")
                      ? "text-green-200 font-semibold"
                      : "text-white/70 hover:text-green-200"
                  }
                `}
              >
                Wood Pressed Oils
              </Link>

              <Link
                to="/products/dry-fruits"
                onClick={() => {
                  scrollToTop();
                  setShopOpen(false);
                }}
                className={`
                  block
                  py-2
                  text-sm
                  transition

                  ${
                    location.pathname.startsWith("/products/dry-fruits")
                      ? "text-green-200 font-semibold"
                      : "text-white/70 hover:text-green-200"
                  }
                `}
              >
                Dry Fruits
              </Link>

              <Link
                to="/products/spices"
                onClick={() => {
                  scrollToTop();
                  setShopOpen(false);
                }}
                className={`
                  block
                  py-2
                  text-sm
                  transition

                  ${
                    location.pathname.startsWith("/products/spices")
                      ? "text-green-200 font-semibold"
                      : "text-white/70 hover:text-green-200"
                  }
                `}
              >
                Spices
              </Link>

              <Link
                to="/products/health-punch"
                onClick={() => {
                  scrollToTop();
                  setShopOpen(false);
                }}
                className={`
                  block
                  py-2
                  text-sm
                  transition

                  ${
                    location.pathname.startsWith(
                      "/products/health-punch"
                    )
                      ? "text-green-200 font-semibold"
                      : "text-white/70 hover:text-green-200"
                  }
                `}
              >
                Health Punch
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================== */}
        {/* OTHER NAVIGATION */}
        {/* ==================================== */}

        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={scrollToTop}
              className={`
                flex
                items-center
                gap-4

                px-4
                py-3

                rounded-xl

                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      bg-white
                      text-green-800
                      shadow-lg
                    `
                    : `
                      text-white/80
                      hover:bg-white/10
                      hover:text-white
                    `
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium text-sm tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ====================================== */}
      {/* BOTTOM SECTION */}
      {/* ====================================== */}

      <div
        className="
          mt-auto

          p-4

          border-t
          border-white/10

          bg-black/10
          backdrop-blur-md
        "
      >
        {/* FREE SHIPPING */}

        <div
          className="
            mb-4

            flex
            items-center
            gap-3

            rounded-xl

            border
            border-white/10

            bg-white/5

            p-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-lg

              bg-white/10

              text-green-200
            "
          >
            <Truck size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Free Shipping
            </p>

            <p className="text-xs text-white/60">
              On all orders above ₹499
            </p>
          </div>
        </div>

        {/* SUPPORT */}

        <div className="mb-4 text-center">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-white/50
              mb-2
            "
          >
            Need Help?
          </p>

          <a
            href="tel:+918448349300"
            className="
              flex
              items-center
              justify-center
              gap-2

              text-sm
              font-medium

              text-green-200

              hover:text-white
              transition
            "
          >
            <Phone size={14} />

            +91 84483 49300
          </a>

          <p className="mt-1 text-[11px] text-white/50">
            Mon – Sat · 10 AM – 7 PM
          </p>
        </div>

        {/* SOCIAL LINKS */}

        <div className="flex justify-center gap-2">
          {socialLinks.map(
            ({
              icon: Icon,
              href,
              label,
            }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/10

                  bg-white/5

                  text-white/70

                  transition-all
                  duration-300

                  hover:bg-white
                  hover:text-green-800
                  hover:scale-105
                "
              >
                <Icon size={16} />
              </a>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;