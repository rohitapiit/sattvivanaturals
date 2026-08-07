import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategoryCards = () => {
  const categories = [
    {
      title: 'Wood Pressed Oils',
      description: 'Traditional cold-pressed oils retaining natural goodness and authentic flavors',
      image: 'https://images.unsplash.com/photo-1631722470161-de959ae7db6b?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Pure Desi Ghee',
      description: 'Handcrafted ghee made from grass-fed cow milk using ancient methods',
      image: 'https://images.unsplash.com/photo-1671507136750-05ebd0f97843?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Premium Dry Fruits',
      description: 'Carefully selected nuts and dried fruits, naturally processed for freshness',
      image: 'https://images.unsplash.com/photo-1614061811009-82760cd2e83b?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Authentic Spices',
      description: 'Freshly ground spices that bring traditional flavors to your kitchen',
      image: 'https://images.unsplash.com/photo-1592457711340-2412dc07b733?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Health Punch',
      description: 'Nutrient-rich blends crafted for wellness and vitality',
      image: 'https://images.unsplash.com/photo-1618828822641-9d30cd929aff?w=800&h=600&fit=crop',
      link: '/store'
    },
    {
      title: 'Combos & Deals',
      description: 'Thoughtfully curated bundles for complete natural nutrition',
      image: 'https://images.unsplash.com/photo-1673968796583-5c9d23b677e1?w=800&h=600&fit=crop',
      link: '/store'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          
        </motion.div>

        
      </div>
    </section>
  );
};

export default CategoryCards;