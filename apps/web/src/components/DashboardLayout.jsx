import React, { useState } from "react";

import Sidebar from "./Sidebar.jsx";
import StickyHeader from "./StickyHeader.jsx";
import MobileHeader from "./MobileHeader.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import Footer from "./Footer.jsx";

const DashboardLayout = ({
  children,
  onCartOpen,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  return (
    <div
      className="
        h-[100dvh]
        overflow-hidden
        bg-background
      "
    >
      {/* ================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================= */}

      <div className="hidden md:block">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />
      </div>

      {/* ================================= */}
      {/* MOBILE HEADER */}
      {/* ================================= */}

      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* ================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ================================= */}

      <div
        id="main-content"
        className="
          h-[100dvh]
          overflow-y-auto

          pt-[118px]
          pb-[72px]

          md:ml-[280px]
          md:pt-0
          md:pb-0

          scrollbar-hide
        "
      >
        {/* =============================== */}
        {/* DESKTOP HEADER */}
        {/* =============================== */}

        <div className="hidden md:block">
          <StickyHeader
            onMenuClick={() =>
              setIsSidebarOpen(true)
            }
            onCartOpen={onCartOpen}
          />
        </div>

        {/* =============================== */}
        {/* PAGE CONTENT */}
        {/* =============================== */}

        <main className="w-full min-h-full">
          {children}
        </main>

        {/* =============================== */}
        {/* DESKTOP FOOTER */}
        {/* =============================== */}

        <div className="hidden md:block">
          <Footer />
        </div>
      </div>

      {/* ================================= */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ================================= */}

      <div className="md:hidden">
        <MobileBottomNav
          onCartOpen={onCartOpen}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;