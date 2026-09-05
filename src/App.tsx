import React, { useState } from 'react';
import { RecruitmentProvider } from './context/RecruitmentContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Views
import { ManagementDashboard } from './components/Dashboard/ManagementDashboard';
import { CandidateList } from './components/Candidates/CandidateList';
import { FollowUpPanel } from './components/FollowUps/FollowUpPanel';
import { InterviewPanel } from './components/Interviews/InterviewPanel';
import { SelectedJoiningPipeline } from './components/Pipeline/SelectedJoiningPipeline';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { JobOpeningsPanel } from './components/Jobs/JobOpeningsPanel';
import { AuditLogView } from './components/Audit/AuditLogView';
import { CompanyMaster } from './components/Company/CompanyMaster';
import { UserManagement } from './components/Users/UserManagement';
import { DepartmentMaster } from './components/Departments/DepartmentMaster';
import { TargetManagement } from './components/Targets/TargetManagement';

// Global Modals
import { CandidateModal } from './components/Candidates/CandidateModal';
import { WhatsAppTemplatesModal } from './components/Templates/WhatsAppTemplatesModal';

function AppContent() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const handleNavigate = (navId: string) => {
    if (navId === 'templates') {
      setIsTemplatesOpen(true);
    } else {
      setActiveNav(navId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar with live alerts and role switcher */}
      <Navbar
        onOpenAddCandidate={() => setIsAddCandidateOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        
        {/* Desktop Left Navigation Sidebar */}
        <Sidebar
          activeNav={activeNav}
          onNavigate={handleNavigate}
          onOpenAddCandidate={() => setIsAddCandidateOpen(true)}
        />

        {/* Dynamic Center View Container */}
        <main className="flex-1 p-3 sm:p-4 max-w-full overflow-x-hidden flex flex-col gap-4">
          {activeNav === 'dashboard' && (
            <ManagementDashboard
              onOpenAddCandidate={() => setIsAddCandidateOpen(true)}
              onNavigate={handleNavigate}
            />
          )}

          {activeNav === 'candidates' && (
            <CandidateList onOpenAddModal={() => setIsAddCandidateOpen(true)} />
          )}

          {activeNav === 'followups' && <FollowUpPanel />}

          {activeNav === 'interviews' && <InterviewPanel />}

          {(activeNav === 'joining' || activeNav === 'selected') && (
            <SelectedJoiningPipeline />
          )}

          {activeNav === 'reports' && <ReportsAnalytics />}

          {activeNav === 'companies' && <CompanyMaster />}

          {activeNav === 'users' && <UserManagement />}

          {activeNav === 'departments' && <DepartmentMaster />}

          {activeNav === 'targets' && <TargetManagement />}

          {activeNav === 'jobs' && <JobOpeningsPanel />}

          {activeNav === 'audit' && <AuditLogView />}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar & FAB */}
      <MobileNav
        activeNav={activeNav}
        onNavigate={handleNavigate}
        onOpenAddCandidate={() => setIsAddCandidateOpen(true)}
      />

      {/* Global Modals */}
      <CandidateModal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
      />

      <WhatsAppTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <RecruitmentProvider>
      <AppContent />
    </RecruitmentProvider>
  );
}
