import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { api, Company, CreateCompanyRequest } from '../../../services/api';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function CompanyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState<CreateCompanyRequest>({
    companyName: '',
    contactPhone: '',
    email: '',
    country: '',
    city: '',
    requiredJobTitle: '',
    companyIndustry: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadCompany(Number(id));
    }
  }, [isEdit, id]);

  const loadCompany = async (companyId: number) => {
    try {
      setLoading(true);
      const response = await api.getCompanyById(companyId);
      if (response.success) {
        const data = response.data;
        setCompany(data);
        setFormData({
          companyName: data.companyName,
          contactPhone: data.contactPhone,
          email: data.email,
          country: data.country,
          city: data.city,
          requiredJobTitle: data.requiredJobTitle,
          companyIndustry: data.companyIndustry,
        });
      }
    } catch (err) {
      setError(t('failedToLoadCompany'));
      console.error('Error loading company:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (isEdit && company) {
        // For editing, we'll use PATCH to update only changed fields
        const updateData: Partial<CreateCompanyRequest> = {
          companyName: formData.companyName,
          contactPhone: formData.contactPhone,
          email: formData.email,
          country: formData.country,
          city: formData.city,
          requiredJobTitle: formData.requiredJobTitle,
          companyIndustry: formData.companyIndustry,
        };

        await api.patchCompany(company.id, updateData);
      } else {
        // For creating new company
        await api.createCompany(formData);
      }

      navigate('/admin/companies');
    } catch (err) {
      setError(isEdit ? t('failedToUpdateCompany') : t('failedToCreateCompany'));
      console.error('Error saving company:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Link
          to={isEdit ? `/admin/companies/${id}` : '/admin/companies'}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{isEdit ? t('editCompany') : t('addNewCompany')}</h2>
          <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {isEdit ? t('updateCompany') : t('createCompany')}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-xl p-8 border border-border space-y-8">
          {/* Company Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('companyInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('companyName')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('companyNamePlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('companyIndustry')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.companyIndustry}
                  onChange={(e) => updateField('companyIndustry', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('industryPlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('requiredJobTitle')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.requiredJobTitle}
                  onChange={(e) => updateField('requiredJobTitle', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('requiredJobPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-6 border-t border-border">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('contactInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('contactPhone')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('phonePlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('email')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder="hr@company.com"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="pt-6 border-t border-border">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('location')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('country')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('countryPlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('city')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('cityPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="text-destructive">{error}</div>
            </div>
          )}

          {/* Actions */}
          <div className={`pt-6 border-t border-border flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? t('saving') : (isEdit ? t('updateCompany') : t('createCompany'))}
            </button>
            <Link
              to={isEdit ? `/admin/companies/${id}` : '/admin/companies'}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {t('cancel')}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );

  if (loading && isEdit && !company) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
}
