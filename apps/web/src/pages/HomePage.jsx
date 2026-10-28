import React from 'react';
import Hero from '@/components/Hero.jsx';
import SeoHead from '@/components/SeoHead.jsx';
// import TrustBar from '@/components/TrustBar.jsx';

import WhyChooseUs from '@/components/WhyChooseUs.jsx';
import ReviewsSlider from '@/components/ReviewsSlider.jsx';
import CertificationSection from '@/components/CertificationSection.jsx';



const HomePage = () => {
  return (
    <>
      <SeoHead
        title="Sattviva Naturals | Traditional Oils & Natural Foods"
        description="Discover Sattviva Naturals’ range of traditional cooking oils and natural food products. Explore product details, quality information and convenient online ordering."
      />

      <div className="bg-background">
        <Hero />
        


        

        <WhyChooseUs />
        <ReviewsSlider />
        <CertificationSection />
      </div>
    </>
  );
};

export default HomePage;