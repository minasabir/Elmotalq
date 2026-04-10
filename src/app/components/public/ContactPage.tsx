import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, MessageCircle, Loader2 } from 'lucide-react';
import { api, CompanyInfo } from '../../services/api';

export default function ContactPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getContactInfo();
      if (response.success && response.data) {
        setCompanyInfo(response.data);
      }
    } catch (err) {
      setError('Failed to load contact information');
      console.error('Error loading contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: companyInfo?.contactEmail,
      href: companyInfo?.contactEmail ? `mailto:${companyInfo.contactEmail}` : undefined,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: companyInfo?.contactPhone,
      href: companyInfo?.contactPhone ? `tel:${companyInfo.contactPhone.replace(/\s/g, '')}` : undefined,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: companyInfo?.whatsapp,
      href: companyInfo?.whatsapp ? `https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}` : undefined,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: companyInfo?.officeLocation ? 'View on Map' : undefined,
      href: companyInfo?.officeLocation,
    },
  ].filter(method => method.value !== undefined && method.href !== undefined);

  const socialLinks = [
    {
      icon: Facebook,
      label: 'Facebook',
      href: companyInfo?.facebook,
      color: 'bg-[#1877F2]',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: companyInfo?.instagram,
      color: 'bg-[#E4405F]',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: companyInfo?.linkedIn,
      color: 'bg-[#0A66C2]',
    },
  ].filter(social => social.href !== undefined);

  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-primary mb-6">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you. Reach out through any of our channels.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12 mb-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-16">
            <p className="text-destructive">{error}</p>
            <button
              onClick={loadContactInfo}
              className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={index}
                    href={method.href}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">{method.label}</h3>
                    <p className="text-sm text-muted-foreground">{method.value}</p>
                  </motion.a>
                );
              })}
            </div>

        {/* Social Media */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 border border-border text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
          <p className="text-muted-foreground mb-8">
            Stay updated with our latest opportunities and news
          </p>

          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 ${social.color} text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity`}
                  aria-label={social.label}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Office Hours */}
        {companyInfo && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 bg-secondary/50 rounded-xl p-8 border border-border"
          >
            <h3 className="text-xl font-bold mb-4 text-center">Office Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="font-medium mb-1">Sunday - Thursday</p>
                <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
              </div>
              <div className="text-center">
                <p className="font-medium mb-1">Friday - Saturday</p>
                <p className="text-muted-foreground">Closed</p>
              </div>
            </div>
          </motion.div>
        )}
          </>
        )}
      </section>
    </div>
  );
}
