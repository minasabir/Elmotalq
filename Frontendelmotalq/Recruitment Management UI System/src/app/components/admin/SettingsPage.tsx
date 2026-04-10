import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Building2, MapPin, Loader2 } from 'lucide-react';
import { api, CompanyInfo } from '../../services/api';

export default function SettingsPage() {
  const [aboutData, setAboutData] = useState({
    companyDescription: '',
    officeLocation: '',
  });

  const [contactData, setContactData] = useState({
    facebook: '',
    instagram: '',
    whatsapp: '',
    linkedin: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAboutInfo();
      if (response.success && response.data) {
        const data = response.data;
        setAboutData({
          companyDescription: data.companyDescription || '',
          officeLocation: data.officeLocation || '',
        });
        setContactData({
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          whatsapp: data.whatsapp || '',
          linkedin: data.linkedIn || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
        });
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAbout(true);
      const response = await api.updateAboutInfo({
        companyDescription: aboutData.companyDescription,
        officeLocation: aboutData.officeLocation,
      });
      if (response.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError('Failed to save about settings');
      console.error('Error saving about settings:', err);
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingContact(true);
      const response = await api.updateContactInfo({
        facebook: contactData.facebook,
        instagram: contactData.instagram,
        whatsapp: contactData.whatsapp,
        linkedIn: contactData.linkedin,
        contactEmail: contactData.contactEmail,
        contactPhone: contactData.contactPhone,
      });
      if (response.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError('Failed to save contact settings');
      console.error('Error saving contact settings:', err);
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage company information and public pages</p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4"
        >
          {error}
          <button
            onClick={loadSettings}
            className="ml-4 px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-primary/10 border border-primary/20 text-primary rounded-lg p-4"
        >
          Settings saved successfully!
        </motion.div>
      )}

      {/* About Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">About Page Settings</h3>
              <p className="text-sm text-muted-foreground">
                Information displayed on the public About page
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveAbout} className="p-6 space-y-6">
          <div>
            <label className="block mb-2">Company Description</label>
            <textarea
              value={aboutData.companyDescription}
              onChange={(e) =>
                setAboutData({ ...aboutData, companyDescription: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Enter company description"
            />
            <p className="text-sm text-muted-foreground mt-2">
              This text will be displayed on the About page
            </p>
          </div>

          <div>
            <label className="block mb-2">Office Location (Google Maps URL)</label>
            <input
              type="url"
              value={aboutData.officeLocation}
              onChange={(e) => setAboutData({ ...aboutData, officeLocation: e.target.value })}
              className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://maps.google.com/..."
            />
            <p className="text-sm text-muted-foreground mt-2">
              Paste a Google Maps link or coordinates
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={savingAbout}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingAbout ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savingAbout ? 'Saving...' : 'Save About Settings'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact Page Settings</h3>
              <p className="text-sm text-muted-foreground">
                Contact information and social media links
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveContact} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Contact Email</label>
              <input
                type="email"
                value={contactData.contactEmail}
                onChange={(e) => setContactData({ ...contactData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="info@elmotalq.com"
              />
            </div>

            <div>
              <label className="block mb-2">Contact Phone</label>
              <input
                type="tel"
                value={contactData.contactPhone}
                onChange={(e) => setContactData({ ...contactData, contactPhone: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+20 123 456 7890"
              />
            </div>

            <div>
              <label className="block mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={contactData.whatsapp}
                onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+20 123 456 7890"
              />
            </div>

            <div>
              <label className="block mb-2">Facebook URL</label>
              <input
                type="url"
                value={contactData.facebook}
                onChange={(e) => setContactData({ ...contactData, facebook: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block mb-2">Instagram URL</label>
              <input
                type="url"
                value={contactData.instagram}
                onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={contactData.linkedin}
                onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={savingContact}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingContact ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {savingContact ? 'Saving...' : 'Save Contact Settings'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Info Box */}
      <div className="bg-secondary/50 rounded-xl p-6 border border-border">
        <h3 className="font-medium mb-2">Note</h3>
        <p className="text-sm text-muted-foreground">
          Changes to these settings will be immediately reflected on the public-facing About and
          Contact pages. Make sure all information is accurate before saving.
        </p>
      </div>
    </div>
  );
}
