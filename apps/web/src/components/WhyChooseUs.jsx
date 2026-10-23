import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplet, Shield, Sparkles, FlaskConical, Heart, Users } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Leaf,
      title: '100% Pure Ingredients',
      description: 'No additives, preservatives, or artificial substances. Just pure, natural goodness.'
    },
    {
      icon: Droplet,
      title: 'Small Batch Production',
      description: 'Freshly prepared in limited quantities to ensure maximum quality and freshness.'
    },
    {
      icon: Shield,
      title: 'Traditional Processing',
      description: 'Time-honored methods passed down through generations, preserving authentic flavors.'
    },
    {
      icon: Sparkles,
      title: 'No Chemicals',
      description: 'Free from harmful chemicals, pesticides, and synthetic processing agents.'
    },
    {
      icon: FlaskConical,
      title: 'Lab Tested',
      description: 'Rigorously tested for purity and quality in certified laboratories.'
    },
    {
      icon: Heart,
      title: 'Ethically Sourced',
      description: 'Supporting local farmers and sustainable agricultural practices.'
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
            Vishwas — Why Families Trust Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to purity, tradition, and your wellbeing
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