import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  X, 
  Layers, 
  Users, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { Company } from '../../types';

export const CompanyMaster: React.FC = () => {
  const { 
    companies, 
    addCompany, 
    updateCompany, 
    deleteCompany, 
    activeCompanyId, 
    setActiveCompanyId,
    departmentsList,
    candidates,
    jobOpenings 
  } = useRecruitment();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    legalName: '',
    cin: '',
    gstin: '',
    address: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
    email: '',
    phone: '',
    website: '',
    departments: ['HR Recruitment'] as string[],
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      code: '',
      legalName: '',
      cin: '',
      gstin: '',
      address: '',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309',
      email: '',
      phone: '',
      website: '',
      departments: ['HR Recruitment'],
      isActive: true,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      code: comp.code,
      legalName: comp.legalName || '',
      cin: comp.cin || '',
      gstin: comp.gstin || '',
      address: comp.address,
      city: comp.city,
      state: comp.state,
      pincode: comp.pincode || '',
      email: comp.email,
      phone: comp.phone,
      website: comp.website || '',
      departments: comp.departments || [],
      isActive: comp.isActive,
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleToggleDept = (deptName: string) => {
    setFormData(prev => {
      const exists = prev.departments.includes(deptName);
      if (exists) {
        return { ...prev, departments: prev.departments.filter(d => d !== deptName) };
      }
      return { ...prev, departments: [...prev.departments, deptName] };
    });
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Company name is required';
    if (!formData.code.trim()) errors.code = 'Short code is required (e.g. ESL)';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingCompany) {
      updateCompany(editingCompany.id, {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        legalName: formData.legalName.trim() || formData.name.trim(),
        cin: formData.cin.trim(),
        gstin: formData.gstin.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        departments: formData.departments,
        isActive: formData.isActive,
      });
    } else {
      addCompany({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        legalName: formData.legalName.trim() || formData.name.trim(),
        cin: formData.cin.trim(),
        gstin: formData.gstin.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        departments: formData.departments,
        isActive: formData.isActive,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (companies.length <= 1) {
      alert('At least one company must remain in the master registry.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${name} from the Company Master?`)) {
      deleteCompany(id);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      (c.cin && c.cin.toLowerCase().includes(q)) ||
      (c.gstin && c.gstin.toLowerCase().includes(q))
    );
  });

  const totalActive = companies.filter(c => c.isActive).length;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Multiple Company Master</h1>
              <p className="text-xs text-slate-500">
                Manage group entities, subsidiaries, registered legal credentials, and company-specific hiring pipelines
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-add-company"
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Company</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Companies</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{companies.length}</span>
            <span className="text-xs text-slate-500">registered entities</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Entities</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{totalActive}</span>
            <span className="text-xs text-slate-500">actively hiring</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Departments</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{departmentsList.length}</span>
            <span className="text-xs text-slate-500">across companies</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate Pipeline</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600">{candidates.length}</span>
            <span className="text-xs text-slate-500">total applicants</span>
          </div>
        </div>
      </div>

      {/* Active Company Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap mr-1">Active Entity Context:</span>
          <button
            onClick={() => setActiveCompanyId('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeCompanyId === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Companies (Consolidated)
          </button>
          {companies.map(comp => (
            <button
              key={comp.id}
              onClick={() => setActiveCompanyId(comp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeCompanyId === comp.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {comp.code} • {comp.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, CIN, GST..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map(comp => {
          const isCurrentActive = activeCompanyId === comp.id;
          const compDepts = departmentsList.filter(d => d.companyId === comp.id);
          const compJobs = jobOpenings.filter(j => 
            compDepts.some(d => d.name.toLowerCase() === j.department.toLowerCase())
          );

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-xl border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-4 sm:p-5">
                {/* Header with Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black tracking-wider">
                        {comp.code}
                      </span>
                      {comp.isActive ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{comp.name}</h3>
                    {comp.legalName && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{comp.legalName}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(comp)}
                      title="Edit Company"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id, comp.name)}
                      title="Delete Company"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Identification Badges */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {comp.cin && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">CIN:</span>
                      <span className="font-mono font-medium text-slate-700">{comp.cin}</span>
                    </div>
                  )}
                  {comp.gstin && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">GSTIN:</span>
                      <span className="font-mono font-medium text-slate-700">{comp.gstin}</span>
                    </div>
                  )}
                </div>

                {/* Address & Contact */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-600">
                      {comp.address}, {comp.city}, {comp.state} {comp.pincode ? `- ${comp.pincode}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-mono text-slate-700">{comp.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-700 truncate">{comp.email}</span>
                  </div>
                  {comp.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a 
                        href={comp.website} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-blue-600 hover:underline truncate"
                      >
                        {comp.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Linked Departments */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Associated Departments ({comp.departments?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {comp.departments && comp.departments.length > 0 ? (
                      comp.departments.map((dept, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                        >
                          {dept}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400">None assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-50 rounded-b-xl border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-500 font-medium">
                  {compDepts.length} depts • {compJobs.length} active jobs
                </div>
                <button
                  onClick={() => setActiveCompanyId(comp.id)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    isCurrentActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isCurrentActive ? '✓ Active Context' : 'Select Entity'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingCompany ? 'Edit Company Details' : 'Register New Company Master'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add corporate entity profile, GST, CIN, and mapped departments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveCompany} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essential Soul Lifestyle Pvt Ltd"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.name && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. ESL"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 uppercase font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  {formErrors.code && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.code}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Legal / Corporate Name
                </label>
                <input
                  type="text"
                  placeholder="Official registered name as per MCA"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CIN (Corporate Identification Number)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. U74999UP2022PTC168921"
                    value={formData.cin}
                    onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 09AAECE1234F1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Office Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Plot/Building number, tower, floor, area..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                {formErrors.address && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="201309"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hr@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {formErrors.email && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  {formErrors.phone && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Website</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Mapped Departments */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Associated Departments
                </label>
                <div className="flex flex-wrap gap-2">
                  {['HR Recruitment', 'BKD Recruitment', 'Management', 'Retail Store Operations', 'Digital Marketing', 'Customer Care'].map((dept) => {
                    const isChecked = formData.departments.includes(dept);
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => handleToggleDept(dept)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                          isChecked
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {dept}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="comp-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="comp-is-active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Entity is actively operating & open for recruitments
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold text-white shadow-xs"
                >
                  {editingCompany ? 'Save Changes' : 'Create Company'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
