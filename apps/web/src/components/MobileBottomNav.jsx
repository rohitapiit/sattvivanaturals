import React, { useState } from "react";

import {
  Home,
  Store,
  ShoppingCart,
  User,
  Package,
  MapPin,
  Star,
  LogOut,
  X,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";

const MobileBottomNav = ({
  onCartOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const [accountMenuOpen, setAccountMenuOpen] =
    useState(false);

  const cartItemCount =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(
      path
    );
  };

  const handleAccount = () => {
    if (user) {
      setAccountMenuOpen(true);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    navigate("/");
  };

  const accountItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Order History",
      path: "/my-orders",
      icon: Package,
    },
    {
      name: "My Addresses",
      path: "/addresses",
      icon: MapPin,
    },
    {
      name: "My Reviews",
      path: "/my-reviews",
      icon: Star,
    },
  ];

  return (
    <>
      {/* ===================================== */}
      {/* ACCOUNT MENU */}
      {/* ===================================== */}

      {accountMenuOpen && user && (
        <>
          {/* Overlay */}
          <div
            className="
              md:hidden
              fixed
              inset-0
              z-[110]
              bg-black/40
              backdrop-blur-[2px]
            "
            onClick={() =>
              setAccountMenuOpen(false)
            }
          />

          {/* Bottom Sheet */}
          <div
            className="
              md:hidden
              fixed
              bottom-[84px]
              left-3
              right-3
              z-[120]

              max-w-md
              mx-auto

              overflow-hidden

              rounded-[28px]

              bg-background

              border
              border-border/70

              shadow-[0_20px_60px_rgba(0,0,0,0.25)]

              animate-in
              slide-in-from-bottom-5
              duration-300
            "
          >
            {/* Handle */}
            <div className="pt-3 flex justify-center">
              <div
                className="
                  w-10
                  h-1
                  rounded-full
                  bg-muted-foreground/25
                "
              />
            </div>

            {/* Header */}
            <div
              className="
                px-5
                pt-4
                pb-4

                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-muted-foreground
                  "
                >
                  Welcome
                </p>

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-foreground
                  "
                >
                  {user?.name || "My Account"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAccountMenuOpen(false)
                }
                className="
                  w-9
                  h-9

                  rounded-full

                  bg-muted

                  flex
                  items-center
                  justify-center

                  text-muted-foreground
                "
                aria-label="Close account menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu Items */}
            <div
              className="
                px-3
                pb-3
                space-y-1
              "
            >
              {accountItems.map(
                ({
                  name,
                  path,
                  icon: Icon,
                }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() =>
                      setAccountMenuOpen(false)
                    }
                    className="
                      flex
                      items-center
                      gap-4

                      px-4
                      py-4

                      rounded-2xl

                      hover:bg-muted/70

                      transition-colors
                    "
                  >
                    <div
                      className="
                        w-10
                        h-10

                        rounded-xl

                        bg-primary/10

                        flex
                        items-center
                        justify-center

                        text-primary
                      "
                    >
                      <Icon size={19} />
                    </div>

                    <span
                      className="
                        flex-1

                        text-sm
                        font-semibold

                        text-foreground
                      "
                    >
                      {name}
                    </span>
                  </Link>
                )
              )}
            </div>

            {/* Logout */}
            <div
              className="
                px-3
                pt-1
                pb-4

                border-t
                border-border/60
              "
            >
              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full

                  flex
                  items-center
                  gap-4

                  px-4
                  py-4

                  rounded-2xl

                  text-red-600

                  hover:bg-red-50

                  transition-colors
                "
              >
                <div
                  className="
                    w-10
                    h-10

                    rounded-xl

                    bg-red-50

                    flex
                    items-center
                    justify-center
                  "
                >
                  <LogOut size={19} />
                </div>

                <span
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Logout
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ===================================== */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ===================================== */}

      <nav
        className="
          md:hidden

          fixed
          bottom-0
          left-0
          right-0

          z-[100]

          h-[72px]

          bg-background/95
          backdrop-blur-xl

          border-t
          border-border/70

          shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
        "
      >
        <div
          className="
            h-full
            max-w-md
            mx-auto

            grid
            grid-cols-4
          "
        >
          {/* Home */}
          <Link
            to="/"
            className="
              relative

              flex
              flex-col
              items-center
              justify-center

              gap-1
            "
          >
            <Home
              size={21}
              className={
                isActive("/")
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            />

            <span
              className={`
                text-[10px]
                font-medium

                ${
                  isActive("/")
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              `}
            >
              Home
            </span>

            {isActive("/") && (
              <span
                className="
                  absolute
                  top-0

                  w-10
                  h-[3px]

                  rounded-full

                  bg-primary
                "
              />
            )}
          </Link>

          {/* Shop */}
          <Link
            to="/products"
            className="
              relative

              flex
              flex-col
              items-center
              justify-center

              gap-1
            "
          >
            <Store
              size={21}
              className={
                isActive("/products") ||
                isActive("/store")
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            />

            <span
              className={`
                text-[10px]
                font-medium

                ${
                  isActive("/products") ||
                  isActive("/store")
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              `}
            >
              Shop
            </span>
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={onCartOpen}
            className="
              relative

              flex
              flex-col
              items-center
              justify-center

              gap-1
            "
          >
            <div className="relative">
              <ShoppingCart
                size={22}
                className="text-muted-foreground"
              />

              {cartItemCount > 0 && (
                <span
                  className="
                    absolute
                    -top-2
                    -right-3

                    min-w-[18px]
                    h-[18px]

                    px-1

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
                  {cartItemCount > 99
                    ? "99+"
                    : cartItemCount}
                </span>
              )}
            </div>

            <span
              className="
                text-[10px]
                font-medium
                text-muted-foreground
              "
            >
              Cart
            </span>
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={handleAccount}
            className="
              relative

              flex
              flex-col
              items-center
              justify-center

              gap-1
            "
          >
            <User
              size={21}
              className={
                isActive("/profile") ||
                isActive("/my-orders") ||
                isActive("/addresses") ||
                isActive("/my-reviews") ||
                accountMenuOpen
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            />

            <span
              className={`
                text-[10px]
                font-medium

                ${
                  isActive("/profile") ||
                  isActive("/my-orders") ||
                  isActive("/addresses") ||
                  isActive("/my-reviews") ||
                  accountMenuOpen
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              `}
            >
              Account
            </span>

            {(isActive("/profile") ||
              isActive("/my-orders") ||
              isActive("/addresses") ||
              isActive("/my-reviews") ||
              accountMenuOpen) && (
              <span
                className="
                  absolute
                  top-0

                  w-10
                  h-[3px]

                  rounded-full

                  bg-primary
                "
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;