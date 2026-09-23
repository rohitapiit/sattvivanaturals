import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Package,
  MapPin,
  LogOut,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";

const AnnouncementStrip = () => {
  const announcements = [
    "100% Natural & Authentic",
    "Lab Tested for Purity",
    "No Preservatives Added",
  ];

  return (
    <div className="hidden md:block bg-background border-b border-border py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements, ...announcements].map(
          (text, index) => (
            <span
              key={index}
              className="
                mx-8
                text-xs
                font-semibold
                text-primary
                uppercase
                tracking-widest
                flex
                items-center
                gap-4
              "
            >
              {text}

              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
            </span>
          )
        )}
      </div>
    </div>
  );
};

const StickyHeader = ({ onCartOpen }) => {
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] =
    useState(false);

  const dropdownRef = useRef(null);

  const firstName =
    user?.name?.split(" ")[0];

  const cartItemCount = cartItems.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const products = [
    {
      id: 1,
      name: "Wood Pressed Mustard Oil",
      url: "/products/wood-press-oil",
    },
    {
      id: 2,
      name: "Cold Pressed Groundnut Oil",
      url: "/products/cold-press-oil",
    },
    {
      id: 3,
      name: "Cold Pressed Coconut Oil",
      url: "/products/cold-press-oil",
    },
    {
      id: 4,
      name: "Wood Pressed Sesame Oil",
      url: "/products/wood-press-oil",
    },
    {
      id: 5,
      name: "Turmeric Powder",
      url: "/products/spices",
    },
    {
      id: 6,
      name: "Black Pepper",
      url: "/products/spices",
    },
    {
      id: 7,
      name: "Dry Fruits",
      url: "/products/dry-fruits",
    },
  ];

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setShowDropdown(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProductClick = (url) => {
    navigate(url);
    setSearch("");
  };

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-30
          bg-background/95
          backdrop-blur-xl
          border-b
          border-border/70
        "
      >
        <AnnouncementStrip />

        {/* ========================= */}
        {/* MOBILE HEADER */}
        {/* ========================= */}

        <div className="md:hidden px-3 pt-3 pb-2 space-y-3">
          {/* ONE SEARCH BAR ONLY */}

          <div className="relative">
            <Search
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                h-5
                w-5
                text-muted-foreground
              "
            />

            <Input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="
                h-12
                pl-12
                pr-4
                rounded-2xl
                bg-card
                border-border
                shadow-sm
                text-sm
              "
            />

            {search.length > 0 && (
              <div
                className="
                  absolute
                  top-14
                  left-0
                  right-0
                  z-[100]
                  bg-background
                  rounded-2xl
                  border
                  border-border
                  shadow-xl
                  overflow-hidden
                "
              >
                {filteredProducts.length >
                0 ? (
                  filteredProducts.map(
                    (product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          handleProductClick(
                            product.url
                          )
                        }
                        className="
                          w-full
                          px-4
                          py-3
                          text-left
                          border-b
                          last:border-b-0
                          hover:bg-muted
                          transition
                        "
                      >
                        <div className="flex items-center gap-3">
                          <Search
                            size={16}
                            className="text-primary"
                          />

                          <span className="text-sm font-medium">
                            {product.name}
                          </span>
                        </div>
                      </button>
                    )
                  )
                ) : (
                  <div className="px-4 py-4 text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ONE LOCATION BAR ONLY */}

          <button
            type="button"
            className="
              w-full
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-border
              bg-card
              px-4
              py-3
              shadow-sm
              transition
              hover:bg-muted/60
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-primary/10
                  flex
                  items-center
                  justify-center
                "
              >
                <MapPin
                  size={19}
                  className="text-primary"
                />
              </div>

              <div className="text-left">
                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-muted-foreground
                    font-semibold
                  "
                >
                  Deliver To
                </p>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  Set delivery location
                </p>
              </div>
            </div>

            <ChevronDown
              size={18}
              className="text-muted-foreground"
            />
          </button>
        </div>

        {/* ========================= */}
        {/* DESKTOP HEADER */}
        {/* ========================= */}

        <div
          className="
            hidden
            md:flex
            px-6
            lg:px-8
            py-4
            items-center
            justify-between
            gap-5
          "
        >
          {/* Desktop Search */}

          <div className="flex-1 max-w-md relative">
            <Search
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                h-4
                w-4
                text-muted-foreground
              "
            />

            <Input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products, oils, spices..."
              className="
                pl-11
                rounded-full
                h-11
                bg-card
                shadow-sm
              "
            />

            {search.length > 0 && (
              <div
                className="
                  absolute
                  top-13
                  left-0
                  right-0
                  z-[100]
                  bg-background
                  rounded-xl
                  shadow-xl
                  border
                  overflow-hidden
                "
              >
                {filteredProducts.length >
                0 ? (
                  filteredProducts.map(
                    (product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          handleProductClick(
                            product.url
                          )
                        }
                        className="
                          w-full
                          px-4
                          py-3
                          text-left
                          hover:bg-muted
                          border-b
                          last:border-b-0
                        "
                      >
                        {product.name}
                      </button>
                    )
                  )
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Actions */}

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="
                relative
                rounded-full
                hover:bg-muted
              "
              onClick={onCartOpen}
            >
              <ShoppingCart size={21} />

              {cartItemCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    h-5
                    w-5
                    rounded-full
                    bg-secondary
                    text-secondary-foreground
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartItemCount}
                </span>
              )}
            </Button>

            {user ? (
              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowDropdown(
                      (prev) => !prev
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-full
                    border
                    bg-card
                    hover:bg-muted
                    shadow-sm
                  "
                >
                  <User size={18} />

                  <span className="font-medium">
                    {firstName}
                  </span>

                  <ChevronDown size={16} />
                </button>

                {showDropdown && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-3
                      w-56
                      bg-background
                      rounded-xl
                      shadow-xl
                      border
                      overflow-hidden
                      z-50
                    "
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">
                        Hi, {firstName}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                    >
                      <User size={18} />
                      My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                    >
                      <Package size={18} />
                      Order History
                    </Link>

                    <Link
                      to="/addresses"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                    >
                      <MapPin size={18} />
                      My Addresses
                    </Link>

                    <Link
                      to="/my-reviews"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                    >
                      <Star size={18} />
                      My Reviews
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        text-red-600
                        hover:bg-red-50
                      "
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="
                  flex
                  items-center
                  gap-2
                  font-medium
                  hover:text-secondary
                "
              >
                <User size={18} />
                Login / Signup
              </Link>
            )}

            <Link
              to="/products"
              className="
                px-6
                py-2.5
                rounded-full
                bg-[#D4AF37]
                text-[#1E5D35]
                font-semibold
                shadow-md
                hover:bg-[#c59d2c]
                transition
              "
            >
              Shop Now
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default StickyHeader;