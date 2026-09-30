'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  CheckCircle2, 
  SlidersHorizontal,
  Plus, 
  Video, 
  Share2, 
  IndianRupee, 
  Mic, 
  MicOff, 
  Send, 
  Hand, 
  Menu, 
  X, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Sparkles, 
  BookOpen, 
  LogOut,
  Globe2,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Coffee,
  Ticket,
  Tv,
  ArrowRight,
  Target,
  Compass,
  Check,
  ChevronRight
} from 'lucide-react';

// --- LOGO BRAND COMPONENT ---
const BrandLogo = ({ onClick }: { onClick?: () => void }) => (
  <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onClick}>
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25">
      T
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
        TeachSphere
      </span>
      <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase mt-0.5">
        Learn Beyond Boundaries
      </span>
    </div>
  </div>
);

// --- INTERFACES ---
interface UserSession {
  name: string;
  email: string;
  role: 'student' | 'professor';
  institution: string;
}

interface CohortData {
  id: string;
  category: 'IT' | 'Non-IT';
  tag: string;
  title: string;
  professorName: string;
  professorEmail: string;
  institution: string;
  experienceYrs: number;
  date: string;
  timeSlot: string;
  enrolled: number;
  capacity: number;
  fee: number;
}

const defaultCohorts: CohortData[] = [
  {
    id: 'c-1',
    category: 'Non-IT',
    tag: 'HR Management',
    title: 'Modern Talent Strategy: HR Analytics & Workforce Planning',
    professorName: 'Sathiyavel Tharun',
    professorEmail: 'tharun@teachsphere.edu',
    institution: 'TeachSphere Lead (Ex Capgemini, SVCET)',
    experienceYrs: 5,
    date: '2026-10-17',
    timeSlot: '10:00 AM - 12:00 PM',
    enrolled: 42,
    capacity: 50,
    fee: 299,
  },
  {
    id: 'c-2',
    category: 'Non-IT',
    tag: 'Finance & Trading',
    title: 'Financial Management, Equity Valuation & Trading Strategies',
    professorName: 'Mukthananda Gowd U',
    professorEmail: 'mukthananda@teachsphere.edu',
    institution: 'TeachSphere Strategy (Associate - Capgemini, JNTUA)',
    experienceYrs: 6,
    date: '2026-10-18',
    timeSlot: '04:00 PM - 06:00 PM',
    enrolled: 47,
    capacity: 50,
    fee: 399,
  },
  {
    id: 'c-3',
    category: 'IT',
    tag: 'Java & Spring Boot',
    title: 'Enterprise Java: Microservices, Concurrency & High-Scale APIs',
    professorName: 'Prof. Rajesh Khanna',
    professorEmail: 'rajesh@iiit.ac.in',
    institution: 'IIIT Hyderabad',
    experienceYrs: 14,
    date: '2026-10-17',
    timeSlot: '06:00 PM - 08:00 PM',
    enrolled: 48,
    capacity: 50,
    fee: 349,
  },
  {
    id: 'c-4',
    category: 'IT',
    tag: 'Python & Data',
    title: 'Python for Systems, Automation & Applied Data Pipelines',
    professorName: 'Dr. Arvind Joshi',
    institution: 'IIT Bombay',
    professorEmail: 'arvind@iitb.ac.in',
    experienceYrs: 10,
    date: '2026-10-18',
    timeSlot: '10:00 AM - 12:00 PM',
    enrolled: 44,
    capacity: 50,
    fee: 349,
  },
  {
    id: 'c-5',
    category: 'IT',
    tag: 'HR Tech Systems',
    title: 'Enterprise HR Tech: SuccessFactors & Zoho People Implementation',
    professorName: 'Sathiyavel Tharun',
    professorEmail: 'tharun@teachsphere.edu',
    institution: 'TeachSphere Lead (Ex Capgemini, SVCET)',
    experienceYrs: 5,
    date: '2026-10-31',
    timeSlot: '02:00 PM - 04:00 PM',
    enrolled: 29,
    capacity: 45,
    fee: 199,
  }
];

export default function TeachSphereMaster() {
  const [currentPage, setCurrentPage] = useState<'home' | 'courses' | 'about' | 'founder' | 'student-dash' | 'faculty-dash' | 'live' | 'auth'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User & persistence
  const [user, setUser] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authRole, setAuthRole] = useState<'student' | 'professor'>('student');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', institution: '' });
