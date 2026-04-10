import { Link } from 'react-router';
import { motion } from 'motion/react';
import { UserCircle, Building2, FileCheck, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  
  const features = [
    {
      icon: UserCircle,
      title: t('forCandidates'),
      description: t('submitProfile') + ' ' + t('applyAsCandidate'),
      link: '/candidate',
      linkText: t('applyNow'),
    },
    {
      icon: Building2,
      title: t('forCompanies'),
      description: t('postRequirements') + ' ' + t('postAJob'),
      link: '/company',
      linkText: t('postAJob'),
    },
    {
      icon: FileCheck,
      title: t('professionalScreening'),
      description: t('excellenceDesc'),
    },
    {
      icon: Users,
      title: t('personalizedMatching'),
      description: t('peopleFirstDesc'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-card to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className={`text-5xl md:text-6xl font-bold text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                Elmotalq
              </h1>
              <p className={`text-xl text-foreground mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('heroTitle')}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <Link
                  to="/candidate"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                >
                  {t('imCandidate')}
                </Link>
                <Link
                  to="/company"
                  className="px-8 py-4 bg-card text-foreground border-2 border-primary rounded-lg hover:bg-secondary transition-colors text-center font-medium"
                >
                  {t('imCompany')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className={`font-medium mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('submitProfile')}</h3>
                      <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('submitYourProfile')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className={`font-medium mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('professionalScreening')}</h3>
                      <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('excellenceDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className={`font-medium mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('personalizedMatching')}</h3>
                      <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('peopleFirstDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('howItWorks')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{feature.title}</h3>
                <p className={`text-muted-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{feature.description}</p>
                {feature.link && (
                  <Link
                    to={feature.link}
                    className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                  >
                    {feature.linkText}
                    <span>→</span>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('readyToStart')}
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Link
              to="/candidate"
              className="px-8 py-4 bg-card text-primary rounded-lg hover:bg-card/90 transition-colors font-medium"
            >
              {t('submitYourProfile')}
            </Link>
            <Link
              to="/company"
              className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/20 rounded-lg hover:bg-primary-foreground/20 transition-colors font-medium"
            >
              {t('postJobRequirements')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
