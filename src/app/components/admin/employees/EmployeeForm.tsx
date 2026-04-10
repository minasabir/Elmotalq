import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { api, Employee, UserRole, CreateEmployeeRequest } from '../../../services/api';

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    salary: '',
    isActive: true,
  });

  useEffect(() => {
    if (isEdit && id) {
      loadEmployee(Number(id));
    }
  }, [isEdit, id]);

  const loadEmployee = async (employeeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllEmployees();
      if (response.success && response.data) {
        const employee = response.data.find(e => e.id === employeeId);
        if (employee) {
          setFormData({
            name: employee.name,
            email: employee.email,
            password: '',
            role: employee.role.toString(),
            salary: employee.salary.toString(),
            isActive: employee.isActive,
          });
        }
      }
    } catch (err) {
      setError('Failed to load employee data');
      console.error('Error loading employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data: CreateEmployeeRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: Number(formData.role) as UserRole,
        salary: Number(formData.salary),
      };

      if (isEdit && id) {
        await api.updateEmployee(Number(id), data);
      } else {
        await api.createEmployee(data);
      }

      navigate('/admin/employees');
    } catch (err) {
      setError(isEdit ? 'Failed to update employee' : 'Failed to create employee');
      console.error('Error saving employee:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/employees" className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
          <p className="text-muted-foreground">
            {isEdit ? 'Update employee information' : 'Create a new employee account'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-xl p-8 border border-border space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="employee@elmotalq.com"
                />
              </div>

              <div>
                <label className="block mb-2">
                  {isEdit ? 'Password (leave blank to keep current)' : 'Password'}{' '}
                  {!isEdit && <span className="text-destructive">*</span>}
                </label>
                <input
                  type="password"
                  required={!isEdit}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Role <span className="text-destructive">*</span>
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select role</option>
                  <option value="0">Owner</option>
                  <option value="1">Secretary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2">
                  Salary <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => updateField('salary', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {isEdit && (
                <div>
                  <label className="block mb-2">Account Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => updateField('isActive', e.target.value === 'active')}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-secondary/50 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Owner accounts have full system
              access including employee management. Secretary accounts can only manage assigned
              candidates and companies.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {submitting ? 'Saving...' : (isEdit ? 'Update Employee' : 'Create Employee')}
            </button>
            <Link
              to="/admin/employees"
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
