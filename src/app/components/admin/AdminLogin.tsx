import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Mail, Home } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        navigate('/admin');
      } else {
        setError(response.message || t('invalidCredentials'));
      }
    } catch {
      setError(t('invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">E</span>
            </div>
            <span className="text-3xl font-bold text-primary">Elmotalq</span>
          </div>
          <p className="text-muted-foreground">{t('adminPanel')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('signIn')}</h2>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('email')}</label>
              <div className="relative">
                <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder="enter your email"
                />
              </div>
            </div>

            <div>
              <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('password')}</label>
              <div className="relative">
                <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('enterPassword')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : t('signIn')}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>{t('adminAccessOnly')}</p>
        </div>
      </motion.div>
    </div>
  );
}
