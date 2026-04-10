import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Target, Users, Award, Loader2 } from 'lucide-react';
import { api, CompanyInfo } from '../../services/api';

export default function AboutPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAboutInfo();
  }, []);

  const loadAboutInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAboutInfo();
      if (response.success && response.data) {
        setCompanyInfo(response.data);
      }
    } catch (err) {
      setError('Failed to load company information');
      console.error('Error loading about info:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold mb-6">About Elmotalq</h1>
            {companyInfo?.companyDescription ? (
              <p className="text-xl text-primary-foreground/90">
                {companyInfo.companyDescription}
              </p>
            ) : (
              <p className="text-xl text-primary-foreground/70">Loading company information...</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        {/* Loading & Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <p className="text-destructive">{error}</p>
            <button
              onClick={loadAboutInfo}
              className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Office Location */}
        {!loading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Our Office</h3>
                <p className="text-muted-foreground">
                  Visit us at our headquarters or reach out through any of our contact channels
                </p>
              </div>
            </div>

            {companyInfo?.officeLocation ? (
              <a
                href={companyInfo.officeLocation}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-primary/10 hover:bg-primary/20 rounded-xl h-64 flex items-center justify-center transition-colors"
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-primary font-medium">View Office Location on Map</p>
                  <p className="text-sm text-primary/70 mt-2">Opens in new tab</p>
                </div>
              </a>
            ) : (
              <div className="bg-muted rounded-xl h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Office Location Map</p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
