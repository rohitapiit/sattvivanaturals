import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CertificationSection = () => {
  const qualityInformation = [
    {
      icon: FileCheck,
      title: 'Product Information',
      description: 'Review the product details and ingredients shown on each product page.'
    },
    {
      icon: ShieldCheck,
      title: 'Published Reports',
      description: 'Review reports and supporting documents currently available on our site.'
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
          <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Product Quality Information
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review product information and the reports currently available.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {qualityInformation.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
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
                  {item.title}
                </h3>
                <p className="text-#6F7346 text-sm leading-relaxed">
                  {item.description}
                </p>
                {index === 1 && (
                  <Link
                    to="/lab-reports"
                    className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4"
                  >
                    View quality reports
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;