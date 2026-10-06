import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  X,
} from "lucide-react";

const MobileHeader = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] =
    useState("");

  // ==========================================
  // SEARCH FUNCTIONALITY
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(
      `/products?search=${encodeURIComponent(
        query
      )}`
    );
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header
      className="
        md:hidden
        fixed
        top-0
        left-0
        right-0
        z-[999]
        w-full
        h-[72px]
        bg-background
        border-b
        border-border/80
        shadow-md
      "
    >
      <div
        className="
          w-full
          h-full
          px-4
          flex
          items-center
        "
      >
        {/* =============================== */}
        {/* SEARCH BAR */}
        {/* =============================== */}

        <form
          onSubmit={handleSearch}
          className="
            flex
            items-center
            gap-3
            w-full
            h-12
            px-4
            rounded-2xl
            bg-muted/60
            border
            border-border/70
            shadow-sm
          "
        >
          <Search
            size={19}
            className="
              shrink-0
              text-primary
            "
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search products..."
            className="
              flex-1
              min-w-0
              bg-transparent
              outline-none
              border-none
              text-sm
              text-foreground
              placeholder:text-muted-foreground
            "
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="
                flex
                items-center
                justify-center
                w-7
                h-7
                rounded-full
                text-muted-foreground
                hover:bg-background
                hover:text-foreground
                transition-colors
                shrink-0
              "
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>
    </header>
  );
};

export default MobileHeader;