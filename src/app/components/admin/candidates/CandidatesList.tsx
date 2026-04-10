import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  MapPin,
  Calendar,
} from 'lucide-react';
import { api, Candidate, Gender, EducationalQualification, getGenderDisplay, getEducationDisplay } from '../../../services/api';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function CandidatesList() {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    education: '',
    experience: '',
    assignedStatus: '',
    country: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, [currentPage, pageSize]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllCandidates(currentPage, pageSize);
      if (response.success) {
        setCandidates(response.data.items);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      setError(t('failedToLoadCandidate'));
      console.error('Error loading candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-xl sm:text-2xl font-bold">{t('candidates')}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t('manageCompanies')}</p>
        </div>
        <Link
          to="/admin/candidates/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          {t('add')}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl p-4 sm:p-6 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 bg-input-background border border-input rounded-lg text-sm ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
              showFilters
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:bg-secondary'
            }`}
          >
            <Filter className="w-4 h-4" />
            {t('filterBy')}
          </button>
          <button className="px-4 py-3 bg-card border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('download')}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border"
          >
            <div>
              <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('genderDisplay')}</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm"
              >
                <option value="">{t('all')}</option>
                <option value="0">{t('male')}</option>
                <option value="1">{t('female')}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('educationDisplay')}</label>
              <select
                value={filters.education}
                onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm"
              >
                <option value="">{t('all')}</option>
                <option value="0">{t('highSchool')}</option>
                <option value="1">{t('diploma')}</option>
                <option value="2">{t('bachelor')}</option>
                <option value="3">{t('master')}</option>
                <option value="4">{t('phd')}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('experience')}</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm"
              >
                <option value="">{t('all')}</option>
                <option value="0-2">0-2 {t('years')}</option>
                <option value="3-5">3-5 {t('years')}</option>
                <option value="6+">6+ {t('years')}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('assignedStatus')}</label>
              <select
                value={filters.assignedStatus}
                onChange={(e) => setFilters({ ...filters, assignedStatus: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm"
              >
                <option value="">{t('all')}</option>
                <option value="assigned">{t('assigned')}</option>
                <option value="unassigned">{t('unassigned')}</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('name')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('job')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('phone')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('educationDisplay')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('graduationYear')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('location')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('experience')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('files')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('assignedEmployee')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('created')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{candidate.fullName}</div>
                    <div className="text-sm text-muted-foreground">{t(candidate.gender === 0 ? 'male' : 'female')}</div>
                  </td>
                  <td className="px-6 py-4">{candidate.jobTitle}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {candidate.phoneNumber}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {candidate.educationalQualification !== undefined 
                      ? t(['highSchool', 'diploma', 'bachelor', 'master', 'phd', 'other'][candidate.educationalQualification] || 'noData')
                      : t('noData')
                    }
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {candidate.graduationYear || t('noData')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      {candidate.country && (
                        <>
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {candidate.country}
                        </>
                      )}
                      {candidate.governorate && (
                        <span className="text-muted-foreground">, {candidate.governorate}</span>
                      )}
                      {!candidate.country && !candidate.governorate && t('noData')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {candidate.yearsOfExperience ? `${candidate.yearsOfExperience} ${t('years')}` : t('noData')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {candidate.cvFilePath && (
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center" title="CV">
                          <FileText className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {candidate.personalPhotoFilePath && (
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center" title="Photo">
                          <ImageIcon className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                      {candidate.introductionVideoFilePath && (
                        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center" title="Video">
                          <Video className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                      {!candidate.cvFilePath && !candidate.personalPhotoFilePath && !candidate.introductionVideoFilePath && (
                        <span className="text-sm text-muted-foreground">{t('noFiles')}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {candidate.assignedEmployee ? (
                      <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {candidate.assignedEmployee.name}
                      </span>
                    ) : (
                      <span className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full">
                        {t('unassigned')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(candidate.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/candidates/${candidate.id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={t('view')}
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <Link
                        to={`/admin/candidates/${candidate.id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <button
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        title={t('delete')}
                        onClick={() => handleDelete(candidate.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`px-4 sm:px-6 py-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            {t('showing')} {candidates.length > 0 ? startIndex : 0} {t('to')} {endIndex} {t('of')}{' '}
            {totalCount} {t('results')}
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-border rounded-lg text-sm bg-background"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-destructive">{error}</div>
          <button
            onClick={loadCandidates}
            className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      )}
    </div>
  );

  async function handleDelete(id: number) {
    if (window.confirm(t('confirmDeleteCandidate'))) {
      try {
        await api.deleteCandidate(id);
        loadCandidates();
      } catch (err) {
        setError(t('failedToDeleteCandidate'));
        console.error('Error deleting candidate:', err);
      }
    }
  }
}
