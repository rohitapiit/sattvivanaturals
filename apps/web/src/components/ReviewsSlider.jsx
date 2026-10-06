import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Star,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const ReviewsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isExpanded, setIsExpanded] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // ================================
  // FETCH REAL CUSTOMER REVIEWS
  // ================================

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API}/reviews/customer-testimonials`
        );

        const data = await response.json();

        if (data.success) {
          setReviews(data.testimonials || []);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error(
          "FETCH CUSTOMER TESTIMONIALS ERROR:",
          error
        );

        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [API]);

  // ================================
  // RESET INDEX IF REVIEWS CHANGE
  // ================================

  useEffect(() => {
    if (
      currentIndex >= reviews.length &&
      reviews.length > 0
    ) {
      setCurrentIndex(0);
    }
  }, [reviews.length, currentIndex]);


  useEffect(() => {
  setIsExpanded(false);
}, [currentIndex]);

  // ================================
  // SLIDER
  // ================================

  const paginate = useCallback(
    (newDirection) => {
      if (reviews.length <= 1) return;

      setCurrentIndex((prevIndex) => {
        let nextIndex =
          prevIndex + newDirection;

        if (nextIndex < 0) {
          nextIndex = reviews.length - 1;
        }

        if (nextIndex >= reviews.length) {
          nextIndex = 0;
        }

        return nextIndex;
      });
    },
    [reviews.length]
  );

  // ================================
  // AUTO SLIDE
  // ================================

  useEffect(() => {
    if (reviews.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 6000);

    return () => clearInterval(timer);
  }, [paginate, reviews.length]);

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>

            <p className="text-lg text-muted-foreground">
              Real experiences from families who trust SattViva Naturals
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card/50 rounded-2xl p-12 shadow-xl border border-border text-center">
              <p className="text-muted-foreground">
                Loading customer reviews...
              </p>
            </div>
          </div>

        </div>
      </section>
    );
  }

  // ================================
  // NO REVIEWS
  // ================================

  if (reviews.length === 0) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from families who trust SattViva Naturals
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card/50 rounded-2xl p-12 shadow-xl border border-border text-center">
              <p className="text-muted-foreground">
                Be the first to share your experience with SattViva Naturals.
              </p>
            </div>
          </div>

        </div>
      </section>
    );
  }

  const currentReview =
    reviews[currentIndex];

    const reviewWords = currentReview.review
  ? currentReview.review.trim().split(/\s+/)
  : [];

const isLongReview = reviewWords.length > 40;

const displayedReview = isLongReview
  ? reviewWords.slice(0, 40).join(" ")
  : currentReview.review;

  return (
    <section className="py-24 bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================
            HEADING
        ================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
          }}
          className="text-center mb-16"
        >

          <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            What Our Customers Say
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from families who trust SattViva Naturals
          </p>

        </motion.div>

        {/* ================================
            SLIDER
        ================================= */}

        <div className="relative max-w-4xl mx-auto">

          <AnimatePresence mode="wait">

            <motion.div
              key={currentReview._id}
              initial={{
                opacity: 0,
                x: 100,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -100,
              }}
              transition={{
                duration: 0.5,
              }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-border"
            >

              <div className="flex flex-col items-center gap-6">

                {/* ================================
                    RATING
                ================================= */}

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= currentReview.rating
                            ? "fill-secondary text-secondary"
                            : "text-border"
                        }`}
                      />
                    )
                  )}

                </div>

                {/* ================================
                    REVIEW
                ================================= */}

               <div className="max-w-3xl text-center">

  <p className="text-lg md:text-xl text-card-foreground leading-relaxed italic">
    "
    {isExpanded
      ? currentReview.review
      : displayedReview}
    {isLongReview && !isExpanded && "..."}
    "
  </p>

  {isLongReview && (
    <button
      type="button"
      onClick={() => setIsExpanded((prev) => !prev)}
      className="mt-2 text-sm font-semibold text-primary hover:underline"
    >
      {isExpanded ? "Read less" : "Read more"}
    </button>
  )}

</div>

                {/* ================================
                    CUSTOMER
                ================================= */}

                <div className="flex flex-col items-center gap-2">

                  <p className="font-semibold text-card-foreground text-lg">
                    {currentReview.name}
                  </p>

                  {currentReview.verified ? (
                    <div className="flex items-center gap-1 text-primary text-sm">

                      <BadgeCheck className="h-4 w-4" />

                      <span className="font-medium">
                        Verified Customer
                      </span>

                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Customer Review
                    </p>
                  )}

                </div>

              </div>

            </motion.div>

          </AnimatePresence>

          {/* ================================
              LEFT BUTTON
          ================================= */}

          {reviews.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-card hover:bg-card/80 shadow-lg"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={24} />
            </Button>
          )}

          {/* ================================
              RIGHT BUTTON
          ================================= */}

          {reviews.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-card hover:bg-card/80 shadow-lg"
              onClick={() => paginate(1)}
            >
              <ChevronRight size={24} />
            </Button>
          )}

          {/* ================================
              DOTS
          ================================= */}

          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">

              {reviews.map((review, index) => (
                <button
                  key={review._id}
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  className={`h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-border w-3"
                  }`}
                  aria-label={`Go to review ${
                    index + 1
                  }`}
                />
              ))}

            </div>
          )}

        </div>

      </div>

    </section>
  );
};

export default ReviewsSlider;