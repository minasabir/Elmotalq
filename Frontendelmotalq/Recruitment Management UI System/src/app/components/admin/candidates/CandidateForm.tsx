import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, Upload, FileText, Image as ImageIcon, Video, X } from 'lucide-react';
import { api, Candidate, Gender, EducationalQualification, CreateCandidateRequest } from '../../../services/api';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function CandidateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState<CreateCandidateRequest>({
    fullName: '',
    phoneNumber: '',
    jobTitle: '',
    gender: Gender.Male,
    educationalQualification: undefined,
    yearsOfExperience: undefined,
    graduationYear: undefined,
    country: '',
    governorate: '',
    cvFile: undefined,
    personalPhotoFile: undefined,
    introductionVideoFile: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadCandidate(Number(id));
    }
  }, [isEdit, id]);

  const loadCandidate = async (candidateId: number) => {
    try {
      setLoading(true);
      const response = await api.getCandidateById(candidateId);
      if (response.success) {
        const data = response.data;
        setCandidate(data);
        setFormData({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          jobTitle: data.jobTitle,
          gender: data.gender,
          educationalQualification: data.educationalQualification,
          yearsOfExperience: data.yearsOfExperience,
          graduationYear: data.graduationYear,
          country: data.country || '',
          governorate: data.governorate || '',
          cvFile: undefined,
          personalPhotoFile: undefined,
          introductionVideoFile: undefined,
        });
      }
    } catch (err) {
      setError(t('failedToLoadCandidate'));
      console.error('Error loading candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'cvFile' | 'personalPhotoFile' | 'introductionVideoFile', file: File | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const removeFile = (field: 'cvFile' | 'personalPhotoFile' | 'introductionVideoFile') => {
    setFormData((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (isEdit && candidate) {
        // For editing, we'll use PATCH to update only changed fields
        const updateData: Partial<CreateCandidateRequest> = {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          jobTitle: formData.jobTitle,
          gender: formData.gender,
          educationalQualification: formData.educationalQualification,
          yearsOfExperience: formData.yearsOfExperience,
          graduationYear: formData.graduationYear,
          country: formData.country || undefined,
          governorate: formData.governorate || undefined,
        };

        await api.patchCandidate(candidate.id, updateData);
      } else {
        // For creating new candidate
        await api.createCandidate(formData);
      }

      navigate('/admin/candidates');
    } catch (err) {
      setError(isEdit ? t('failedToUpdateCandidate') : t('failedToCreateCandidate'));
      console.error('Error saving candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit && !candidate) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <Link
          to={isEdit ? `/admin/candidates/${id}` : '/admin/candidates'}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{isEdit ? t('editCandidate') : t('addNewCandidate')}</h2>
          <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {isEdit ? t('updateCandidate') : t('createCandidate')}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-xl p-8 border border-border space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('basicInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('fullName')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('candidateNamePlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('phoneNumber')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  value={formData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('phonePlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('jobTitle')} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.jobTitle}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('jobTitlePlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('gender')} <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="">{t('selectGender')}</option>
                  <option value="0">{t('male')}</option>
                  <option value="1">{t('female')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education & Experience */}
          <div className="pt-6 border-t border-border">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('educationExperience')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('educationalQualification')}</label>
                <select
                  value={formData.educationalQualification}
                  onChange={(e) => updateField('educationalQualification', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <option value="">{t('selectQualification')}</option>
                  <option value="0">{t('highSchool')}</option>
                  <option value="1">{t('diploma')}</option>
                  <option value="2">{t('bachelor')}</option>
                  <option value="3">{t('master')}</option>
                  <option value="4">{t('phd')}</option>
                  <option value="5">{t('other')}</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('graduationYear')}</label>
                <input
                  type="number"
                  min="1950"
                  max="2030"
                  value={formData.graduationYear}
                  onChange={(e) => updateField('graduationYear', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder="2020"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('yearsOfExperience')}</label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('yearsPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="pt-6 border-t border-border">
            <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('location')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('country')}</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('countryPlaceholder')}
                />
              </div>

              <div>
                <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('governorate')}</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.governorate}
                  onChange={(e) => updateField('governorate', e.target.value)}
                  className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('governoratePlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          {!isEdit && (
            <div className="pt-6 border-t border-border">
              <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('uploadDocuments')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* CV Upload */}
                <div>
                  <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('cvResume')}</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('cvFile', e.target.files?.[0])}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {formData.cvFile ? (
                        <>
                          <FileText className="w-8 h-8 text-primary" />
                          <div className="text-sm font-medium">{formData.cvFile.name}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFile('cvFile');
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            {t('clickToUpload')}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('pdfOnly')}</div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('personalPhoto')}</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('personalPhotoFile', e.target.files?.[0])}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {formData.personalPhotoFile ? (
                        <>
                          <ImageIcon className="w-8 h-8 text-primary" />
                          <div className="text-sm font-medium">{formData.personalPhotoFile.name}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFile('personalPhotoFile');
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            {t('clickToUpload')}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('jpgPngOnly')}</div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className={`block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('introductionVideo')}</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept=".mp4"
                      onChange={(e) => handleFileChange('introductionVideoFile', e.target.files?.[0])}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {formData.introductionVideoFile ? (
                        <>
                          <Video className="w-8 h-8 text-primary" />
                          <div className="text-sm font-medium">{formData.introductionVideoFile.name}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFile('introductionVideoFile');
                            }}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Video className="w-8 h-8 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            {t('clickToUpload')}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('mp4Only')}</div>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              {loading ? t('saving') : (isEdit ? t('updateCandidate') : t('createCandidate'))}
            </button>
            <Link
              to={isEdit ? `/admin/candidates/${id}` : '/admin/candidates'}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {t('cancel')}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
