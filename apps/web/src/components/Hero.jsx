import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

const Hero = () => {
  const desktopBanners = [
    "images/banner_new1.png",
    "images/banner_new2.png",
    "images/banner_new3.png",
  ];
  
  const mobileBanners = [
    "images/banner_mobile.png",
    "images/banner_mobile2.png",
    "images/banner_mobile3.png",
  ];
  
  const [currentBanner, setCurrentBanner] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % desktopBanners.length);
    }, 3000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-120px)] flex items-center">
      <div className="w-full">
      <div className="relative w-full">
          
          {/* Left Content */}
          {/* <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Traditional Goodness</span>
            </div>
            
            <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
  Wood Pressed Oils.<br />
  <span className="text-secondary">Pure By Nature.</span>
</h1>
            
            <p className="body-font text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the authentic taste and health benefits of traditionally extracted oils, pure desi ghee, and organic spices. Crafted in small batches for your family's wellness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-6 text-base rounded-full shadow-lg gold-glow">
                  Shop Oils
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/lab-reports">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-6 text-base rounded-full transition-colors">
                  <FileText className="mr-2 h-5 w-5" />
                  View Lab Reports
                </Button>
              </Link>
            </div>
          </motion.div> */}

          {/* Right Image */}
{/* main banner*/}


<Link to="/products" className="block">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative w-full cursor-pointer group"
  >


    <div
  className="
    relative
    w-full
    h-[85vh]
    sm:h-[80vh]
    md:h-[500px]
    lg:h-[650px]
    overflow-hidden
    rounded-2xl
    
    flex
    items-center
    justify-center
  "
>
      {/* Banner Image */}
      <picture>

  <source className="block w-full h-full"
    media="(max-width: 767px)"
    srcSet={mobileBanners[currentBanner]}
  />

  <img
    src={desktopBanners[currentBanner]}
    alt={`Banner ${currentBanner + 1}`}
    className="
      w-full
      h-full
      object-cover
      object-center
      transition-transform
      duration-500
      group-hover:scale-105
    "
  />

</picture>

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div> */}

      {/* Buttons
      <div className="absolute bottom-6 left-8 z-20 flex flex-wrap gap-4">

        <Link
          to="/products"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 py-6 shadow-lg"
          >
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <Link
          to="/lab-reports"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-white/90 hover:bg-white text-primary border-white rounded-full px-8 py-6 shadow-lg"
          >
            <FileText className="mr-2 h-5 w-5" />
            Show Certificates
          </Button>
        </Link>

      </div> */}

      {/* Previous */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setCurrentBanner(
            currentBanner === 0
  ? desktopBanners.length - 1
              : currentBanner - 1
          );
        }}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition"
      >
        ❮
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setCurrentBanner(
            (currentBanner + 1) % desktopBanners.length
          );
        }}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {desktopBanners.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentBanner(index);
            }}
            className={`transition-all rounded-full ${
              currentBanner === index
                ? "w-8 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>

    </div>
  </motion.div>
</Link>

        </div>
      </div>
    </section>
  );
};

export default Hero;