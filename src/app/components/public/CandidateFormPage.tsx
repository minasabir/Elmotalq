import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { api, Gender, EducationalQualification } from '../../services/api';

export default function CandidateFormPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    jobTitle: '',
    gender: '',
    educationalQualification: '',
    yearsOfExperience: '',
    graduationYear: '',
    country: '',
    governorate: '',
    cvFile: null as File | null,
    photoFile: null as File | null,
    videoFile: null as File | null,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    updateField(field, file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.createCandidate({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        jobTitle: formData.jobTitle,
        gender: Number(formData.gender) as Gender,
        educationalQualification: formData.educationalQualification
          ? (Number(formData.educationalQualification) as EducationalQualification)
          : undefined,
        yearsOfExperience: formData.yearsOfExperience
          ? Number(formData.yearsOfExperience)
          : undefined,
        graduationYear: formData.graduationYear
          ? Number(formData.graduationYear)
          : undefined,
        country: formData.country || undefined,
        governorate: formData.governorate || undefined,
        cvFile: formData.cvFile || undefined,
        personalPhotoFile: formData.photoFile || undefined,
        introductionVideoFile: formData.videoFile || undefined,
      });

      if (response.success) {
        setSubmitted(true);
      } else {
        setError(response.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Submission failed. Please try again.');
      console.error('Error submitting candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
          <h2 className="text-2xl font-bold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for submitting your profile. Our team will review your application and contact you soon.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                fullName: '',
                phoneNumber: '',
                jobTitle: '',
                gender: '',
                educationalQualification: '',
                yearsOfExperience: '',
                graduationYear: '',
                country: '',
                governorate: '',
                cvFile: null,
                photoFile: null,
                videoFile: null,
              });
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Candidate Application</h1>
          <p className="text-muted-foreground">
            Complete your profile to connect with top employers
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    s === step
                      ? 'bg-primary text-primary-foreground'
                      : s < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      s < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-20 mt-4 text-sm">
            <span className={step === 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Basic Info
            </span>
            <span className={step === 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Details
            </span>
            <span className={step === 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
              Documents
            </span>
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-card rounded-2xl p-8 border border-border shadow-lg"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => updateField('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="+20 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Job Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => updateField('jobTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., Software Developer"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Gender <span className="text-destructive">*</span>
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select gender</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">Educational Qualification</label>
                  <select
                    value={formData.educationalQualification}
                    onChange={(e) => updateField('educationalQualification', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select qualification</option>
                    <option value="0">High School</option>
                    <option value="1">Diploma</option>
                    <option value="2">Bachelor</option>
                    <option value="3">Master</option>
                    <option value="4">PhD</option>
                    <option value="5">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={(e) => updateField('yearsOfExperience', e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Graduation Year</label>
                    <input
                      type="number"
                      min="1950"
                      max="2030"
                      value={formData.graduationYear}
                      onChange={(e) => updateField('graduationYear', e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Egypt"
                  />
                </div>

                <div>
                  <label className="block mb-2">Governorate</label>
                  <input
                    type="text"
                    value={formData.governorate}
                    onChange={(e) => updateField('governorate', e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Cairo"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="space-y-6">
                <FileUpload
                  label="CV (PDF)"
                  accept=".pdf"
                  file={formData.cvFile}
                  onChange={(file) => handleFileChange('cvFile', file)}
                />

                <FileUpload
                  label="Personal Photo (JPG, PNG)"
                  accept="image/jpeg,image/png"
                  file={formData.photoFile}
                  onChange={(file) => handleFileChange('photoFile', file)}
                />

                <FileUpload
                  label="Introduction Video (MP4)"
                  accept="video/mp4"
                  file={formData.videoFile}
                  onChange={(file) => handleFileChange('videoFile', file)}
                />

                <p className="text-sm text-muted-foreground">
                  All files are optional but recommended for better matching
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 ml-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function FileUpload({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
          id={label.replace(/\s+/g, '-')}
        />
        <label
          htmlFor={label.replace(/\s+/g, '-')}
          className="flex items-center justify-center gap-3 w-full px-4 py-8 bg-input-background border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
        >
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {file ? file.name : `Choose ${label.split('(')[0].trim()}`}
          </span>
        </label>
      </div>
    </div>
  );
}
