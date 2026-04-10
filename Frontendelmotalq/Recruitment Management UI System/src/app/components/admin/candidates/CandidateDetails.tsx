import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Video,
  UserCircle,
} from 'lucide-react';
import { api, Candidate, getGenderDisplay, getEducationDisplay } from '../../../services/api';

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCandidate(Number(id));
    }
  }, [id]);

  const loadCandidate = async (candidateId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCandidateById(candidateId);
      if (response.success) {
        setCandidate(response.data);
      }
    } catch (err) {
      setError('Failed to load candidate details');
      console.error('Error loading candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (candidate && window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.deleteCandidate(candidate.id);
        window.location.href = '/admin/candidates';
      } catch (err) {
        setError('Failed to delete candidate');
        console.error('Error deleting candidate:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="text-destructive">{error || 'Candidate not found'}</div>
        <Link
          to="/admin/candidates"
          className="mt-2 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Candidates
        </Link>
      </div>
    );
  }

  const infoSections = [
    {
      title: 'Personal Information',
      icon: User,
      fields: [
        { label: 'Full Name', value: candidate.fullName },
        { label: 'Gender', value: getGenderDisplay(candidate.gender) },
        { label: 'Phone Number', value: candidate.phoneNumber },
      ],
    },
    {
      title: 'Professional Information',
      icon: Briefcase,
      fields: [
        { label: 'Job Title', value: candidate.jobTitle },
        { label: 'Years of Experience', value: candidate.yearsOfExperience ? `${candidate.yearsOfExperience} years` : 'N/A' },
      ],
    },
    {
      title: 'Education',
      icon: GraduationCap,
      fields: [
        { 
          label: 'Educational Qualification', 
          value: candidate.educationalQualification !== undefined 
            ? getEducationDisplay(candidate.educationalQualification) 
            : 'N/A'
        },
        { label: 'Graduation Year', value: candidate.graduationYear || 'N/A' },
      ],
    },
    {
      title: 'Location',
      icon: MapPin,
      fields: [
        { label: 'Country', value: candidate.country || 'N/A' },
        { label: 'Governorate', value: candidate.governorate || 'N/A' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/candidates"
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{candidate.fullName}</h2>
          <p className="text-muted-foreground">{candidate.jobTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/candidates/${id}/edit`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Sections */}
          {infoSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field, i) => (
                    <div key={i}>
                      <div className="text-sm text-muted-foreground mb-1">{field.label}</div>
                      <div className="font-medium">{field.value || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Documents */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {candidate.cvFilePath && (
                <a
                  href={`https://elmotalq.runasp.net${candidate.cvFilePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">CV / Resume</div>
                    <div className="text-sm text-muted-foreground">PDF Document</div>
                  </div>
                </a>
              )}

              {candidate.personalPhotoFilePath && (
                <a
                  href={`https://elmotalq.runasp.net${candidate.personalPhotoFilePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Personal Photo</div>
                    <div className="text-sm text-muted-foreground">JPG/PNG Image</div>
                  </div>
                </a>
              )}

              {candidate.introductionVideoFilePath && (
                <a
                  href={`https://elmotalq.runasp.net${candidate.introductionVideoFilePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Introduction Video</div>
                    <div className="text-sm text-muted-foreground">MP4 Video</div>
                  </div>
                </a>
              )}

              {!candidate.cvFilePath && !candidate.personalPhotoFilePath && !candidate.introductionVideoFilePath && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>No files uploaded</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Assignment</h3>
            </div>

            {candidate.assignedEmployee ? (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Assigned to</div>
                <div className="px-4 py-3 bg-primary/10 rounded-lg">
                  <div className="font-medium text-primary">{candidate.assignedEmployee.name}</div>
                  <div className="text-sm text-muted-foreground">{candidate.assignedEmployee.email}</div>
                </div>
                <button className="w-full mt-3 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm">
                  Reassign
                </button>
              </div>
            ) : (
              <div>
                <div className="px-4 py-3 bg-muted rounded-lg mb-3">
                  <div className="text-sm text-muted-foreground">Not assigned</div>
                </div>
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  Assign to Employee
                </button>
              </div>
            )}
          </motion.div>

          {/* Metadata */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Metadata</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Created At</div>
                <div className="text-sm">
                  {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                <div className="text-sm">
                  {new Date(candidate.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Candidate ID</div>
                <div className="text-sm font-mono">{candidate.id}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
