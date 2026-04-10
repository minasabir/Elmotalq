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
            <p className="text-xl text-primary-foreground/90">
              {companyInfo?.companyDescription || 'We are a leading recruitment platform connecting exceptional talent with outstanding opportunities across the region.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded with a vision to transform the recruitment industry, Elmotalq has grown to become a trusted partner for companies and candidates alike.
              </p>
              <p>
                We understand that finding the right job or the perfect candidate is more than just matching skills on paper. It's about finding the right fit—culturally, professionally, and personally.
              </p>
              <p>
                Our team of experienced recruitment specialists works tirelessly to ensure every match we make creates lasting value for both candidates and employers.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 border border-border"
          >
            <h3 className="text-2xl font-bold mb-6">Our Values</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Excellence</h4>
                  <p className="text-sm text-muted-foreground">
                    We strive for excellence in every placement
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">People First</h4>
                  <p className="text-sm text-muted-foreground">
                    Our candidates and clients are at the heart of everything we do
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Integrity</h4>
                  <p className="text-sm text-muted-foreground">
                    We operate with transparency and honesty
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
              <div className="bg-muted rounded-xl h-64 overflow-hidden">
                <iframe
                  src={companyInfo.officeLocation}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
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
