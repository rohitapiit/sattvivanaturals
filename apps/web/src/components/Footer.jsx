import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const footerLinks = [
     {
    name: "Home",
    path: "/",
  },
  {
    name: "Shop All",
    path: "/products",
  },
  {
    name: "Our Story",
    path: "/our-story",
  },
  {
    name: "Lab Reports",
    path: "/lab-reports",
  },
  {
    name: "Contact Us",
    path: "/contact",
  },
  {
    name: "Know Your Facility",
    path: "/know-your-facility",
  },
  
];

const socialLinks = [
  {
    icon: Facebook,
    url: "facebook page - https://www.facebook.com/profile.php?id=61592279585289",
  },
  {
    icon: Instagram,
    url: "https://www.instagram.com/sattvivanaturals?igsh=MXVnNXF2N3R0NmYxaQ==",
  },
  {
    icon: Youtube,
    url: "https://youtube.com/@sattvivanaturals?si=NbMIDWtBZRoBm_Ry",
  },
];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed Successfully",
        description: "Welcome to the SattViva family!",
      });
      setEmail('');
    }
  };

  return (
    <footer className="mt-20
    bg-gradient-to-b
    from-[#1E5D35]
    via-[#15552F]
    to-[#114626]
    text-white
    pt-20
    pb-10
    px-8
    border-t-2
    border-[#D4AF37]/30
    rounded-t-[48px]
    shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="heading-font text-3xl font-bold text-green-300 mb-1">SattViva</h2>
           
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed font-light max-w-sm">
              Bringing you the finest traditional foods, crafted with purity and care. Food the way nature intended, straight from our farms to your table.
            </p>
            <div className="flex gap-4 pt-2">
  {socialLinks.map(({ icon: Icon, url }, i) => (
    <a
      key={i}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-green-400 hover:text-green-950 transition-all duration-300"
    >
      <Icon size={18} />
    </a>
  ))}
</div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="heading-font font-semibold text-xl mb-6 text-green-300">Explore</h4>
            <ul className="space-y-3">
  {footerLinks.map((item, i) => (
    <li key={i}>
      <Link
        to={item.path}
        className="text-primary-foreground/80 hover:text-green-300 transition-colors text-sm font-light flex items-center gap-2 group"
      >
        <ArrowRight
          size={12}
          className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
        />
        {item.name}
      </Link>
    </li>
  ))}
</ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="heading-font font-semibold text-xl mb-6 text-green-300">Contact</h4> 
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80 font-light text-sm">
                <Phone size={18} className="text-green-300 shrink-0 mt-0.5" />
                <span>+91 84483 49300<br/><span className="text-xs opacity-70">Mon-Sat, 10AM-7PM</span></span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80 font-light text-sm">
                <Mail size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>contact@sattvivanaturals.com</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80 font-light text-sm">
                <MapPin size={18} className="text-green-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Plot No. S9, Panki Site 3 Industrial Area, Kanpur, Uttar Pradesh - 208022</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="heading-font font-semibold text-xl mb-6 text-green-300">Newsletter</h4>
            <p className="text-primary-foreground/80 mb-4 text-sm font-light">Subscribe for wellness tips and exclusive offers.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-11 rounded-lg focus-visible:ring-green-300"
                required
              />
              <Button type="submit" className="w-full bg-green-400 hover:bg-green-300 text-green-950 h-11 rounded-lg font-semibold tracking-wide">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent w-full mb-8" />

        <div className="border-t border-white/10 pt-6 mt-8">
  <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-primary-foreground/70">

    {/* Copyright */}
    <div className="whitespace-nowrap">
      © 2026 SattViva Naturals. All rights reserved.
    </div>

    {/* FSSAI */}
    <div className="flex items-center gap-3 whitespace-nowrap">
      <img
        src="/images/FSSAI.PNG"
        alt="FSSAI"
        className="h-7 w-auto"
      />

      <span>
        FSSAI Lic. No.{" "}
        <span className="font-semibold text-white">
        12726998000361
        </span>
      </span>
    </div>

    {/* Policies */}
    <div className="flex items-center gap-6 whitespace-nowrap">
      <Link
        to="/privacy"
        className="hover:text-green-300 transition-colors"
      >
        Privacy Policy
      </Link>

      <Link
        to="/terms"
        className="hover:text-green-300 transition-colors"
      >
        Terms of Service
      </Link>
    </div>

  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;
