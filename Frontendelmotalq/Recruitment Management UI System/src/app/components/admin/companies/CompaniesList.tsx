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
  MapPin,
} from 'lucide-react';
import { api, Company } from '../../../services/api';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function CompaniesList() {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    industry: '',
    assignedStatus: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, [currentPage, pageSize]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllCompanies(currentPage, pageSize);
      if (response.success) {
        setCompanies(response.data.items);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      setError(t('failedToLoadCompany'));
      console.error('Error loading companies:', err);
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
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div>
          <h2 className={`text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{t('companies')}</h2>
          <p className={`text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{t('manageCompanies')}</p>
        </div>
        <Link
          to="/admin/companies/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('addNewCompany')}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'text-right' : 'text-left'}`}
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border"
          >
            <div>
              <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('country')}</label>
              <input
                type="text"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className={`w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('filterBy') + ' ' + t('country')}
              />
            </div>

            <div>
              <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('industry')}</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm"
              >
                <option value="">{t('all')}</option>
                <option value="technology">{t('technology')}</option>
                <option value="healthcare">{t('healthcare')}</option>
                <option value="finance">{t('finance')}</option>
                <option value="ecommerce">{t('ecommerce')}</option>
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
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('companyName')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('contactInformation')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('location')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('requiredJob')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('industry')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('assignedEmployee')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('created')}</th>
                <th className={`px-6 py-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{company.companyName}</div>
                    <div className="text-sm text-muted-foreground">{company.companyIndustry}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{company.email}</div>
                    <div className="text-sm text-muted-foreground">{company.contactPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{company.city}</div>
                        <div className="text-sm text-muted-foreground">{company.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{company.requiredJobTitle}</td>
                  <td className="px-6 py-4 text-sm">{company.companyIndustry}</td>
                  <td className="px-6 py-4">
                    {company.assignedEmployee ? (
                      <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {company.assignedEmployee.name}
                      </span>
                    ) : (
                      <span className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full">
                        {t('unassigned')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/companies/${company.id}`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={t('view')}
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <Link
                        to={`/admin/companies/${company.id}/edit`}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <button
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                        title={t('delete')}
                        onClick={() => handleDelete(company.id)}
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
        <div className={`px-6 py-4 border-t border-border flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="text-sm text-muted-foreground">
            {t('showing')} {companies.length > 0 ? startIndex : 0} {t('to')} {endIndex} {t('of')}{' '}
            {totalCount} {t('results')}
          </div>

          <div className="flex items-center gap-2">
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
            onClick={loadCompanies}
            className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      )}
    </div>
  );

  async function handleDelete(id: number) {
    if (window.confirm(t('confirmDeleteCompany'))) {
      try {
        await api.deleteCompany(id);
        loadCompanies();
      } catch (err) {
        setError(t('failedToDeleteCompany'));
        console.error('Error deleting company:', err);
      }
    }
  }
}
