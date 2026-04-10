import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Plus, Edit, Shield, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { api, Employee, UserRole, getRoleDisplay } from '../../../services/api';

export default function EmployeesList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

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
            onClick={loadEmployees}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Employees</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage employee accounts and permissions</p>
        </div>
        <Link
          to="/admin/employees/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-xl p-4 sm:p-6 border border-border"
        >
          <div className="text-sm text-muted-foreground mb-1">Total Employees</div>
          <div className="text-2xl sm:text-3xl font-bold">{employees.length}</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 sm:p-6 border border-border"
        >
          <div className="text-sm text-muted-foreground mb-1">Active Employees</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {employees.filter((e) => e.isActive).length}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 sm:p-6 border border-border"
        >
          <div className="text-sm text-muted-foreground mb-1">Inactive Employees</div>
          <div className="text-2xl sm:text-3xl font-bold text-muted-foreground">
            {employees.filter((e) => !e.isActive).length}
          </div>
        </motion.div>
      </div>

      {/* Employees List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Salary</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Created</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{employee.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{employee.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {employee.role === UserRole.Owner ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">{getRoleDisplay(employee.role)}</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{getRoleDisplay(employee.role)}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    ${employee.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {employee.isActive ? (
                      <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/employees/${employee.id}/edit`}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors inline-flex"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-secondary/50 rounded-xl p-4 sm:p-6 border border-border">
        <h3 className="font-medium mb-2">Employee Roles</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5" />
            <span>
              <strong>Owner:</strong> Full access to all features including employee management,
              deletions, and assignments
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span>
              <strong>Secretary:</strong> Limited access - can view and update assigned candidates
              and companies
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
