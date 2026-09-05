import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building2, 
  Layers, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  X, 
  UserCheck, 
  Award,
  Filter
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { UserProfile, UserRole, Department } from '../../types';

export const UserManagement: React.FC = () => {
  const { 
    allUsers, 
    addUser, 
    updateUser, 
    deleteUser, 
    currentUser, 
    setCurrentUser,
    companies,
    departmentsList 
  } = useRecruitment();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'HR Executive' as UserRole,
    department: 'HR Recruitment' as Department,
    companyId: 'comp-1',
    dailyInterviewTarget: 5,
    monthlyActiveJoiningTarget: 20,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'HR Executive',
      department: departmentsList[0]?.name || 'HR Recruitment',
      companyId: companies[0]?.id || 'comp-1',
      dailyInterviewTarget: 5,
      monthlyActiveJoiningTarget: 20,
      status: 'Active',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department,
      companyId: user.companyId || (companies[0]?.id || 'comp-1'),
      dailyInterviewTarget: user.dailyInterviewTarget || 0,
      monthlyActiveJoiningTarget: user.monthlyActiveJoiningTarget || 0,
      status: user.status || 'Active',
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Valid email is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const matchedCompany = companies.find(c => c.id === formData.companyId);
    const companyName = matchedCompany ? matchedCompany.name : 'Essential Soul Lifestyle Pvt Ltd';

    if (editingUser) {
      updateUser(editingUser.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department,
        companyId: formData.companyId,
        companyName,
        dailyInterviewTarget: Number(formData.dailyInterviewTarget) || 0,
        monthlyActiveJoiningTarget: Number(formData.monthlyActiveJoiningTarget) || 0,
        status: formData.status,
      });
    } else {
      addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department,
        companyId: formData.companyId,
        companyName,
        dailyInterviewTarget: Number(formData.dailyInterviewTarget) || 0,
        monthlyActiveJoiningTarget: Number(formData.monthlyActiveJoiningTarget) || 0,
        status: formData.status,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDeleteUser = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      alert('You cannot delete the currently logged in user profile.');
      return;
    }
    if (allUsers.length <= 1) {
      alert('At least one user must remain in the system.');
      return;
    }
    if (confirm(`Remove user ${user.name} (${user.role}) from the team?`)) {
      deleteUser(user.id);
    }
  };

  // Filtered Users
  const filteredUsers = allUsers.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      u.role.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    );

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesDept = deptFilter === 'ALL' || u.department === deptFilter;

    return matchesSearch && matchesRole && matchesDept;
  });

  const totalDailyTarget = allUsers.reduce((sum, u) => sum + (u.dailyInterviewTarget || 0), 0);
  const totalMonthlyTarget = allUsers.reduce((sum, u) => sum + (u.monthlyActiveJoiningTarget || 0), 0);
  const totalHrTeam = allUsers.filter(u => u.role === 'HR Executive' || u.role === 'HR Head' || u.role === 'Recruiter').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">User & Team Management</h1>
              <p className="text-xs text-slate-500">
                Manage HR executives, interviewers, directors, daily & monthly targets, and role permissions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-add-user"
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{allUsers.length}</span>
            <span className="text-xs text-slate-500">active profiles</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">HR Recruiters</span>
            <UserCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600">{totalHrTeam}</span>
            <span className="text-xs text-slate-500">heads & executives</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Interview Goal</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{totalDailyTarget}</span>
            <span className="text-xs text-slate-500">interviews / day</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Joinings Goal</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{totalMonthlyTarget}</span>
            <span className="text-xs text-slate-500">active joinings / mo</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Roles</option>
            <option value="HR Head">HR Head</option>
            <option value="HR Executive">HR Executive</option>
            <option value="Director / Management">Director / Management</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Interviewer">Interviewer</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Departments</option>
            {departmentsList.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> of {allUsers.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department & Company</th>
                <th className="py-3 px-4 text-center">Daily Interview Target</th>
                <th className="py-3 px-4 text-center">Monthly Joining Target</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isCurrent = currentUser.id === user.id;
                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {user.name}
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[9px] font-bold">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5 text-slate-600 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[10px]">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          user.role === 'Super Admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : user.role === 'Director / Management'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : user.role === 'HR Head'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>

                      {/* Department & Company */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Layers className="w-3 h-3 text-slate-400" />
                            {user.department}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {user.companyName || 'Essential Soul Lifestyle Pvt Ltd'}
                          </div>
                        </div>
                      </td>

                      {/* Daily Interview Target */}
                      <td className="py-3 px-4 text-center">
                        {user.dailyInterviewTarget > 0 ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                            <Target className="w-3 h-3 text-emerald-500" />
                            <span>{user.dailyInterviewTarget} / day</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Monthly Joining Target */}
                      <td className="py-3 px-4 text-center">
                        {user.monthlyActiveJoiningTarget > 0 ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                            <Award className="w-3 h-3 text-blue-500" />
                            <span>{user.monthlyActiveJoiningTarget} / mo</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {user.status === 'Inactive' ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Inactive
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {!isCurrent && (
                            <button
                              onClick={() => setCurrentUser(user)}
                              title="Switch active session to this user"
                              className="px-2 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Switch
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(user)}
                            title="Edit User"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingUser ? 'Edit User Profile' : 'Add New Team Member'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure role permissions, targets, and company department allocation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nandani or Shivani"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                {formErrors.name && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@essentialsoul.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.email && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Role & Permissions
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="HR Executive">HR Executive (Recruiter)</option>
                    <option value="HR Head">HR Head (Lead Recruiter)</option>
                    <option value="Director / Management">Director / Management</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Interviewer">Interviewer</option>
                    <option value="Team Leader">Team Leader</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assigned Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    {departmentsList.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Company Entity
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Target Settings */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  Performance Targets
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1 text-[11px]">
                      Daily Interview Target (Interviews/Day)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.dailyInterviewTarget}
                      onChange={(e) => setFormData({ ...formData, dailyInterviewTarget: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 mb-1 text-[11px]">
                      Monthly Active Joining Target (Joinings/Mo)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={formData.monthlyActiveJoiningTarget}
                      onChange={(e) => setFormData({ ...formData, monthlyActiveJoiningTarget: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Active status */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="user-is-active"
                  checked={formData.status === 'Active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="user-is-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  User is active and available for lead assignment
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-xs cursor-pointer"
                >
                  {editingUser ? 'Save User' : 'Create User'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
