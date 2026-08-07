
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const OurStoryPage = () => {
  const sections = [
    {
      title: 'A Shift in Perspective',
      content: 'In a world moving faster than ever, we found ourselves questioning what we were putting into our bodies. The shelves were filled with products claiming to be healthy, yet the ingredient lists told a different story. We realized that somewhere along the way, food had lost its connection to nature.',
      image: '/images/WhatsApp Image 2026-07-24 at 23.43.39 (1).jpeg',
      reverse: false
    },
    {
      title: 'From Thought to Action',
      content: 'This realization sparked a journey back to our roots. We visited villages where traditional methods were still practiced, where oils were pressed from wood, and spices were ground fresh. We saw families who had been doing this for generations, preserving techniques that modern industry had abandoned.',
      image: '/images/WhatsApp Image 2026-07-24 at 23.43.39 (2).jpeg',
      reverse: true
    },
    {
      title: 'SattViva Naturals',
      content: 'SattViva Naturals was born from this journey. We partnered with these traditional producers, bringing their authentic products to families who, like us, wanted to return to real food. Every bottle of oil, every packet of dry fruits carries the wisdom of generations and the purity of nature.',
      image: 'images/WhatsApp Image 2026-07-24 at 23.43.39 (3).jpeg',
      reverse: false
    },
    {
      title: 'Our Commitment',
      content: 'We are committed to transparency, quality, and tradition. Every product is lab-tested, every batch is made fresh, and every ingredient is sourced ethically. We believe that food should nourish not just the body, but also the soul. It should connect us to the earth, to our heritage, and to each other.',
      image: '/images/WhatsApp Image 2026-07-24 at 23.43.39.jpeg',
      reverse: true
    },
    {
      title: 'Return to What Matters',
      content: 'Join us in this journey back to authentic nutrition. Choose food that honors tradition, respects nature, and nourishes your family. Because at SattViva Naturals, we believe that the best food is the food that nature intended.',
      image: '/images/WhatsApp Image 2026-07-24 at 23.43.40.jpeg',
      reverse: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Story - SattViva Naturals | Journey to Pure Traditional Foods</title>
        <meta name="description" content="Discover the story behind SattViva Naturals - our journey from questioning modern food to rediscovering traditional methods and bringing pure, authentic nutrition to families." />
      </Helmet>

      <div className="bg-background">
        <div className="relative h-[30vh] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1641897434555-720ccf02fe35?w=1920&h=1080&fit=crop"
            alt="Traditional village scene representing our heritage"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="heading-font text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance"
              style={{ letterSpacing: '-0.02em' }}
            >
              Our Story
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            >
              A journey back to authentic nutrition
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 ${
                section.reverse ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={section.reverse ? 'md:order-2' : ''}>
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-xl"
                />
              </div>
              <div className={section.reverse ? 'md:order-1' : ''}>
                <h2 className="heading-font text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                  {section.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <section className=" text-primary-foreground py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="heading-font text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Join Our Journey
              </h2>
              <p className="text-xl text-[#66703A] leading-relaxed">
                Every product you choose from SattViva Naturals is a step towards healthier living, a vote for traditional methods, and support for the communities that keep these practices alive. Together, we can bring real food back to our tables.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default OurStoryPage;
