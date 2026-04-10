import { Outlet, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PublicLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/candidate', label: t('applyAsCandidate') },
    { to: '/company', label: t('postAJob') },
    { to: '/about', label: t('about') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">E</span>
              </div>
              <span className="text-xl sm:text-2xl font-semibold text-primary">Elmotalq</span>
            </Link>

            {/* Desktop Navigation & Controls */}
            <div className={`hidden md:flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Navigation */}
              <nav className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`transition-colors hover:text-primary ${
                      location.pathname === link.to
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className={isRTL ? 'text-right' : 'text-left'}>{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Controls */}
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title={theme === 'dark' ? t('lightMode') : t('darkMode')}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                  title={t('language')}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === 'ar' ? t('arabic') : t('english')}
                  </span>
                </button>
                
                {/* Admin Login */}
                <Link
                  to="/admin/login"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('adminLogin')}
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Navigation Links */}
                <nav className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        location.pathname === link.to
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Controls */}
                <div className={`flex items-center gap-3 pt-4 border-t border-border ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title={theme === 'dark' ? t('lightMode') : t('darkMode')}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Language Toggle */}
                  <button
                    onClick={toggleLanguage}
                    className={`flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                    title={t('language')}
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {language === 'ar' ? t('arabic') : t('english')}
                    </span>
                  </button>
                </div>

                {/* Admin Login Button */}
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                >
                  {t('adminLogin')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="col-span-1">
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">E</span>
                </div>
                <span className="text-xl font-semibold text-primary">Elmotalq</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('connectingTalent')}
              </p>
            </div>

            <div>
              <h4 className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('candidates')}</h4>
              <div className="space-y-2">
                <Link to="/candidate" className="block text-sm text-muted-foreground hover:text-primary">
                  {t('submitProfile')}
                </Link>
              </div>
            </div>

            <div>
              <h4 className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('companies')}</h4>
              <div className="space-y-2">
                <Link to="/company" className="block text-sm text-muted-foreground hover:text-primary">
                  {t('postRequirements')}
                </Link>
              </div>
            </div>

            <div>
              <h4 className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('about')}</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary">
                  {t('aboutUs')}
                </Link>
                <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary">
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>

          <div className={`mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            © {new Date().getFullYear()} Elmotalq. {t('allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  );
}
