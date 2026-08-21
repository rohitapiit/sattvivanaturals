import React, {useState, useEffect, useRef,} from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User,ChevronDown, Package, MapPin, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { Phone } from "lucide-react";

const AnnouncementStrip = () => {
  const announcements = [
    "100% Natural & Authentic",
    "Lab Tested for Purity",
    "No Preservatives Added"
  ];

  return (
    <div className="bg-background border-b border-border py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements, ...announcements].map((text, index) => (
          <span key={index} className="mx-8 text-xs font-semibold text-primary uppercase tracking-widest flex items-center gap-4">
            {text}
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

const StickyHeader = ({ onMenuClick, onCartOpen }) => {
  const navigate = useNavigate();

const [search, setSearch] = useState("");

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
    id: 6,
    name: "Turmeric Powder",
    url: "/products/spices",
  },
  {
    id: 7,
    name: "Black Pepper",
    url: "/products/spices",
  },
  {
    id: 8,
    name: "Dry Fruits",
    url: "/products/dry-fruits",
  }
];

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);
  const { cartItems } = useCart();
 
  
const { user, logout } = useAuth();

const [showDropdown, setShowDropdown] =
  useState(false);

const firstName =
  user?.name?.split(" ")[0];

  const dropdownRef = useRef(null);

 
useEffect(() => {
  setShowDropdown(false);
}, [user]);

  useEffect(() => {
  console.log("Dropdown:", showDropdown);
}, [showDropdown]);



const handleLogout = () => {
  logout();
  navigate("/");
};

useEffect(() => {
  setShowDropdown(false);
}, [user]);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md shadow-sm flex flex-col">
      <AnnouncementStrip />
      
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-foreground hover:bg-muted"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </Button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search products, oils, spices..."
  className="pl-10 bg-card border-border focus-visible:ring-secondary rounded-full h-10 text-sm"
/>

{search.length > 0 && (
  <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">

    {filteredProducts.length > 0 ? (

      filteredProducts.map((product) => (

        <div
          key={product.id}
          onClick={() => {
            navigate(product.url);
            setSearch("");
          }}
          className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 transition-colors"
        >
          <div className="flex items-center gap-3">

            <Search
              size={16}
              className="text-green-700"
            />

            <span className="text-sm text-gray-700">
              {product.name}
            </span>

          </div>
        </div>

      ))

    ) : (

      <div className="px-4 py-3 text-gray-500 text-sm">
        No Products Found
      </div>

    )}

  </div>
)}
        </div>

        {/* Right Actions */}
        {/* Right Actions */}
<div className="flex items-center gap-4">



  {/* Cart */}
  <Button
    variant="ghost"
    size="icon"
    className="relative text-foreground hover:bg-muted rounded-full"
    onClick={onCartOpen}
  >
    <ShoppingCart size={22} />

    {cartItemCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-background">
        {cartItemCount}
      </span>
    )}
  </Button>



  {/* User */}
  {user ? (
    <div ref={dropdownRef} className="relative">
      <button
      type="button"
        onClick={(e) => {
  e.stopPropagation();
  setShowDropdown(prev => !prev);
}}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-muted shadow-sm transition"
      >
        <User size={18} />

        <span className="hidden md:block font-medium">
  {firstName}
</span>

<ChevronDown className="hidden md:block" size={16} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border z-50">

          <div className="px-4 py-3 border-b">
            <p className="font-semibold">
              Hi, {firstName}
            </p>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <User size={18} />
            My Profile
          </Link>

          <Link
            to="/my-orders"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <Package size={18} />
            Order History
          </Link>

          <Link
            to="/addresses"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <MapPin size={18} />
            My Addresses
          </Link>

          <Link
          to="/my-reviews"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
>
<Star size={18} />
  My Reviews
</Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
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
      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors"
    >
      <User size={18} />
      <span>Login / Signup</span>
    </Link>
  )}

{/* Contact */}
<Link
  to="/products"
  className="hidden lg:flex items-center justify-center
             px-6 py-2
             rounded-full
             bg-[#D4AF37]
             text-[#1E5D35]
             font-semibold
             hover:bg-[#c59d2c]
             transition-all duration-300
             shadow-md"
>
  Shop Now
</Link>

</div>
      </div>
    </header>
  );
};

export default StickyHeader;