
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, FlaskConical, FileCheck, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

const LabReportsPage = () => {
  const navigate = useNavigate();
  const reports = [
    {
      title: 'Wood Pressed Mustard Oil',
      lab: 'FARELABS',
      status: 'Certified Pure',
      pdfUrl: '/pds/mustardoil.pdf'
    },
    {
      title: 'Wood Pressed Groundnut Oil',
      lab: 'FARELABS',
      status: 'Certified Pure',
      pdfUrl: '/pds/groundnut.pdf'
    },
  ];

  const certifications = [
    {
      icon: ShieldCheck,
      title: 'FSSAI Licensed',
      description: 'License No: 12726998000361'
    },
    {
      icon: FlaskConical,
      title: 'Lab Tested',
      description: 'All products tested quarterly'
    },
    {
      icon: FileCheck,
      title: 'NABL Certified',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Lab Reports & Certifications - SattViva Naturals | Quality Assurance</title>
        <meta name="description" content="View our comprehensive lab reports and quality certifications. Every SattViva Naturals product is rigorously tested for purity and safety by certified laboratories." />
      </Helmet>

      <div className="bg-background">
        <div className=" py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="heading-font text-5xl md:text-6xl font-bold mb-0.5  text-balance" style={{ letterSpacing: '-0.02em' }}>
                Lab Reports & Certifications
              </h3>
              <p className="text-xl  max-w-2xl mx-auto leading-relaxed">
                Transparency you can trust. Every product is tested by certified laboratories to ensure purity, quality, and safety.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="heading-font text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Our Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-xl p-6 shadow-sm text-center"
                  >
                    <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-2">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-font text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Latest Lab Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 shadow-sm border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-card-foreground mb-2">
                        {report.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Tested: {report.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Lab: {report.lab}
                      </p>
                    </div>
                    <div className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {report.status}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => window.open(report.pdfUrl, '_blank')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 bg-muted rounded-2xl p-8 md:p-12 text-center"
          >
            <h3 className="heading-font text-2xl md:text-3xl font-bold text-foreground mb-4">
              Questions About Our Testing?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We are committed to complete transparency. If you have any questions about our lab reports or quality standards, please reach out to us.
            </p>
            <Button
  onClick={() => navigate("/contact")}
>
  Contact Us
</Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LabReportsPage;
