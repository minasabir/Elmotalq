import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Users, Building2, UserCircle, Settings, Home, LogOut, Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useState({ name: 'Admin User', role: 'Owner' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isRTL } = useLanguage();

  const sidebarLinks = [
    { to: '/admin', label: t('dashboard'), icon: Home, exact: true },
    { to: '/admin/candidates', label: t('candidates'), icon: Users },
    { to: '/admin/companies', label: t('companies'), icon: Building2 },
    { to: '/admin/employees', label: t('employees'), icon: UserCircle },
    { to: '/admin/settings', label: t('settings'), icon: Settings },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b border-border px-4 py-4 sticky top-0 z-50">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <div>
              <div className="text-lg font-semibold">Elmotalq</div>
              <div className="text-xs text-muted-foreground">{t('dashboard')}</div>
            </div>
          </div>

          {/* Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`md:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col shadow-lg z-50 ${isRTL ? 'border-l' : 'border-r'}`}
            >
              {/* Mobile Sidebar Content */}
              <div className="p-6 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                    <span className="text-sidebar-primary-foreground font-bold text-xl">E</span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Elmotalq</div>
                    <div className="text-xs text-sidebar-foreground/70">{t('dashboard')}</div>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.to, link.exact);

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className={isRTL ? 'text-right' : 'text-left'}>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-sidebar-border">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-sidebar-foreground/70">{user.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
                    title={t('logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`hidden md:flex w-64 bg-sidebar text-sidebar-foreground flex-col shadow-lg ${isRTL ? 'border-l' : 'border-r'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-xl">E</span>
            </div>
            <div>
              <div className="text-lg font-semibold">Elmotalq</div>
              <div className="text-xs text-sidebar-foreground/70">{t('dashboard')}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to, link.exact);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={isRTL ? 'text-right' : 'text-left'}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-sidebar-foreground/70">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 sm:px-8 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <h1 className={`text-lg sm:text-xl font-semibold text-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {sidebarLinks.find((link) => isActive(link.to, link.exact))?.label || t('dashboard')}
            </h1>
            <div className={`flex items-center gap-2 sm:gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Date - Hidden on small mobile */}
              <div className={`hidden sm:block text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              
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
                className={`hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
                title={t('language')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'العربية' : 'English'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