// OTP Verification States
  const [otpStep, setOtpStep] = useState<'form' | 'verify'>('form');
  const [inputOtp, setInputOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  // Cohort & enrollment state
  const [cohorts, setCohorts] = useState<CohortData[]>(defaultCohorts);
  const [enrolledCohortIds, setEnrolledCohortIds] = useState<string[]>([]);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Search & Filter state for Courses page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Faculty Schedule Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newCohort, setNewCohort] = useState({
    title: '',
    category: 'IT' as 'IT' | 'Non-IT',
    tag: 'Fullstack Integrations',
    date: '2026-11-01',
    timeSlot: '10:00 AM - 12:00 PM',
    capacity: 50,
    fee: 299,
    
  });

  // Classroom state
  const [activeLiveCohort, setActiveLiveCohort] = useState<CohortData | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([
    { sender: 'Pooja (B.Tech 3rd Yr)', text: 'The live doubt solving in real-time is amazing.' },
    { sender: 'Arun (JNTUA)', text: 'Can we also access the recording and notes after this session?' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ts_user');
    const savedEnrollments = localStorage.getItem('ts_enrollments');
    const savedCohorts = localStorage.getItem('ts_cohorts');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedEnrollments) setEnrolledCohortIds(JSON.parse(savedEnrollments));
    if (savedCohorts) setCohorts(JSON.parse(savedCohorts));
  }, []);

  const triggerNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

// Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'verify' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpStep, timerSeconds]);

  // 1. Generate & Send OTP
  const handleInitiateOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email || !authForm.name) {
      triggerNotice('Please provide your name and email.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpStep('verify');
    setTimerSeconds(60);
    setCanResend(false);
    setInputOtp('');

    triggerNotice(`Verification code sent to ${authForm.email}: [ ${code} ]`);
  };

  // 2. Validate OTP & Create Account
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOtp.trim() !== generatedOtp.trim()) {
      triggerNotice('Invalid verification code! Please check and try again.');
      return;
    }

    const session: UserSession = {
      name: authForm.name,
      email: authForm.email,
      role: authRole,
      institution: authForm.institution || (authRole === 'professor' ? 'Affiliated College' : 'Engineering Institution'),
    };

    setUser(session);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ts_user', JSON.stringify(session));
    }

    setOtpStep('form');
    triggerNotice(`Email verified successfully! Welcome to TeachSphere, ${session.name}.`);
    
    if (session.role === 'professor') {
      navigateTo('faculty-dash');
    } else {
      navigateTo('student-dash');
    }
  };

  // 3. Direct Login for Existing Users
  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email) return;

    const session: UserSession = {
      name: authForm.name || (authRole === 'professor' ? 'Prof. Faculty User' : 'Student Scholar'),
      email: authForm.email,
      role: authRole,
      institution: authForm.institution || 'Partner Campus',
    };

    setUser(session);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ts_user', JSON.stringify(session));
    }
    triggerNotice(`Signed in successfully as ${session.name}!`);
    navigateTo(session.role === 'professor' ? 'faculty-dash' : 'student-dash');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ts_user');
    triggerNotice('Logged out successfully.');
    navigateTo('home');
  };

  const handleEnroll = (cohort: CohortData) => {
    if (!user) {
      setAuthRole('student');
      setAuthMode('signup');
      triggerNotice('Create your student account to reserve your weekend seat!');
      navigateTo('auth');
      return;
    }

    if (enrolledCohortIds.includes(cohort.id)) {
      triggerNotice('You are already registered for this cohort! Opening your dashboard.');
      navigateTo('student-dash');
      return;
    }

    const updatedCohortList = cohorts.map(c => 
      c.id === cohort.id ? { ...c, enrolled: c.enrolled + 1 } : c
    );
    const updatedEnrollments = [...enrolledCohortIds, cohort.id];

    setCohorts(updatedCohortList);
    setEnrolledCohortIds(updatedEnrollments);
    localStorage.setItem('ts_cohorts', JSON.stringify(updatedCohortList));
    localStorage.setItem('ts_enrollments', JSON.stringify(updatedEnrollments));

    triggerNotice(`Successfully enrolled in: "${cohort.title}"!`);
    navigateTo('student-dash');
  };

  const handleCreateCohort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohort.title) return;

    const created: CohortData = {
      id: `c-${Date.now()}`,
      category: newCohort.category,
      tag: newCohort.tag,
      title: newCohort.title,
      professorName: user ? user.name : 'Prof. Guest Faculty',
      professorEmail: user ? user.email : 'faculty@teachsphere.edu',
      institution: user ? user.institution : 'Partner University',
      experienceYrs: 8,
      date: newCohort.date,
      timeSlot: newCohort.timeSlot,
      enrolled: 0,
      capacity: Number(newCohort.capacity),
      fee: Number(newCohort.fee),
    };

    const updated = [created, ...cohorts];
    setCohorts(updated);
    localStorage.setItem('ts_cohorts', JSON.stringify(updated));
    setShowScheduleModal(false);
    triggerNotice(`Masterclass "${created.title}" is published live!`);
    navigateTo('courses');
  };

  const navigateTo = (page: typeof currentPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCohorts = cohorts.filter((cohort) => {
    const matchesSearch = 
      cohort.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.professorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = 
      selectedTag === 'All' || 
      (selectedTag === 'IT' && cohort.category === 'IT') ||
      (selectedTag === 'Non-IT' && cohort.category === 'Non-IT') ||
      cohort.tag.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  const enrolledCohortsData = cohorts.filter(c => enrolledCohortIds.includes(c.id));

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">

  {/* --- AMBIENT WAVING BACKGROUND EFFECT --- */}
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Wave Blob 1 - Indigo/Sky Glow */}
    <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-gradient-to-br from-indigo-200/50 via-sky-200/40 to-transparent rounded-full blur-3xl animate-wave-1" />

    {/* Wave Blob 2 - Violet/Cyan Flow */}
    <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-gradient-to-tl from-violet-200/40 via-blue-200/30 to-transparent rounded-full blur-3xl animate-wave-2" />

    {/* Wave Blob 3 - Gentle Bottom Glow */}
    <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-sky-200/40 via-indigo-100/30 to-transparent rounded-full blur-3xl animate-wave-1" />

    {/* Gentle SVG Curved Wave Ribbon */}
    <div className="absolute top-16 left-0 right-0 opacity-20">
      <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
        <path 
          fill="#3B82F6" 
          fillOpacity="0.3" 
          d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,122.7C672,128,768,192,864,208C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
    </div>
  </div>

 
...
      {/* Toast Alert */}
      {feedbackNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo onClick={() => navigateTo('home')} />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <button 
              onClick={() => navigateTo('home')}
              className={`transition hover:text-indigo-600 ${currentPage === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
            >
              Home &amp; Mission
            </button>
            <button 
              onClick={() => navigateTo('courses')}
              className={`transition hover:text-indigo-600 ${currentPage === 'courses' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
            >
              Live Cohorts
            </button>
            <button 
              onClick={() => navigateTo('founder')}
              className={`transition hover:text-indigo-600 ${currentPage === 'founder' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
            >
              Founders &amp; Story
            </button>
            <button 
              onClick={() => navigateTo('about')}
              className={`transition hover:text-indigo-600 ${currentPage === 'about' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
            >
              Global Vision
            </button>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'student' ? (
                  <button 
                    onClick={() => navigateTo('student-dash')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 hover:bg-indigo-100 transition"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    My Learning ({enrolledCohortIds.length})
                  </button>
                ) : (
                  <button 
                    onClick={() => navigateTo('faculty-dash')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Faculty Studio
                  </button>
                )}

                <div className="text-right leading-none">
                  <span className="text-xs font-bold text-slate-800 block">{user.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                </div>

                <button 
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setAuthRole('student'); setAuthMode('login'); navigateTo('auth'); }}
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 transition"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setAuthRole('professor'); setAuthMode('signup'); navigateTo('auth'); }}
                  className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl transition"
                >
                  Join as Faculty
                </button>
                <button 
                  onClick={() => { setAuthRole('student'); setAuthMode('signup'); navigateTo('auth'); }}
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-500/25 transition"
                >
                  Student Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <button onClick={() => navigateTo('home')} className="block w-full text-left py-2 font-medium text-slate-700">Home &amp; Mission</button>
            <button onClick={() => navigateTo('courses')} className="block w-full text-left py-2 font-medium text-slate-700">Live Cohorts</button>
            <button onClick={() => navigateTo('founder')} className="block w-full text-left py-2 font-medium text-slate-700">Founders &amp; Story</button>
            <button onClick={() => navigateTo('about')} className="block w-full text-left py-2 font-medium text-slate-700">Global Vision</button>
            
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="py-1 text-xs text-slate-500 font-semibold">Active: {user.name} ({user.role})</div>
                  <button 
                    onClick={() => navigateTo(user.role === 'student' ? 'student-dash' : 'faculty-dash')} 
                    className="w-full text-center py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl"
                  >
                    Open Dashboard
                  </button>
                  <button onClick={handleLogout} className="w-full text-center py-2 text-xs font-bold border border-red-200 text-red-600 rounded-xl">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { setAuthRole('student'); setAuthMode('signup'); navigateTo('auth'); }}
                    className="w-full text-center py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl"
                  >
                    Student Registration
                  </button>
                  <button 
                    onClick={() => { setAuthRole('professor'); setAuthMode('signup'); navigateTo('auth'); }}
                    className="w-full text-center py-2 text-xs font-bold bg-slate-800 text-white rounded-xl"
                  >
                    Faculty Registration
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* 1. HOME / OBJECTIVES / IMPACT & COST-COMPARISON (NEW DISCOVERY) */}
      {/* ============================================================== */}
      {currentPage === 'home' && (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/60 via-[#F0F7FF] to-[#F0F7FF] border-b border-slate-200 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 mb-6 border border-indigo-200 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> A Groundbreaking Paradigm in Higher Education
                </span>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] mb-6">
                  Great university teaching should never be locked behind <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">campus walls.</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
                  TeachSphere dismantles regional gatekeeping. We enable verified university professors to host synchronous live weekend masterclasses for students across Tier-2, Tier-3, and remote colleges at micro-prices.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => navigateTo('courses')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                  >
                    Explore Weekend Cohorts <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setAuthRole('professor'); setAuthMode('signup'); navigateTo('auth'); }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm shadow-sm transition"
                  >
                    Teach on TeachSphere (Faculty)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Core Objectives */}
          <section className="py-16 sm:py-20 bg-transparent border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Core Purpose
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  The Four Strategic Objectives of TeachSphere
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Engineered to correct systemic inequities in modern academic models.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-indigo-500/20">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Cross-Campus Access</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Eliminating geographical barriers so an engineering student in a rural district can learn directly from professors at premier universities.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-violet-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Live Dynamic Learning</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unlike static pre-recorded courses with 5% completion rates, synchronized weekend classes provide real-time doubt resolution and peer energy.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-emerald-500/20">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Radical Affordability</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Priced at ₹199–₹399 per cohort. Quality mentorship priced lower than everyday discretionary expenses, accessible to every underprivileged scholar.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-amber-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Faculty Sovereignty</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verified professors gain direct intellectual and financial empowerment, monetizing their weekend mastery with nationwide student reach.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Who It Helps: Students vs Faculty */}
          <section className="py-16 sm:py-20 bg-[#E8F3FF]/50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Target Beneficiaries
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Built For Both Sides of the Classroom
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* For Students */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">For Undergrads &amp; Candidates</h3>
                      <p className="text-xs text-slate-500">Unlocking elite knowledge for every college tier</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>No relocation or elite tuition fees:</strong> Gain domain mastery from renowned university minds right from home.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Weekend schedule integrity:</strong> Attend intensive 2-hour masterclasses on Saturdays and Sundays without impacting regular semester attendance.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Real-time Q&amp;A:</strong> Clear doubts instantly with raised hands and dedicated interactive faculty queues.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Employability boost:</strong> Master high-yield IT (Spring Boot, Cloud, Python) and Non-IT (Equity Valuation, HR Tech, PMP) skills.</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => navigateTo('courses')}
                    className="mt-8 w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    Browse Available Classes <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* For Faculty */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">For University Faculty &amp; Mentors</h3>
                      <p className="text-xs text-slate-500">Expanding teaching footprint and income</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Pan-India visibility:</strong> Teach cohorts of 40–60 passionate students beyond the restrictions of your affiliated college hall.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Autonomous scheduling:</strong> Choose your topics, set your class dates, and define student ticket rates with total freedom.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Direct digital payouts:</strong> Transparent revenue sharing delivered directly via integrated UPI payouts.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Verified academic badge:</strong> Official verification validating your university credentials and domain authority.</span>
                    </li>
                  </ul>

                  <button 
                    onClick={() => { setAuthRole('professor'); setAuthMode('signup'); navigateTo('auth'); }}
                    className="mt-8 w-full py-3 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    Register as Verified Faculty <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Micro-Pricing Comparison: Accessibility for Underprivileged Students */}
          <section className="py-16 sm:py-20 bg-transparent border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Equal Opportunity Tech
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Radical Price Democratization: What Does a Class Actually Cost?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  We deliberate on everyday micro-expenses so that socioeconomic status never hinders academic progression.
                </p>
              </div>

              {/* Cost Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                
                {/* 1. Cafe Coffee */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Coffee className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">1 Café Coffee</h4>
                    <p className="text-xs text-slate-500 mt-1">One-time casual beverage</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/60 mt-4">
                    <span className="text-lg font-black text-slate-700">₹250 – ₹350</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Consumed in 20 minutes</span>
                  </div>
                </div>

                {/* 2. Movie Ticket */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Weekend Cinema Ticket</h4>
                    <p className="text-xs text-slate-500 mt-1">Single movie admission</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/60 mt-4">
                    <span className="text-lg font-black text-slate-700">₹300 – ₹450</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">3 hours of entertainment</span>
                  </div>
                </div>

                {/* 3. Fast Food Combo */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-orange-100 text-orange-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Tv className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Streaming Subscription</h4>
                    <p className="text-xs text-slate-500 mt-1">Monthly entertainment plan</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/60 mt-4">
                    <span className="text-lg font-black text-slate-700">₹299 – ₹499</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Passive screen time</span>
                  </div>
                </div>

                {/* 4. TeachSphere Masterclass */}
                <div className="bg-gradient-to-b from-indigo-600 to-violet-700 text-white rounded-2xl p-5 text-center flex flex-col justify-between shadow-xl shadow-indigo-600/20 scale-105 border-2 border-indigo-400">
                  <div>
                    <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-white text-base">TeachSphere Live Cohort</h4>
                    <p className="text-xs text-indigo-100 mt-1">Live Professor Masterclass</p>
                  </div>
                  <div className="pt-4 border-t border-white/20 mt-4">
                    <span className="text-xl font-black text-white">₹199 – ₹299</span>
                    <span className="block text-[10px] text-emerald-300 font-bold mt-0.5">Lifelong career foundation</span>
                  </div>
                </div>

              </div>

              <div className="max-w-2xl mx-auto mt-12 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                  💡 By optimizing streaming infrastructure and group-based cohort economics, TeachSphere empowers students from low-income families to access premier university education at the cost of a single sandwich.
                </p>
              </div>
            </div>
          </section>

          {/* Scope and Future Global Expansion */}
          <section className="py-16 sm:py-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-14">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                  Long-Term Horizon
                </span>
                <h2 className="text-2xl sm:text-4xl font-black mt-3">
                  Scope &amp; International Expansion Roadmap
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2">
                  Starting with Indian state universities, moving toward an interconnected global knowledge network.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/70 border border-slate-700/80 p-6 rounded-3xl">
                  <span className="text-xs font-mono font-bold text-indigo-400">Phase 1 &bull; 2026</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">Pan-India Inter-University Grid</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connecting Tier-2 and Tier-3 institutions across Andhra Pradesh, Telangana, Karnataka, Tamil Nadu, and Maharashtra with faculty from premier tech and management universities.
                  </p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 p-6 rounded-3xl">
                  <span className="text-xs font-mono font-bold text-violet-400">Phase 2 &bull; 2027</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">Cross-Border SAARC &amp; ASEAN</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Expanding live cohorts into Sri Lanka, Bangladesh, Nepal, and Southeast Asia, sharing localized STEM, FinTech, and Data curriculum across developing economies.
                  </p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/80 p-6 rounded-3xl">
                  <span className="text-xs font-mono font-bold text-emerald-400">Phase 3 &bull; 2028</span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">Global Micro-Degree Accreditations</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Partnering with international academic councils to deliver credit-transferable weekend cohorts taught by verified global professors with blockchain-verified credentials.
                  </p>
                </div>
              </div>

              <div className="mt-14 text-center">
                <button 
                  onClick={() => navigateTo('courses')}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Join the Movement &bull; View Live Cohorts
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ============================================================== */}
      {/* 2. LIVE COHORTS EXPLORER (SEARCH / FILTER & INSTANT ENROLLMENT) */}
      {/* ============================================================== */}
      {currentPage === 'courses' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Live Weekend Masterclasses
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Browse &amp; Enroll in Live Cohorts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Taught live by verified university professors. Reserve your seat with your email.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 shadow-sm mb-8">
            <div className="relative sm:col-span-6">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, professor, or institution..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-3">
              <select 
                value={selectedTag} 
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Disciplines ({cohorts.length})</option>
                <option value="IT">All IT &amp; Engineering</option>
                <option value="Non-IT">All Management &amp; Non-IT</option>
                <option value="HR Management">HR Management</option>
                <option value="Finance & Trading">Finance &amp; Trading</option>
                <option value="Java & Spring Boot">Java Microservices</option>
                <option value="HR Tech Systems">SuccessFactors &amp; Zoho</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button 
                onClick={() => { setSelectedTag('All'); setSearchQuery(''); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-700 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCohorts.map((cohort) => {
              const isEnrolled = enrolledCohortIds.includes(cohort.id);
              const fillRatio = (cohort.enrolled / cohort.capacity) * 100;
              const isNearFull = cohort.capacity - cohort.enrolled <= 5;

              return (
                <div 
                  key={cohort.id} 
                  className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          cohort.category === 'IT' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}>
                          {cohort.category}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                          {cohort.tag}
                        </span>
                      </div>
                      {isNearFull && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          {cohort.capacity - cohort.enrolled} Left!
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-3">
                      {cohort.title}
                    </h3>

                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                        <span>{cohort.professorName}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 fill-current" />
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {cohort.institution}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cohort.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cohort.timeSlot}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                          <Users className="w-3 h-3 text-slate-400" />
                          {cohort.enrolled}/{cohort.capacity} Registered
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600">{Math.round(fillRatio)}% filled</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${fillRatio}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Ticket Fee</span>
                      <span className="text-sm font-black text-slate-900">
                        {cohort.fee === 0 ? 'Free' : `₹${cohort.fee}`}
                      </span>
                    </div>
                    
                    {isEnrolled ? (
                      <button 
                        onClick={() => { setActiveLiveCohort(cohort); navigateTo('live'); }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" /> Enter Class
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEnroll(cohort)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* 3. STUDENT DASHBOARD                                           */}
      {/* ============================================================== */}
      {currentPage === 'student-dash' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="bg-gradient-to-r from-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20">
                  Student Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-2">Welcome back, {user?.name || 'Scholar'}!</h1>
                <p className="text-indigo-100 text-xs mt-1">
                  Institution: <span className="font-semibold text-white">{user?.institution}</span> &bull; Email: {user?.email}
                </p>
              </div>
              <button 
                onClick={() => navigateTo('courses')}
                className="px-4 py-2.5 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition self-start sm:self-auto"
              >
                + Browse More Cohorts
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Your Enrolled Cohorts ({enrolledCohortsData.length})</h2>
            <p className="text-xs text-slate-500">Live weekend classes confirmed with your email</p>
          </div>

          {enrolledCohortsData.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto my-6">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Cohorts Enrolled Yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                You haven&apos;t reserved any weekend classes yet. Join live sessions taught by verified university professors.
              </p>
              <button 
                onClick={() => navigateTo('courses')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
              >
                Explore Live Cohorts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCohortsData.map((cohort) => (
                <div key={cohort.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                      Confirmed Registration
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-3 mb-2">{cohort.title}</h3>
                    <p className="text-xs text-slate-600 font-semibold">{cohort.professorName}</p>
                    <p className="text-[11px] text-slate-400 mb-4">{cohort.institution}</p>
                    
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{cohort.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{cohort.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Status: Registered</span>
                    <button 
                      onClick={() => { setActiveLiveCohort(cohort); navigateTo('live'); }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Live Classroom
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ============================================================== */}
      {/* 4. FACULTY DASHBOARD                                           */}
      {/* ============================================================== */}
      {currentPage === 'faculty-dash' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty Cohort Studio</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">Verified Educator</span>
              </div>
              <p className="text-xs text-slate-500">
                Welcome, {user?.name || 'Professor'}. Manage your weekend live schedule and student rosters.
              </p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition"
            >
              <Plus className="w-4 h-4" /> Schedule New Weekend Class
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Scheduled Classes</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{cohorts.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Total Enrolled Students</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">
                {cohorts.reduce((acc, curr) => acc + curr.enrolled, 0)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Total Ticket Receipts</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                ₹{cohorts.reduce((acc, curr) => acc + (curr.enrolled * curr.fee), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Your Scheduled Cohorts
            </h2>
            <div className="space-y-4">
              {cohorts.map((cohort) => (
                <div key={cohort.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                        {cohort.tag}
                      </span>
                      <span className="text-xs text-slate-500">{cohort.date} • {cohort.timeSlot}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{cohort.title}</h3>
                    <p className="text-xs text-slate-500">
                      <span className="font-bold text-indigo-600">{cohort.enrolled}</span> of {cohort.capacity} students registered &bull; Ticket Fee: ₹{cohort.fee}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerNotice(`Link copied: https://teachsphere.in/c/${cohort.id}`)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold hover:bg-white text-slate-700"
                    >
                      Copy Link
                    </button>
                    <button 
                      onClick={() => { setActiveLiveCohort(cohort); navigateTo('live'); }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Video className="w-3.5 h-3.5" /> Launch Classroom
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Class Modal */}
          {showScheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule New Weekend Class</h3>
                <p className="text-xs text-slate-500 mb-4">This cohort will immediately be published to the student live catalog.</p>
                <form onSubmit={handleCreateCohort} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">Class Title</label>
                    <input 
                      type="text" 
                      required
                      value={newCohort.title} 
                      onChange={e => setNewCohort({ ...newCohort, title: e.target.value })}
                      placeholder="e.g. Advanced Microservice Architectures in Spring Boot" 
                      className="w-full p-2.5 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Category</label>
                      <select 
                        value={newCohort.category}
                        onChange={e => setNewCohort({ ...newCohort, category: e.target.value as any })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="IT">IT &amp; Software</option>
                        <option value="Non-IT">Non-IT &amp; Management</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Subject Tag</label>
                      <input 
                        type="text" 
                        value={newCohort.tag} 
                        onChange={e => setNewCohort({ ...newCohort, tag: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Class Date</label>
                      <input 
                        type="date" 
                        value={newCohort.date}
                        onChange={e => setNewCohort({ ...newCohort, date: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Time Slot</label>
                      <input 
                        type="text" 
                        value={newCohort.timeSlot}
                        onChange={e => setNewCohort({ ...newCohort, timeSlot: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Max Capacity</label>
                      <input 
                        type="number" 
                        value={newCohort.capacity}
                        onChange={e => setNewCohort({ ...newCohort, capacity: Number(e.target.value) })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700">Ticket Price (INR)</label>
                      <input 
                        type="number" 
                        value={newCohort.fee}
                        onChange={e => setNewCohort({ ...newCohort, fee: Number(e.target.value) })}
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowScheduleModal(false)} 
                      className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                      Publish Cohort
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ============================================================== */}
      {/* 5. LIVE CLASSROOM                                              */}
      {/* ============================================================== */}
      {currentPage === 'live' && (
        <main className="h-[calc(100vh-4rem)] bg-slate-950 flex flex-col text-slate-100 overflow-hidden">
          <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-200 truncate">
                {activeLiveCohort ? activeLiveCohort.title : 'Live Cohort'} &bull; {activeLiveCohort?.professorName || 'Professor'}
              </span>
            </div>
            <button 
              onClick={() => navigateTo('home')} 
              className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-1 bg-rose-950/40 rounded-lg border border-rose-800/40 transition"
            >
              Exit Classroom
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 relative bg-slate-900 m-3 rounded-2xl border border-slate-800 flex items-center justify-center">
              <div className="text-center p-6">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-400">Interactive Digital Whiteboard Stream</p>
                <p className="text-xs text-slate-600 mt-1">&psi;(x, t) = A &middot; exp(i(kx - &omega;t)) &mdash; Synchronized Live Feed</p>
              </div>

              <div className="absolute bottom-4 left-4 w-40 h-28 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col justify-between">
                <span className="text-[10px] text-emerald-400 font-mono">● {activeLiveCohort?.professorName || 'Host'}</span>
                <span className="text-center text-[10px] text-slate-500">Camera Source</span>
                <div className="w-2 h-2 rounded-full bg-indigo-500 self-end" />
              </div>
            </div>

            {/* Chat */}
            <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
              <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300">
                Live Cohort Q&amp;A
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                {chatLog.map((chat, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-indigo-400">{chat.sender}:</span>
                    <p className="text-slate-300 mt-0.5">{chat.text}</p>
                  </div>
                ))}
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatMessage.trim()) return;
                  setChatLog([...chatLog, { sender: user?.name || 'You', text: chatMessage }]);
                  setChatMessage('');
                }}
                className="p-3 border-t border-slate-800 flex gap-2"
              >
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a question..." 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
                <button type="submit" className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          <div className="h-14 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMicActive(!micActive)} 
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${micActive ? 'bg-slate-800 text-slate-300' : 'bg-rose-500/20 text-rose-400'}`}
              >
                {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />} {micActive ? 'Muted' : 'Unmuted'}
              </button>
            </div>
            <button 
              onClick={() => triggerNotice('Hand raised! Professor has been alerted.')}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20"
            >
              <Hand className="w-3.5 h-3.5" /> Raise Hand to Speak
            </button>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* AUTHENTICATION WITH MANDATORY EMAIL OTP VERIFICATION           */}
      {/* ============================================================== */}
      {currentPage === 'auth' && (
        <main className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <BrandLogo />
              </div>
              
              {otpStep === 'form' ? (
                <>
                  <h2 className="text-xl font-black text-slate-900 mt-2">
                    {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {authMode === 'signup' 
                      ? 'Official email OTP verification is mandatory for all members.' 
                      : 'Sign in to access your cohorts and studio.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-100 p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setAuthRole('student')} 
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${authRole === 'student' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                    >
                      Candidate / Student
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAuthRole('professor')} 
                      className={`py-1.5 text-xs font-bold rounded-lg transition ${authRole === 'professor' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
                    >
                      Faculty / Professor
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-indigo-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Verify Your Email</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    We sent a 6-digit verification code to:
                    <span className="block font-bold text-slate-900 text-xs mt-0.5">{authForm.email}</span>
                  </p>
                </>
              )}
            </div>

            {/* STAGE 1: FORM INPUT */}
            {otpStep === 'form' && (
              <form className="space-y-3.5 text-xs" onSubmit={authMode === 'signup' ? handleInitiateOtp : handleDirectLogin}>
                {authMode === 'signup' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                    <input 
                      type="text" 
                      required
                      value={authForm.name}
                      onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                      placeholder={authRole === 'professor' ? 'e.g. Prof. R. Swamy' : 'e.g. Sathiyavel Tharun'} 
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official / College Email</label>
                  <input 
                    type="email" 
                    required
                    value={authForm.email}
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="name@college.edu or name@gmail.com" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Affiliated College / University</label>
                    <input 
                      type="text" 
                      required
                      value={authForm.institution}
                      onChange={e => setAuthForm({ ...authForm, institution: e.target.value })}
                      placeholder={authRole === 'professor' ? 'Current University Name' : 'Enrolled College'} 
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder="••••••••" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 mt-2 flex items-center justify-center gap-1.5"
                >
                  {authMode === 'signup' ? (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    'Sign In Now'
                  )}
                </button>
              </form>
            )}

            {/* STAGE 2: 6-DIGIT OTP VERIFICATION */}
            {otpStep === 'verify' && (
              <form className="space-y-4 text-xs" onSubmit={handleVerifyOtp}>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 text-center">
                    Enter 6-Digit Verification PIN
                  </label>
                  <input 
                    type="text" 
                    maxLength={6}
                    required
                    autoFocus
                    value={inputOtp}
                    onChange={e => setInputOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •" 
                    className="w-full py-3 text-center tracking-[0.5em] text-2xl font-black bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 rounded-xl focus:outline-none text-indigo-950 font-mono shadow-inner"
                  />
                </div>

                {/* Live Simulation Code Display */}
                <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-2.5 text-center">
                  <span className="text-[11px] text-slate-600 font-semibold block">Simulated Email PIN:</span>
                  <span className="text-sm font-black text-indigo-700 tracking-widest">{generatedOtp}</span>
                </div>

                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500 font-medium">
                    {timerSeconds > 0 ? (
                      `Expires in 00:${timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}`
                    ) : (
                      <span className="text-red-500 font-bold">Code expired</span>
                    )}
                  </span>
                  
                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={() => {
                      const code = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOtp(code);
                      setTimerSeconds(60);
                      setCanResend(false);
                      triggerNotice(`New verification code sent: [ ${code} ]`);
                    }}
                    className={`font-bold transition ${canResend ? 'text-indigo-600 hover:underline' : 'text-slate-300 cursor-not-allowed'}`}
                  >
                    Resend Code
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Email &amp; Complete Registration</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setOtpStep('form')}
                  className="w-full text-center text-slate-500 hover:text-slate-800 text-xs font-semibold pt-1"
                >
                  &larr; Change Email Address
                </button>
              </form>
            )}

            {/* Toggle Login / Signup */}
            {otpStep === 'form' && (
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  {authMode === 'signup' ? 'Already registered? Sign In' : 'Need an account? Register with Email OTP'}
                </button>
              </div>
            )}

          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* 7. CO-FOUNDERS & STORY                                         */}
      {/* ============================================================== */}
      {currentPage === 'founder' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Leadership &amp; Vision
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              The Minds Behind TeachSphere
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Bridging university masterclasses, corporate consulting, and fintech innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Founder 1 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-700 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-indigo-500/20 shrink-0">
                    TS
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      Tharun Sathiyavel
                    </h2>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">
                      Co-Founder &amp; Chief of Technology, Head of HR, COO, Academic Lead
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Academic &amp; Talent Strategy
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    Ex Assistant Professor, SVCET, AP
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    Ex HR Specialist, Capgemini
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    MBA – JNTUA (FinTech &amp; HR)
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Having taught at SVCET, Tharun experienced firsthand how top-tier academic mentorship is often restricted to single institutional campuses. Combining this with corporate talent analytics at Capgemini, he spearheads educator onboarding, academic rigor, and university partnerships.
                </p>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-700 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-purple-500/20 shrink-0">
                    MG
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      Mukthananda Gowd U
                    </h2>
                    <p className="text-xs font-bold text-violet-600 mt-0.5">
                      Co-Founder, CEO, CMO &amp; Head of Consulting
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Consulting, Growth &amp; Strategy
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    Associate – Capgemini
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    MBA – Financial Technology, JNTUA
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    Head of Enterprise Consulting
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Bringing deep corporate experience from Capgemini and specialized expertise in Financial Technology from JNTUA, Mukthananda directs TeachSphere’s strategic growth, marketing architecture, consulting verticals, and financial sustainability models.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
              Our Unified Story &amp; Vision
            </h2>

            <blockquote className="italic text-slate-800 font-medium border-l-4 border-indigo-600 pl-4 py-1 bg-slate-50 rounded-r-lg text-sm mb-4">
              &ldquo;The right teacher can change the way a student sees the world.&rdquo;
            </blockquote>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                TeachSphere was founded by <strong>Tharun Sathiyavel</strong> and <strong>Mukthananda Gowd U</strong> at the crossroads of academic lecture halls, financial technology, and corporate consulting.
              </p>
              <p>
                Both alumni of <strong>JNTUA with Master’s degrees in Financial Technology &amp; Management</strong>, and colleagues with strong corporate foundations at <strong>Capgemini</strong>, they asked:
              </p>
              
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-indigo-950 font-semibold text-center my-3">
                &ldquo;What if students could learn directly from top university professors beyond their own college gates?&rdquo;
              </div>

              <p className="font-bold text-slate-900">
                Because great teaching should never have boundaries.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* ============================================================== */}
      {/* 8. ABOUT & GLOBAL VISION                                       */}
      {/* ============================================================== */}
      {currentPage === 'about' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Democratizing Academic Excellence</h1>
            <p className="text-base text-slate-600">A student&apos;s geographic location or college tier should never restrict the quality of education they receive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">01</div>
              <h3 className="font-bold text-slate-900 mb-2">Cross-Campus Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Students from all colleges get direct weekend cohort learning from veteran professors across premier institutions.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">02</div>
              <h3 className="font-bold text-slate-900 mb-2">Weekend Masterclasses</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Structured weekend-only models that allow students to clear complex syllabus hurdles without interfering with regular weekday classes.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">03</div>
              <h3 className="font-bold text-slate-900 mb-2">Faculty Empowerment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Enabling recognized educators to expand their teaching beyond campus walls, mentoring learners nationwide.</p>
            </div>
          </div>
        </main>
      )}

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <BrandLogo onClick={() => navigateTo('home')} />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>&copy; 2026 TeachSphere Technologies. All rights reserved.</span>
          </div>
          <div className="flex gap-6 font-semibold">
            <button onClick={() => navigateTo('home')} className="hover:text-slate-900">Home &amp; Objectives</button>
            <button onClick={() => navigateTo('courses')} className="hover:text-slate-900">Live Cohorts</button>
            <button onClick={() => navigateTo('founder')} className="hover:text-slate-900">Founders &amp; Story</button>
            <button onClick={() => navigateTo('about')} className="hover:text-slate-900">Global Vision</button>
          </div>
        </div>
      </footer>
    </div>
    </div>
    );
  }