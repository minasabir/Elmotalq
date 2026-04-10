import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Building2, UserCircle, TrendingUp, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, Candidate, Company, Employee } from '../../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [candidatesRes, companiesRes, employeesRes] = await Promise.all([
        api.getAllCandidates(1, 100),
        api.getAllCompanies(1, 100),
        api.getAllEmployees(),
      ]);

      if (candidatesRes.success && candidatesRes.data) {
        setCandidates(candidatesRes.data.items);
      }
      if (companiesRes.success && companiesRes.data) {
        setCompanies(companiesRes.data.items);
      }
      if (employeesRes.success && employeesRes.data) {
        setEmployees(employeesRes.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Candidates',
      value: candidates.length.toString(),
      change: '',
      trend: 'up',
      icon: Users,
      color: 'bg-primary/10 text-primary',
      link: '/admin/candidates',
    },
    {
      label: 'Total Companies',
      value: companies.length.toString(),
      change: '',
      trend: 'up',
      icon: Building2,
      color: 'bg-primary/10 text-primary',
      link: '/admin/companies',
    },
    {
      label: 'Active Employees',
      value: employees.filter(e => e.isActive).length.toString(),
      change: '',
      trend: 'up',
      icon: UserCircle,
      color: 'bg-primary/10 text-primary',
      link: '/admin/employees',
    },
    {
      label: 'Assigned Candidates',
      value: candidates.filter(c => c.assignedEmployeeId).length.toString(),
      change: '',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary',
    },
  ];

  const recentCandidates = candidates.slice(0, 5).map(c => ({
    id: c.id,
    name: c.fullName,
    job: c.jobTitle,
    status: c.assignedEmployeeId ? 'Assigned' : 'Unassigned',
  }));

  const recentCompanies = companies.slice(0, 5).map(c => ({
    id: c.id,
    name: c.companyName,
    job: c.requiredJobTitle,
    status: c.assignedEmployeeId ? 'Assigned' : 'Unassigned',
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={stat.link || '#'}
                className="block bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.link && (
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <div className="text-sm text-primary font-medium">{stat.change}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
        <div className="space-y-3">
          <Link
            to="/admin/candidates/new"
            className="block p-4 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
          >
            <div className="font-medium text-primary">Add New Candidate</div>
            <div className="text-sm text-muted-foreground mt-1">
              Register a new candidate profile
            </div>
          </Link>
          <Link
            to="/admin/companies/new"
            className="block p-4 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
          >
            <div className="font-medium text-primary">Add New Company</div>
            <div className="text-sm text-muted-foreground mt-1">
              Register a new company request
            </div>
          </Link>
          <Link
            to="/admin/employees/new"
            className="block p-4 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
          >
            <div className="font-medium text-primary">Add New Employee</div>
            <div className="text-sm text-muted-foreground mt-1">Create employee account</div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Candidates</h3>
            <Link to="/admin/candidates" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCandidates.map((candidate) => (
              <Link
                key={candidate.id}
                to={`/admin/candidates/${candidate.id}`}
                className="block p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">{candidate.job}</div>
                  </div>
                  <div
                    className={`text-xs px-3 py-1 rounded-full ${
                      candidate.status === 'Assigned'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {candidate.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Companies */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Companies</h3>
            <Link to="/admin/companies" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCompanies.map((company) => (
              <Link
                key={company.id}
                to={`/admin/companies/${company.id}`}
                className="block p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-muted-foreground">{company.job}</div>
                  </div>
                  <div
                    className={`text-xs px-3 py-1 rounded-full ${
                      company.status === 'Assigned'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {company.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
