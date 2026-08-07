import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ProductCatalog from '@/pages/ProductCatalog.jsx';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Shop All Products - SattViva Naturals | Wood Pressed Oils, & More</title>
        <meta name="description" content="Browse our complete collection of wood pressed oils, organic dry fruits, authentic spices, and health products. Free shipping above ₹499." />
      </Helmet>

      <div className="bg-background">
        <div className="bg-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="heading-font text-5xl md:text-6xl font-bold mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                Shop All Products
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Discover our complete collection of traditional, pure, and authentic foods
              </p>
            </motion.div>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default StorePage;