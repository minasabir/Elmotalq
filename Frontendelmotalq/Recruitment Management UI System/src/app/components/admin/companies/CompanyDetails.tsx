import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  UserCircle,
  Calendar,
} from 'lucide-react';
import { api, Company } from '../../../services/api';

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCompany(Number(id));
    }
  }, [id]);

  const loadCompany = async (companyId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCompanyById(companyId);
      if (response.success) {
        setCompany(response.data);
      }
    } catch (err) {
      setError('Failed to load company details');
      console.error('Error loading company:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (company && window.confirm('Are you sure you want to delete this company?')) {
      try {
        await api.deleteCompany(company.id);
        window.location.href = '/admin/companies';
      } catch (err) {
        setError('Failed to delete company');
        console.error('Error deleting company:', err);
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

  if (error || !company) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <div className="text-destructive">{error || 'Company not found'}</div>
        <Link
          to="/admin/companies"
          className="mt-2 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/companies" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{company.companyName}</h2>
          <p className="text-muted-foreground">{company.companyIndustry}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/companies/${id}/edit`}
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
          {/* Company Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Company Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Company Name</div>
                <div className="font-medium">{company.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Industry</div>
                <div className="font-medium">{company.companyIndustry}</div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium">{company.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                <div className="font-medium">{company.contactPhone}</div>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Country</div>
                <div className="font-medium">{company.country}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">City</div>
                <div className="font-medium">{company.city}</div>
              </div>
            </div>
          </motion.div>

          {/* Job Requirements */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Job Requirements</h3>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Required Job Title</div>
              <div className="font-medium text-lg">{company.requiredJobTitle}</div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Assignment</h3>
            </div>

            {company.assignedEmployee ? (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Assigned to</div>
                <div className="px-4 py-3 bg-primary/10 rounded-lg">
                  <div className="font-medium text-primary">{company.assignedEmployee.name}</div>
                  <div className="text-sm text-muted-foreground">{company.assignedEmployee.email}</div>
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
            transition={{ delay: 0.5 }}
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
                  {new Date(company.createdAt).toLocaleDateString('en-US', {
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
                  {new Date(company.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Company ID</div>
                <div className="text-sm font-mono">{company.id}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
