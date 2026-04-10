import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function CompanyFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPhone: '',
    email: '',
    country: '',
    city: '',
    requiredJobTitle: '',
    companyIndustry: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.createCompany({
        companyName: formData.companyName,
        contactPhone: formData.contactPhone,
        email: formData.email,
        country: formData.country,
        city: formData.city,
        requiredJobTitle: formData.requiredJobTitle,
        companyIndustry: formData.companyIndustry,
      });

      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error('Error submitting company:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-card rounded-2xl p-8 border border-border text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest. Our team will review your requirements and contact you soon to discuss suitable candidates.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                companyName: '',
                contactPhone: '',
                email: '',
                country: '',
                city: '',
                requiredJobTitle: '',
                companyIndustry: '',
              });
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Company Registration</h1>
          <p className="text-muted-foreground">
            Tell us about your hiring needs and we'll find the perfect candidates
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-2xl p-8 border border-border shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                Company Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  Contact Phone <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+20 123 456 7890"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  Country <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Egypt"
                />
              </div>

              <div>
                <label className="block mb-2">
                  City <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Cairo"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">
                Required Job Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.requiredJobTitle}
                onChange={(e) => updateField('requiredJobTitle', e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Senior Software Developer"
              />
            </div>

            <div>
              <label className="block mb-2">
                Company Industry <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.companyIndustry}
                onChange={(e) => updateField('companyIndustry', e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Technology, Healthcare, Finance"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="pt-6 border-t border-border">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Info Box */}
        <div className="mt-8 bg-secondary/50 rounded-xl p-6 border border-border">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Our team will review your requirements within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>We'll match you with suitable candidates from our database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>You'll receive candidate profiles that match your criteria</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
