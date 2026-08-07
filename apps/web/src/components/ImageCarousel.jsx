
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1618828822641-9d30cd929aff?w=1920&h=800&fit=crop',
      title: 'Wood Pressed Oils',
      description: 'Traditional cold-pressed extraction preserving natural nutrients'
    },
    {
      image: 'https://images.unsplash.com/photo-1688105468149-2b907d67934b?w=1920&h=800&fit=crop',
      title: 'Pure Desi Ghee',
      description: 'Handcrafted in brass vessels using time-honored methods'
    },
    {
      image: 'https://images.unsplash.com/photo-1690555507642-90e2268a556a?w=1920&h=800&fit=crop',
      title: 'Premium Dry Fruits',
      description: 'Carefully selected and naturally processed for maximum freshness'
    },
    {
      image: 'https://images.unsplash.com/photo-1532666661413-871a4227e256?w=1920&h=800&fit=crop',
      title: 'Authentic Spices',
      description: 'Ground fresh to order, capturing the essence of tradition'
    },
    {
      image: 'https://images.unsplash.com/photo-1673968796583-5c9d23b677e1?w=1920&h=800&fit=crop',
      title: 'From Our Farms',
      description: 'Ethically sourced from trusted farming communities'
    }
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      return nextIndex;
    });
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [paginate]);

  return (
    <section className="relative h-[600px] overflow-hidden bg-muted">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="heading-font text-4xl md:text-5xl font-bold text-white mb-4"
              >
                {slides[currentIndex].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl"
              >
                {slides[currentIndex].description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft size={24} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
        onClick={() => paginate(1)}
      >
        <ChevronRight size={24} />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default ImageCarousel;
