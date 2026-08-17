import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, ShoppingBag, BookOpen, FileText, User,
  Leaf, MessageSquare, HelpCircle, Phone,
  Instagram, Facebook, Youtube, MessageCircle, X, Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const scrollToTop = () => {
    const container = document.getElementById("main-content");

    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const [shopOpen, setShopOpen] = useState(false);
  const [oilsOpen, setOilsOpen] = useState(false);
  const [dryFruitsOpen, setDryFruitsOpen] = useState(false);

  const navItems = [
    { name: 'Our Story', path: '/our-story', icon: BookOpen },
    { name: 'Lab Reports', path: '/lab-reports', icon: FileText },
    { name: 'Contact Us', path: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-[100dvh] w-[280px] z-50
        bg-gradient-to-b from-green-800 via-green-800 to-green-800 text-white
        shadow-2xl md:shadow-none
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Top Section: Logo & Tagline */}
        <div className="p-8 flex flex-col items-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-10 right-10 md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onClose}
          >
            <X size={20} />
          </Button>

          <Link
            to="/"
            className="flex flex-col items-center text-center"
            onClick={onClose}
          >
            {/* Logo */}
            <img
              src="/images/logo.png"
              alt="SattViva Logo"
              className="w-80 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 hide-scrollbar space-y-1">

          {/* Home */}
          <Link
            to="/"
            onClick={() => {
              const container = document.getElementById("main-content");

              if (container) {
                container.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }

              onClose?.();
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-primary-foreground/80 hover:bg-green-700/40"
          >
            <Home size={20} />
            <span className="font-medium text-sm tracking-wide">
              Home
            </span>
          </Link>

          {/* Shop Dropdown */}

          {/*Oils Submenu*/}

          <div
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <div
              className="
                group
                flex items-center justify-between w-full px-4 py-3 rounded-xl
                text-primary-foreground/80
                cursor-pointer
                transition-all duration-300
                hover:bg-gradient-to-r
                hover:from-green-700/40
                hover:to-green-600/20
                hover:text-green-300
                hover:translate-x-1
                hover:shadow-lg
                hover:shadow-green-900/30
              "
            >

              <Link
                to="/products"
                onClick={() => {
                  const container = document.getElementById("main-content");

                  if (container) {
                    container.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }
                }}
                className="flex items-center gap-4 flex-1"
              >
                <ShoppingBag
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span className="font-medium text-sm tracking-wide transition-colors duration-300">
                  Shop
                </span>
              </Link>

              <button type="button">
                {shopOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                shopOpen
                  ? "max-h-[500px] opacity-100 mt-2"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div className="ml-10 mt-2 border-green-700 pl-4 space-y-2">

                <div>
                  <div className="flex items-center justify-between">

                    <Link
                      to="/products/oils"
                      className="block text-sm text-primary-foreground/70 hover:text-green-300"
                    >
                     Wood Pressed Oils
                    </Link>

                  </div>

                  {oilsOpen && (
                    <div className="ml-6 mt-2 space-y-1">
                      {/* 
                      <Link
                        to="/products/oils/wood-press-oil"
                        className="block w-full py-1 text-sm text-primary-foreground/60 hover:text-green-300"
                        onClick={onClose}
                      >
                        Wood Press Oil
                      </Link>

                      <Link
                        to="/products/oils/cold-press-oil"
                        className="block w-full py-1 text-sm text-primary-foreground/60 hover:text-green-300"
                        onClick={onClose}
                      >
                        Cold Press Oil
                      </Link> 
                      */}
                    </div>
                  )}
                </div>

                {/*Dry fruits Submenu*/}
                <div>
                  <div className="flex items-center justify-between">

                    <Link
                      to="/products/dry-fruits"
                      className="block text-sm text-primary-foreground/70 hover:text-green-300"
                    >
                      Dry Fruits
                    </Link>

                  </div>

                  {dryFruitsOpen && (
                    <div className="ml-6 mt-2 border-green-600 pl-3 space-y-2">

                    </div>
                  )}
                </div>

                <Link
                  to="/products/spices"
                  className="block text-sm text-primary-foreground/70 hover:text-green-300"
                  onClick={onClose}
                >
                  Spices
                </Link>

                <Link
                  to="/products/health-punch"
                  className="block text-sm text-primary-foreground/70 hover:text-green-300"
                  onClick={onClose}
                >
                  Health Punch
                </Link>

              </div>
            </div>
          </div>

          {/* Existing Menu Items */}
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  scrollToTop();
                  onClose?.();
                }}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-background text-primary shadow-md'
                    : 'text-primary-foreground/80 hover:bg-green-700/40 hover:text-primary-foreground'
                  }
                `}
              >
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'group-hover:scale-110 group-hover:text-green-300'
                  }`}
                />

                <span className="font-medium text-sm tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-4 mt-auto bg-black/ backdrop-blur-sm">

          {/* Free Shipping Card */}
          <div className="bg-primary-foreground/5 border border-secondary/10 rounded-xl p-2 flex items-start gap-1">
            <div className="bg-secondary/20 p-2 rounded-lg text-green-300">
              <Truck size={18} />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-primary-foreground mb-1">
                Free Shipping
              </h4>

              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                On all orders above ₹499
              </p>
            </div>
          </div>

          {/* Need Help */}
          <div className="text-center space-y-1">
            <p className="text-xs text-primary-foreground/60 uppercase tracking-wider font-semibold mb-2">
              Need Help?
            </p>

            <a
              href="tel:+919876543210"
              className="text-green-300 font-medium hover:underline flex items-center justify-center gap-2"
            >
              <Phone size={14} />
              +91 84483 49300
            </a>

            <p className="text-xs text-primary-foreground/50">
              10 AM to 7 PM Monday to Saturday
            </p>
          </div>

          {/* Social Icons */}
          {/* Social Icons */}
          <div className="flex justify-center gap-3 pt-2">

            {[
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
                href: "https://wa.me/918448349300?text=Hi%20%F0%9F%91%8B%0A%0AWelcome%20to%20Sattviva%20Naturals.%20Thank%20you%20for%20reaching%20out.%0A%0AHow%20may%20I%20help%20you%20today%3F",
                label: "WhatsApp",
              },
              {
                icon: Youtube,
                href: "https://youtube.com/@sattvivanaturals?si=NbMIDWtBZRoBm_Ry",
                label: "YouTube",
              },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="
                  w-10 h-10
                  rounded-full
                  border border-white/20
                  bg-white/10
                  flex items-center justify-center
                  text-white/80
                  transition-all duration-300
                  hover:bg-[#D4AF37]
                  hover:text-[#14532D]
                  hover:scale-110
                  hover:shadow-lg
                "
              >
                <Icon size={18} />
              </a>
            ))}

          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;