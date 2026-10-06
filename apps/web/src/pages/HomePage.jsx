import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero.jsx';
// import TrustBar from '@/components/TrustBar.jsx';

import WhyChooseUs from '@/components/WhyChooseUs.jsx';
import ReviewsSlider from '@/components/ReviewsSlider.jsx';
import CertificationSection from '@/components/CertificationSection.jsx';


const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SattViva Naturals | Premium Wood Pressed Oils & Traditional Foods</title>
        <meta name="description" content="Discover SattViva Naturals - Premium wood pressed oils,  organic dry fruits, and authentic spices. Food the way nature intended." />
      </Helmet>

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