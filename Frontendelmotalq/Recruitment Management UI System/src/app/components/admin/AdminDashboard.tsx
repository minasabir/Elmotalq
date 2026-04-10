import { motion } from 'motion/react';
import { Users, Building2, UserCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Candidates',
      value: '247',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-primary/10 text-primary',
      link: '/admin/candidates',
    },
    {
      label: 'Total Companies',
      value: '83',
      change: '+8%',
      trend: 'up',
      icon: Building2,
      color: 'bg-primary/10 text-primary',
      link: '/admin/companies',
    },
    {
      label: 'Active Employees',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: UserCircle,
      color: 'bg-primary/10 text-primary',
      link: '/admin/employees',
    },
    {
      label: 'Placements This Month',
      value: '34',
      change: '+18%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary',
    },
  ];

  const monthlyData = [
    { month: 'Jan', candidates: 45, companies: 12 },
    { month: 'Feb', candidates: 52, companies: 15 },
    { month: 'Mar', candidates: 61, companies: 18 },
    { month: 'Apr', candidates: 58, companies: 16 },
    { month: 'May', candidates: 67, companies: 20 },
    { month: 'Jun', candidates: 72, companies: 22 },
  ];

  const recentCandidates = [
    { id: 1, name: 'Ahmed Mohamed', job: 'Software Developer', status: 'Unassigned' },
    { id: 2, name: 'Sara Ibrahim', job: 'UX Designer', status: 'Assigned' },
    { id: 3, name: 'Mohamed Ali', job: 'Data Analyst', status: 'Unassigned' },
    { id: 4, name: 'Nour Hassan', job: 'Marketing Manager', status: 'Assigned' },
  ];

  const recentCompanies = [
    { id: 1, name: 'Tech Solutions Inc', job: 'Senior Developer', status: 'Unassigned' },
    { id: 2, name: 'Global Innovations', job: 'Product Manager', status: 'Assigned' },
    { id: 3, name: 'Digital Agency', job: 'UI Designer', status: 'Unassigned' },
  ];

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold mb-6">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="candidates" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="companies" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1E3A8A] rounded-full" />
              <span className="text-sm text-muted-foreground">Candidates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#60A5FA] rounded-full" />
              <span className="text-sm text-muted-foreground">Companies</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
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
      </div>

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
