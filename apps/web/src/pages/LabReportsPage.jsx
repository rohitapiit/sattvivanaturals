import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Download,
  ShieldCheck,
  FlaskConical,
  FileCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const LabReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${API}/lab-reports/active`);
        const data = await response.json();

        if (data.success) {
          setReports(data.reports || []);
        }
      } catch (error) {
        console.error("FETCH LAB REPORTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const certifications = [
    {
      icon: ShieldCheck,
      title: "FSSAI Licensed",
      description: "License No: 12726998000361",
    },
    {
      icon: FlaskConical,
      title: "Lab Tested",
      description: "All products tested quarterly",
    },
    {
      icon: FileCheck,
      title: "NABL Certified",
      description: "Testing through certified laboratories",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Lab Reports & Certifications - SattViva Naturals</title>
        <meta
          name="description"
          content="View SattViva Naturals lab reports and quality certifications."
        />
      </Helmet>

      <div className="bg-background">
        <div className="py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3
                className="heading-font text-5xl md:text-6xl font-bold mb-1 text-balance"
                style={{ letterSpacing: "-0.02em" }}
              >
                Lab Reports & Certifications
              </h3>
              <p className="text-xl max-w-2xl mx-auto leading-relaxed">
                Transparency you can trust. Every product is tested by certified
                laboratories to ensure purity, quality, and safety.
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
                    key={cert.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-xl p-6 shadow-sm text-center"
                  >
                    <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.description}
                    </p>
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

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No lab reports are currently available.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, index) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-xl p-6 shadow-sm border border-border"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-card-foreground mb-2">
                          {report.title}
                        </h3>
                        {report.date && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Tested: {report.date}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Lab: {report.lab}
                        </p>
                      </div>

                      <div className="shrink-0 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                        {report.status}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() =>
                        window.open(report.pdfUrl, "_blank", "noopener,noreferrer")
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LabReportsPage;
