import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Droplet, Shield, ShoppingBag, Sparkles, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Product Details',
      description: 'Review the product description, ingredients and available pack sizes.'
    },
    {
      icon: Droplet,
      title: 'Choices for Everyday Cooking',
      description: 'Browse the current product range and compare available options.'
    },
    {
      icon: Shield,
      title: 'Clear Product Information',
      description: 'Check the details shown on each product page before you order.'
    },
    {
      icon: Sparkles,
      title: 'Questions About Products?',
      description: 'Contact our team if you need more information before ordering.'
    },
    {
      icon: ShoppingBag,
      title: 'Online Ordering',
      description: 'View current prices, availability and purchase options on product pages.'
    },
    {
      icon: Users,
      title: 'Customer Support',
      description: 'Get in touch with our team for help with products or orders.'
    },
    
  ];

  return (
    <section className="mt-8 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-clip-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Why Shop with Sattviva Naturals?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse product details, available pack sizes and ordering information to choose what suits your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="heading-font text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;