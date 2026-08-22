import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const MarqueeBanner = () => {
  const offers = [
    'Free Shipping Above ₹499',
    '100% Wood Pressed Oils',
    'No Chemicals. No Adulteration.',
    'Tradition Meets Wellness',
    'Freshly Prepared in Small Batches'
  ];

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...offers, ...offers].map((offer, index) => (
          <span key={index} className="mx-8 text-sm font-medium tracking-wide">
            {offer}
          </span>
        ))}
      </div>
    </div>
  );
};

const MegaMenu = ({ isOpen, onClose }) => {
  const categories = [
    { name: 'Wood Pressed Oils', image: 'https://images.unsplash.com/photo-1631722470161-de959ae7db6b?w=400&h=300&fit=crop', link: '/products' },
    { name: 'Pure Ghee', image: 'https://images.unsplash.com/photo-1671507136750-05ebd0f97843?w=400&h=300&fit=crop', link: '/products' },
    { name: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1614061811009-82760cd2e83b?w=400&h=300&fit=crop', link: '/products' },
    { name: 'Spices', image: 'https://images.unsplash.com/photo-1592457711340-2412dc07b733?w=400&h=300&fit=crop', link: '/products' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 bg-background border-t border-border shadow-xl z-50"
          onMouseLeave={onClose}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={category.link}
                  className="group"
                  onClick={onClose}
                >
                  <div className="relative overflow-hidden rounded-xl premium-card">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white heading-font font-semibold text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Header = ({ onCartOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', path: '/products' },
    { name: 'Shop Categories', hasMegaMenu: true },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Lab Reports', path: '/lab-reports' },
    { name: 'Sattva', path: '/sattva' }
  ];

  return (
    <>
      <MarqueeBanner />
      <motion.header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-background'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link to="/" className="flex items-center">
              <img 
                src="https://horizons-cdn.hostinger.com/4a595910-9b19-4db2-a593-b4828ae9ff0c/2a3f215d93744f773c1906e1da5a49a1.jpg" 
                alt="SattViva Naturals Premium Logo" 
                className="h-12 md:h-16 w-auto object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div key={index} className="relative">
                  {link.hasMegaMenu ? (
                    <button
                      onMouseEnter={() => setMegaMenuOpen(true)}
                      className="flex items-center gap-1 text-foreground hover:text-secondary transition-colors font-medium tracking-wide uppercase text-sm"
                    >
                      {link.name}
                      <ChevronDown size={16} />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-foreground hover:text-secondary transition-colors font-medium tracking-wide uppercase text-sm ${
                        location.pathname === link.path ? 'text-secondary border-b-2 border-secondary' : ''
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hidden md:flex text-foreground hover:text-secondary">
                <Search size={20} />
              </Button>
              <Link to="/login">
              <Button variant="ghost" size="icon" className="hidden md:flex text-foreground hover:text-secondary">
                <User size={20} />
              </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground hover:text-secondary"
                onClick={onCartOpen}
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:text-secondary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <nav className="px-4 py-6 space-y-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path || '/products'}
                    className="block text-foreground hover:text-secondary transition-colors font-medium py-2 uppercase tracking-wide text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;