import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, FlaskConical, BadgeCheck } from 'lucide-react';

const CertificationSection = () => {
  const certifications = [
    {
      icon: Award,
      title: 'FSSAI Certified',
      description: 'Licensed by Food Safety and Standards Authority of India'
    },
    {
      icon: ShieldCheck,
      title: 'Organic Certified',
      description: 'Verified organic ingredients and processing methods'
    },
    {
      icon: FlaskConical,
      title: 'Lab Tested',
      description: 'Rigorously tested for purity and quality standards'
    },
    {
      icon: BadgeCheck,
      title: 'Quality Assured',
      description: 'Meets highest quality benchmarks and safety protocols'
    }
  ];

  return (
    <section className="py-2 bg-gradient-to-b ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Certified Excellence
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to quality is backed by recognized certifications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 border border-green-300/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="heading-font text-xl font-semibold mb-3">
                  {cert.title}
                </h3>
                <p className="text-#6F7346 text-sm leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;