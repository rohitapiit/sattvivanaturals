import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReviewsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      review: 'The wood pressed groundnut oil has transformed our cooking. You can taste the difference in every dish. My family loves it!',
      verified: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      name: 'Anita Desai',
      location: 'Bangalore',
      rating: 5,
      review: 'The quality of dry fruits is exceptional. Fresh, naturally processed, and delivered with care. Highly recommend!',
      verified: true,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    },
    {
      name: 'Vikram Singh',
      location: 'Jaipur',
      rating: 5,
      review: 'Switched to SattViva for all our cooking oils. The purity and traditional methods make a real difference in our health.',
      verified: true,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    }
  ];

  const paginate = useCallback((newDirection) => {
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = reviews.length - 1;
      if (nextIndex >= reviews.length) nextIndex = 0;
      return nextIndex;
    });
  }, [reviews.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);

    return () => clearInterval(timer);
  }, [paginate]);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from families who trust SattViva Naturals
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-border"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src={reviews[currentIndex].image}
                  alt={reviews[currentIndex].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                    {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  
                  <p className="text-lg text-card-foreground mb-6 leading-relaxed italic">
                    "{reviews[currentIndex].review}"
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {reviews[currentIndex].name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reviews[currentIndex].location}
                      </p>
                    </div>
                    {reviews[currentIndex].verified && (
                      <div className="flex items-center gap-1 text-primary text-sm">
                        <BadgeCheck className="h-4 w-4" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-card hover:bg-card/80 shadow-lg"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-card hover:bg-card/80 shadow-lg"
            onClick={() => paginate(1)}
          >
            <ChevronRight size={24} />
          </Button>

          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-8' : 'bg-border'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;