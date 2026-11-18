import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Scale,
  BarChart3,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Share2,
  Smartphone,
  Copy,
  ChevronDown,
  ChevronUp,
  Home,
  ShoppingCart,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Plane,
  Repeat,
  Heart,
  User,
  MoreHorizontal,
  Briefcase,
  RefreshCw,
  Gift,
  Wallet,
  Sparkles,
  Check
} from 'lucide-react';

// ============================================================================
// CONSTANTS, ICONS & DEFAULT SEED DATA
// ============================================================================

const STORAGE_KEY = 'pf_shared_ledger_v1';
const LEGACY_STORAGE_KEY = 'fintrack_dual_shared_v1';

const ICON_MAP = {
  Home,
  ShoppingCart,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Plane,
  Repeat,
  Heart,
  User,
  MoreHorizontal,
  Briefcase,
  RefreshCw,
  Gift,
  Wallet,
  Coins
};

const ICON_NAMES = Object.keys(ICON_MAP);

const COLOR_PALETTE = [
  '#4f46e5', // Indigo
  '#0d9488', // Teal
  '#e11d48', // Rose
  '#d97706', // Amber
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#059669', // Emerald
  '#db2777', // Pink
  '#ea580c', // Orange
  '#475569'  // Slate
];

const DEFAULT_PEOPLE = [
  { id: 'me', name: 'Me', color: '#4f46e5' },
  { id: 'p2', name: 'Omar (Person 2)', color: '#0d9488' },
  { id: 'p3', name: 'Sara (Person 3)', color: '#d97706' }
];

const DEFAULT_SECTIONS = [
  { id: 'sec_housing', name: 'Housing & Bills', type: 'expense' },
  { id: 'sec_daily', name: 'Daily Living', type: 'expense' },
  { id: 'sec_lifestyle', name: 'Lifestyle & Personal', type: 'expense' },
  { id: 'sec_income', name: 'Income Sources', type: 'income' }
];

const DEFAULT_CATEGORIES = [
  { id: 'cat_rent', sectionId: 'sec_housing', name: 'Rent', icon: 'Home', color: '#4f46e5', type: 'expense' },
  { id: 'cat_bills', sectionId: 'sec_housing', name: 'Bills & Utilities', icon: 'Receipt', color: '#2563eb', type: 'expense' },
  { id: 'cat_subs', sectionId: 'sec_housing', name: 'Subscriptions', icon: 'Repeat', color: '#7c3aed', type: 'expense' },
  { id: 'cat_groceries', sectionId: 'sec_daily', name: 'Groceries', icon: 'ShoppingCart', color: '#059669', type: 'expense' },
  { id: 'cat_restaurants', sectionId: 'sec_daily', name: 'Restaurants', icon: 'Utensils', color: '#ea580c', type: 'expense' },
  { id: 'cat_transport', sectionId: 'sec_daily', name: 'Transportation', icon: 'Car', color: '#0d9488', type: 'expense' },
  { id: 'cat_shopping', sectionId: 'sec_lifestyle', name: 'Shopping', icon: 'ShoppingBag', color: '#db2777', type: 'expense' },
  { id: 'cat_travel', sectionId: 'sec_lifestyle', name: 'Travel', icon: 'Plane', color: '#0284c7', type: 'expense' },
  { id: 'cat_family', sectionId: 'sec_lifestyle', name: 'Family', icon: 'Heart', color: '#e11d48', type: 'expense' },
  { id: 'cat_personal', sectionId: 'sec_lifestyle', name: 'Personal', icon: 'User', color: '#d97706', type: 'expense' },
  { id: 'cat_other', sectionId: 'sec_lifestyle', name: 'Other', icon: 'MoreHorizontal', color: '#475569', type: 'expense' },
  { id: 'cat_salary', sectionId: 'sec_income', name: 'Salary', icon: 'Briefcase', color: '#059669', type: 'income' },
  { id: 'cat_transfer', sectionId: 'sec_income', name: 'Transfers', icon: 'RefreshCw', color: '#2563eb', type: 'income' },
  { id: 'cat_refund', sectionId: 'sec_income', name: 'Refunds', icon: 'Gift', color: '#7c3aed', type: 'income' },
  { id: 'cat_inc_other', sectionId: 'sec_income', name: 'Bonus & Freelance', icon: 'Coins', color: '#d97706', type: 'income' }
];

const getCurrentYearMonth = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const pad2 = (n) => String(n).padStart(2, '0');

const buildDemoData = () => {
  const { year, month } = getCurrentYearMonth();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const curYM = `${year}-${pad2(month)}`;
  const prevYM = `${prevYear}-${pad2(prevMonth)}`;

  const transactions = [
    {
      id: 'tx_demo_1',
      type: 'income',
      amount: 14500,
      currency: 'AED',
      date: `${curYM}-01`,
      categoryId: 'cat_salary',
      description: 'Monthly Tech Salary (Dubai)',
      isShared: false,
      paidBy: 'me',
      belongsTo: 'me',
      splitMode: 'equal',
      shares: { me: 0, p2: 0, p3: 0 },
      notes: 'Direct bank deposit',
      isDemo: true
    },
    {
      id: 'tx_demo_2',
      type: 'expense',
      amount: 900,
      currency: 'AED',
      date: `${curYM}-04`,
      categoryId: 'cat_groceries',
      description: 'Carrefour Monthly Household Stock',
      isShared: true,
      paidBy: 'me',
      belongsTo: 'shared',
      splitMode: 'equal',
      shares: { me: 300, p2: 300, p3: 300 },
      notes: 'Split 3 ways equally (300 AED each)',
      isDemo: true
    },
    {
      id: 'tx_demo_3',
      type: 'expense',
      amount: 600,
      currency: 'AED',
      date: `${curYM}-07`,
      categoryId: 'cat_bills',
      description: 'DEWA & High-Speed Fiber Internet',
      isShared: true,
      paidBy: 'p2',
      belongsTo: 'shared',
      splitMode: 'equal',
      shares: { me: 200, p2: 200, p3: 200 },
      notes: 'Paid by Omar, my share is 200 AED',
      isDemo: true
    },
    {
      id: 'tx_demo_4',
      type: 'expense',
      amount: 245,
      currency: 'AED',
      date: `${curYM}-10`,
      categoryId: 'cat_transport',
      description: 'RTA Metro & Fuel Top-up',
      isShared: false,
      paidBy: 'me',
      belongsTo: 'me',
      splitMode: 'equal',
      shares: { me: 245, p2: 0, p3: 0 },
      notes: '',
      isDemo: true
    },
    {
      id: 'tx_demo_5',
      type: 'income',
      amount: 22000,
      currency: 'EGP',
      date: `${curYM}-02`,
      categoryId: 'cat_transfer',
      description: 'Cairo Bank Account Transfer',
      isShared: false,
      paidBy: 'me',
      belongsTo: 'me',
      splitMode: 'equal',
      shares: { me: 0, p2: 0, p3: 0 },
      notes: 'Family & local Egypt expenses fund',
      isDemo: true
    },
    {
      id: 'tx_demo_6',
      type: 'expense',
      amount: 3000,
      currency: 'EGP',
      date: `${curYM}-08`,
      categoryId: 'cat_restaurants',
      description: 'Group Dinner in Zamalek',
      isShared: true,
      paidBy: 'me',
      belongsTo: 'shared',
      splitMode: 'custom',
      shares: { me: 1000, p2: 1200, p3: 800 },
      notes: 'Custom split based on orders',
      isDemo: true
    },
    {
      id: 'tx_demo_7',
      type: 'expense',
      amount: 4200,
      currency: 'AED',
      date: `${prevYM}-15`,
      categoryId: 'cat_rent',
      description: 'Apartment Rent Contribution',
      isShared: false,
      paidBy: 'me',
      belongsTo: 'me',
      splitMode: 'equal',
      shares: { me: 4200, p2: 0, p3: 0 },
      notes: 'Previous month housing',
      isDemo: true
    },
    {
      id: 'tx_demo_8',
      type: 'income',
      amount: 14500,
      currency: 'AED',
      date: `${prevYM}-01`,
      categoryId: 'cat_salary',
      description: 'Previous Month Salary',
      isShared: false,
      paidBy: 'me',
      belongsTo: 'me',
      splitMode: 'equal',
      shares: { me: 0, p2: 0, p3: 0 },
      notes: '',
      isDemo: true
    }
  ];

  const settlements = [
    {
      id: 'set_demo_1',
      transactionId: 'tx_demo_2',
      personId: 'p2',
      direction: 'receive',
      amount: 150,
      currency: 'AED',
      date: `${curYM}-06`,
      note: 'Partial cash repayment from Omar',
      isDemo: true
    }
  ];

  return { transactions, settlements };
};

// ============================================================================
// UTILITY FUNCTIONS (EXACT MATH, FORMATTING & ANDROID SHARE)
// ============================================================================

const round2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

const formatMoney = (amount, currency = 'AED') => {
  const val = round2(amount || 0);
  return `${val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ${currency}`;
};

const formatCompact = (amount) => {
  const val = round2(amount || 0);
  return val.toLocaleString('en-US', {
    minimumFractionDigits: val % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
};

// Exact cent/fils-safe equal split so shares always sum strictly to totalAmount
function computeEqualShares(totalAmount, participantIds) {
  const result = { me: 0, p2: 0, p3: 0 };
  const count = participantIds.length;
  if (count === 0 || totalAmount <= 0) return result;

  const totalCents = Math.round(totalAmount * 100);
  const baseCents = Math.floor(totalCents / count);
  let remainder = totalCents - baseCents * count;

  participantIds.forEach((pid) => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    result[pid] = (baseCents + extra) / 100;
  });
  return result;
}

// Compute effective shares for any expense (handles both Shared splits & Personal "On Behalf" expenses)
function getEffectiveShares(tx) {
  if (tx.type !== 'expense') return { me: 0, p2: 0, p3: 0 };
  if (tx.isShared) {
    return {
      me: round2(tx.shares?.me || 0),
      p2: round2(tx.shares?.p2 || 0),
      p3: round2(tx.shares?.p3 || 0)
    };
  }
  const owner = tx.belongsTo || tx.paidBy || 'me';
  return {
    me: owner === 'me' ? round2(tx.amount) : 0,
    p2: owner === 'p2' ? round2(tx.amount) : 0,
    p3: owner === 'p3' ? round2(tx.amount) : 0
  };
}

// Android Native Web Share API Helper (Files + Text + Clipboard Fallback)
async function shareOrDownloadFile({ content, fileName, mimeType, title, text, preferShare = false, onFeedback }) {
  const blob = new Blob([content], { type: mimeType });
  const file = typeof File !== 'undefined' ? new File([blob], fileName, { type: mimeType }) : null;

  if (preferShare && navigator.share) {
    try {
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title || fileName,
          text: text || 'Financial backup file',
          files: [file]
        });
        if (onFeedback) onFeedback('Shared via Android Share Sheet');
        return;
      } else {
        await navigator.share({
          title: title || fileName,
          text: `${text || fileName}\n\n${content.slice(0, 3500)}`
        });
        if (onFeedback) onFeedback('Shared summary via Android');
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  if (onFeedback) onFeedback(`Saved ${fileName}`);
}

async function shareTextSummary({ title, text, onFeedback }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      if (onFeedback) onFeedback('Shared via Android');
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    if (onFeedback) onFeedback('Copied WhatsApp-ready summary to clipboard');
  } catch {
    if (onFeedback) onFeedback('Unable to copy summary', 'error');
  }
}

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const CategoryIcon = ({ iconName, color, size = 18 }) => {
  const IconComp = ICON_MAP[iconName] || Receipt;
  return (
    <div
      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color
      }}
    >
      <IconComp size={size} />
    </div>
  );
};

const CurrencyFilterPills = ({ value, onChange }) => {
  const options = [
    { id: 'ALL', label: 'All (Separate)' },
    { id: 'AED', label: 'AED Only' },
    { id: 'EGP', label: 'EGP Only' }
  ];
  return (
    <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0 select-none">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`min-h-[40px] px-3.5 py-2 text-xs font-bold rounded-lg transition-all touch-manipulation active:scale-[0.97] ${
            value === opt.id
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className="fixed top-[calc(4.25rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto">
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl shadow-xl border ${
          isError
            ? 'bg-rose-950 text-rose-50 border-rose-800'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2.5 text-sm font-medium">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

export default function App() {
  // Inject Android PWA Manifest, Theme Color & Mobile Viewport Ergonomics on Mount
  useEffect(() => {
    const ensureMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    ensureMeta('theme-color', '#0f172a');
    ensureMeta('mobile-web-app-capable', 'yes');
    ensureMeta('apple-mobile-web-app-capable', 'yes');
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');

    const styleId = 'android-native-ergonomics';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        * { -webkit-tap-highlight-color: transparent; }
        body { overscroll-behavior-y: contain; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `;
      document.head.appendChild(styleEl);
    }

    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#4f46e5"/><path d="M128 192h256v160a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V192zm32-64h192a32 32 0 0 1 32 32v16H128v-16a32 32 0 0 1 32-32z" fill="#ffffff"/><circle cx="336" cy="272" r="24" fill="#4f46e5"/></svg>`;
    const iconUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`;
    const manifestObj = {
      name: 'Dirham & Pound — Personal & Shared Finance',
      short_name: 'Dirham&Pound',
      description: 'Dual-currency AED & EGP personal finance and 3-person shared expense manager',
      start_url: '.',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#f8fafc',
      theme_color: '#0f172a',
      icons: [
        { src: iconUrl, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
        { src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
      ]
    };

    const manifestBlob = new Blob([JSON.stringify(manifestObj)], { type: 'application/manifest+json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    let linkEl = document.querySelector('link[rel="manifest"]');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.setAttribute('rel', 'manifest');
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', manifestUrl);

    return () => {
      URL.revokeObjectURL(manifestUrl);
    };
  }, []);

  // Load persisted state
  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.transactions)) {
          return {
            people: parsed.people || DEFAULT_PEOPLE,
            sections: parsed.sections || DEFAULT_SECTIONS,
            categories: parsed.categories || DEFAULT_CATEGORIES,
            transactions: parsed.transactions || [],
            settlements: parsed.settlements || [],
            exchangeRate: parsed.exchangeRate || 13.55
          };
        }
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    const demo = buildDemoData();
    return {
      people: DEFAULT_PEOPLE,
      sections: DEFAULT_SECTIONS,
      categories: DEFAULT_CATEGORIES,
      transactions: demo.transactions,
      settlements: demo.settlements,
      exchangeRate: 13.55
    };
  };

  const initial = useMemo(() => loadInitialState(), []);

  // Core Persistent State
  const [people, setPeople] = useState(initial.people);
  const [sections, setSections] = useState(initial.sections);
  const [categories, setCategories] = useState(initial.categories);
  const [transactions, setTransactions] = useState(initial.transactions);
  const [settlements, setSettlements] = useState(initial.settlements);
  const [exchangeRate, setExchangeRate] = useState(initial.exchangeRate);

  // Navigation & Period State
  const [activeTab, setActiveTab] = useState('dashboard');
  const { year: curY, month: curM } = useMemo(() => getCurrentYearMonth(), []);
  const [selectedYear, setSelectedYear] = useState(curY);
  const [selectedMonth, setSelectedMonth] = useState(curM);
  const [periodMode, setPeriodMode] = useState('month'); // 'month' | 'year' | 'all'

  // Modals & Notifications
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txModalDefaults, setTxModalDefaults] = useState({ type: 'expense', isShared: false });
  const [editingTx, setEditingTx] = useState(null);
  const [settlementModalItem, setSettlementModalItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          schemaVersion: 1,
          updatedAt: new Date().toISOString(),
          people,
          sections,
          categories,
          transactions,
          settlements,
          exchangeRate
        })
      );
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }, [people, sections, categories, transactions, settlements, exchangeRate]);

  // Lookup helpers
  const getPerson = (id) => people.find((p) => p.id === id) || { id, name: id, color: '#64748b' };
  const getCategory = (id) =>
    categories.find((c) => c.id === id) || {
      id,
      name: 'Uncategorized',
      icon: 'Receipt',
      color: '#64748b',
      sectionId: ''
    };
  const getSection = (id) => sections.find((s) => s.id === id) || { id, name: 'General' };

  const hasDemoData = useMemo(
    () => transactions.some((t) => t.isDemo) || settlements.some((s) => s.isDemo),
    [transactions, settlements]
  );

  const handleClearDemoData = () => {
    setTransactions((prev) => prev.filter((t) => !t.isDemo));
    setSettlements((prev) => prev.filter((s) => !s.isDemo));
    showToast('Sample demo data cleared — ready for your real records!');
  };

  // Period Label & Handlers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const periodLabel = useMemo(() => {
    if (periodMode === 'all') return 'All Time';
    if (periodMode === 'year') return `Year ${selectedYear}`;
    return `${monthNames[selectedMonth - 1].slice(0, 3)} ${selectedYear}`;
  }, [periodMode, selectedYear, selectedMonth]);

  const handlePrevPeriod = () => {
    if (periodMode === 'all') {
      setPeriodMode('month');
      return;
    }
    if (periodMode === 'year') {
      setSelectedYear((y) => y - 1);
      return;
    }
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextPeriod = () => {
    if (periodMode === 'all') {
      setPeriodMode('month');
      return;
    }
    if (periodMode === 'year') {
      setSelectedYear((y) => y + 1);
      return;
    }
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const matchesPeriod = (dateStr) => {
    if (!dateStr || periodMode === 'all') return true;
    const [yStr, mStr] = dateStr.split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    if (periodMode === 'year') return y === selectedYear;
    return y === selectedYear && m === selectedMonth;
  };

  // Filtered Transactions & Settlements for Current Period
  const periodTransactions = useMemo(() => {
    return transactions
      .filter((t) => matchesPeriod(t.date))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [transactions, periodMode, selectedYear, selectedMonth]);

  const periodSettlements = useMemo(() => {
    return settlements.filter((s) => matchesPeriod(s.date));
  }, [settlements, periodMode, selectedYear, selectedMonth]);

  // ============================================================================
  // CORE DEBT & SETTLEMENT ENGINE (ALL-TIME ACCURATE LEDGER)
  // ============================================================================

  const allDebtItems = useMemo(() => {
    const receivables = [];
    const payables = [];

    transactions.forEach((tx) => {
      if (tx.type !== 'expense') return;
      const shares = getEffectiveShares(tx);

      // Case A: Me paid -> Check if Person 2 or Person 3 owes a share
      if (tx.paidBy === 'me') {
        ['p2', 'p3'].forEach((pid) => {
          const shareAmt = round2(shares[pid] || 0);
          if (shareAmt > 0) {
            const relatedSettlements = settlements.filter(
              (s) => s.transactionId === tx.id && s.personId === pid && s.direction === 'receive'
            );
            const paidSoFar = round2(
              relatedSettlements.reduce((acc, s) => acc + Number(s.amount || 0), 0)
            );
            const outstanding = round2(Math.max(0, shareAmt - paidSoFar));
            const status =
              outstanding <= 0 ? 'Paid' : paidSoFar > 0 ? 'Partial' : 'Unpaid';

            receivables.push({
              key: `${tx.id}_${pid}`,
              transactionId: tx.id,
              personId: pid,
              direction: 'receive',
              description: tx.description,
              categoryId: tx.categoryId,
              date: tx.date,
              currency: tx.currency,
              totalExpenseAmount: tx.amount,
              isShared: tx.isShared,
              originalShare: shareAmt,
              paidSoFar,
              outstanding,
              status,
              settlementHistory: relatedSettlements.sort((a, b) =>
                (b.date || '').localeCompare(a.date || '')
              )
            });
          }
        });
      }

      // Case B: Person 2 or Person 3 paid -> Check if Me owes a share
      if (tx.paidBy === 'p2' || tx.paidBy === 'p3') {
        const myShare = round2(shares.me || 0);
        if (myShare > 0) {
          const creditorId = tx.paidBy;
          const relatedSettlements = settlements.filter(
            (s) => s.transactionId === tx.id && s.personId === creditorId && s.direction === 'pay'
          );
          const paidSoFar = round2(
            relatedSettlements.reduce((acc, s) => acc + Number(s.amount || 0), 0)
          );
          const outstanding = round2(Math.max(0, myShare - paidSoFar));
          const status =
            outstanding <= 0 ? 'Paid' : paidSoFar > 0 ? 'Partial' : 'Unpaid';

          payables.push({
            key: `${tx.id}_${creditorId}`,
            transactionId: tx.id,
            personId: creditorId,
            direction: 'pay',
            description: tx.description,
            categoryId: tx.categoryId,
            date: tx.date,
            currency: tx.currency,
            totalExpenseAmount: tx.amount,
            isShared: tx.isShared,
            originalShare: myShare,
            paidSoFar,
            outstanding,
            status,
            settlementHistory: relatedSettlements.sort((a, b) =>
              (b.date || '').localeCompare(a.date || '')
            )
          });
        }
      }
    });

    receivables.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    payables.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return { receivables, payables };
  }, [transactions, settlements]);

  // ============================================================================
  // DUAL-CURRENCY FINANCIAL SUMMARY (STRICTLY SEPARATE AED & EGP)
  // ============================================================================

  const financialSummary = useMemo(() => {
    const computeForCurrency = (cur) => {
      const txs = periodTransactions.filter((t) => t.currency === cur);
      const sets = periodSettlements.filter((s) => s.currency === cur);

      const personalIncome = round2(
        txs.filter((t) => t.type === 'income').reduce((acc, t) => acc + Number(t.amount || 0), 0)
      );

      const settlementsReceived = round2(
        sets.filter((s) => s.direction === 'receive').reduce((acc, s) => acc + Number(s.amount || 0), 0)
      );

      const settlementsPaid = round2(
        sets.filter((s) => s.direction === 'pay').reduce((acc, s) => acc + Number(s.amount || 0), 0)
      );

      // Out-of-pocket cash paid directly by Me in this period
      const cashOutflowExpenses = round2(
        txs
          .filter((t) => t.type === 'expense' && t.paidBy === 'me')
          .reduce((acc, t) => acc + Number(t.amount || 0), 0)
      );

      // My true personal consumption vs my share of shared expenses
      let myPersonalExpenses = 0;
      let mySharedExpenseShare = 0;
      let totalSharedGroupVolume = 0;

      txs.forEach((t) => {
        if (t.type !== 'expense') return;
        const shares = getEffectiveShares(t);
        if (t.isShared) {
          totalSharedGroupVolume += Number(t.amount || 0);
          mySharedExpenseShare += shares.me;
        } else {
          myPersonalExpenses += shares.me;
        }
      });

      myPersonalExpenses = round2(myPersonalExpenses);
      mySharedExpenseShare = round2(mySharedExpenseShare);
      totalSharedGroupVolume = round2(totalSharedGroupVolume);

      const totalMyExpenses = round2(myPersonalExpenses + mySharedExpenseShare);
      const totalMoneyReceived = round2(personalIncome + settlementsReceived);
      const totalMoneySpent = round2(cashOutflowExpenses + settlementsPaid);
      const remainingBalance = round2(totalMoneyReceived - totalMoneySpent);

      // Active Open Debts (All-time open balances in this currency)
      const outstandingReceivable = round2(
        allDebtItems.receivables
          .filter((r) => r.currency === cur)
          .reduce((acc, r) => acc + r.outstanding, 0)
      );

      const outstandingPayable = round2(
        allDebtItems.payables
          .filter((p) => p.currency === cur)
          .reduce((acc, p) => acc + p.outstanding, 0)
      );

      return {
        currency: cur,
        personalIncome,
        settlementsReceived,
        settlementsPaid,
        totalMoneyReceived,
        cashOutflowExpenses,
        totalMoneySpent,
        remainingBalance,
        myPersonalExpenses,
        mySharedExpenseShare,
        totalSharedGroupVolume,
        totalMyExpenses,
        outstandingReceivable,
        outstandingPayable
      };
    };

    return {
      AED: computeForCurrency('AED'),
      EGP: computeForCurrency('EGP')
    };
  }, [periodTransactions, periodSettlements, allDebtItems]);

  // ============================================================================
  // TRANSACTION & SETTLEMENT CRUD HANDLERS
  // ============================================================================

  const openQuickAdd = (type = 'expense', isShared = false) => {
    setEditingTx(null);
    setTxModalDefaults({ type, isShared });
    setTxModalOpen(true);
  };

  const openEditTx = (tx) => {
    setEditingTx(tx);
    setTxModalOpen(true);
  };

  const handleSaveTransaction = (txPayload) => {
    if (editingTx) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingTx.id ? { ...txPayload, id: editingTx.id } : t))
      );
      // Clean up orphaned settlements if payer/shares changed
      setSettlements((prev) =>
        prev.filter((s) => {
          if (s.transactionId !== editingTx.id) return true;
          if (txPayload.type !== 'expense') return false;
          const shares = getEffectiveShares(txPayload);
          if (txPayload.paidBy === 'me' && s.direction === 'receive') {
            return (shares[s.personId] || 0) > 0;
          }
          if (
            (txPayload.paidBy === 'p2' || txPayload.paidBy === 'p3') &&
            s.direction === 'pay' &&
            s.personId === txPayload.paidBy
          ) {
            return (shares.me || 0) > 0;
          }
          return false;
        })
      );
      showToast('Transaction updated & balances recalculated');
    } else {
      const newTx = {
        ...txPayload,
        id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(`${txPayload.type === 'income' ? 'Income' : 'Expense'} added`);
    }
    setTxModalOpen(false);
    setEditingTx(null);
  };

  const handleDeleteTransaction = (txId) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
    setSettlements((prev) => prev.filter((s) => s.transactionId !== txId));
    showToast('Transaction deleted & related balances updated');
  };

  const handleRecordSettlement = ({ transactionId, personId, direction, amount, currency, date, note }) => {
    const newSettlement = {
      id: `set_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      transactionId,
      personId,
      direction,
      amount: round2(amount),
      currency,
      date,
      note
    };
    setSettlements((prev) => [newSettlement, ...prev]);
    setSettlementModalItem(null);
    showToast(
      direction === 'receive'
        ? `Recorded ${formatMoney(amount, currency)} received`
        : `Recorded ${formatMoney(amount, currency)} paid`
    );
  };

  const handleDeleteSettlement = (settlementId) => {
    setSettlements((prev) => prev.filter((s) => s.id !== settlementId));
    showToast('Settlement entry removed');
  };

  // ============================================================================
  // RENDER LAYOUT (ANDROID-FIRST NATIVE SHELL)
  // ============================================================================

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 pb-[calc(6.25rem+env(safe-area-inset-bottom))] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* ANDROID TOP APP BAR WITH SAFE AREA TOP */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white pt-[env(safe-area-inset-top)] shadow-md">
        <div className="max-w-lg md:max-w-3xl mx-auto px-3.5 h-15 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 min-h-[48px] text-left touch-manipulation active:scale-[0.97] transition shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <Wallet size={19} />
            </div>
            <div className="hidden xs:block sm:block">
              <h1 className="text-sm font-extrabold tracking-tight text-white leading-none">
                Dirham & Pound
              </h1>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">AED · EGP Ledger</p>
            </div>
          </button>

          {/* Month / Year / All-Time Navigator (48px Touch Targets) */}
          <div className="flex items-center bg-slate-800 rounded-2xl p-0.5 border border-slate-700/80 select-none">
            <button
              type="button"
              onClick={handlePrevPeriod}
              aria-label="Previous Period"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 touch-manipulation transition"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              onClick={() =>
                setPeriodMode((prev) => (prev === 'month' ? 'year' : prev === 'year' ? 'all' : 'month'))
              }
              title="Tap to cycle: Month → Annual → All-Time"
              className="min-h-[44px] px-2.5 text-xs sm:text-sm font-extrabold text-white min-w-[100px] sm:min-w-[122px] text-center hover:text-indigo-300 active:scale-95 touch-manipulation transition"
            >
              {periodLabel}
            </button>
            <button
              type="button"
              onClick={handleNextPeriod}
              aria-label="Next Period"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 touch-manipulation transition"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          {/* Settings Trigger (48x48px Touch Target) */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            aria-label="Settings & Backup"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition touch-manipulation active:scale-95 shrink-0 ${
              activeTab === 'settings'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* MAIN MOBILE-FIRST SINGLE-COLUMN VIEWPORT CONTAINER */}
      <main className="max-w-lg md:max-w-3xl mx-auto px-3.5 pt-4">
        {hasDemoData && (
          <div className="mb-4 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles size={18} className="text-indigo-600 shrink-0" />
              <p className="text-xs font-semibold text-indigo-950 leading-snug">
                Sample AED & EGP records are loaded so you can explore splits & charts.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearDemoData}
              className="shrink-0 min-h-[38px] px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold touch-manipulation"
            >
              Clear Sample
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            summary={financialSummary}
            periodLabel={periodLabel}
            periodMode={periodMode}
            setPeriodMode={setPeriodMode}
            recentTransactions={periodTransactions.slice(0, 6)}
            people={people}
            getPerson={getPerson}
            getCategory={getCategory}
            onQuickAdd={openQuickAdd}
            onEditTx={openEditTx}
            onNavigate={setActiveTab}
            exchangeRate={exchangeRate}
            setExchangeRate={setExchangeRate}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={periodTransactions}
            allTransactionsCount={transactions.length}
            periodLabel={periodLabel}
            people={people}
            sections={sections}
            categories={categories}
            getPerson={getPerson}
            getCategory={getCategory}
            getSection={getSection}
            onQuickAdd={openQuickAdd}
            onEditTx={openEditTx}
            onDeleteTx={handleDeleteTransaction}
          />
        )}

        {activeTab === 'shared' && (
          <SharedExpensesView
            transactions={periodTransactions.filter(
              (t) => t.type === 'expense' && (t.isShared || t.paidBy !== 'me' || (t.belongsTo && t.belongsTo !== 'me'))
            )}
            allDebtItems={allDebtItems}
            periodLabel={periodLabel}
            people={people}
            getPerson={getPerson}
            getCategory={getCategory}
            onQuickAdd={() => openQuickAdd('expense', true)}
            onEditTx={openEditTx}
            onDeleteTx={handleDeleteTransaction}
            onOpenSettle={(item) => setSettlementModalItem(item)}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'balances' && (
          <BalancesView
            allDebtItems={allDebtItems}
            people={people}
            getPerson={getPerson}
            getCategory={getCategory}
            onOpenSettle={(item) => setSettlementModalItem(item)}
            onDeleteSettlement={handleDeleteSettlement}
            showToast={showToast}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            transactions={transactions}
            periodTransactions={periodTransactions}
            periodSettlements={periodSettlements}
            summary={financialSummary}
            allDebtItems={allDebtItems}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            periodMode={periodMode}
            periodLabel={periodLabel}
            people={people}
            sections={sections}
            categories={categories}
            getPerson={getPerson}
            getCategory={getCategory}
            getSection={getSection}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            people={people}
            setPeople={setPeople}
            sections={sections}
            setSections={setSections}
            categories={categories}
            setCategories={setCategories}
            transactions={transactions}
            setTransactions={setTransactions}
            settlements={settlements}
            setSettlements={setSettlements}
            exchangeRate={exchangeRate}
            setExchangeRate={setExchangeRate}
            showToast={showToast}
          />
        )}
      </main>

      {/* THUMB-REACHABLE ANDROID FLOATING ACTION BUTTON (FAB) */}
      <button
        type="button"
        onClick={() => openQuickAdd('expense', activeTab === 'shared')}
        aria-label="Quick Add Transaction"
        className="fixed z-30 right-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] h-14 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/35 flex items-center gap-2 touch-manipulation select-none transition-transform"
      >
        <Plus size={22} strokeWidth={2.75} />
        <span>Quick Add</span>
      </button>

      {/* ANDROID MATERIAL 3 STYLE BOTTOM NAVIGATION BAR WITH SAFE AREA BOTTOM */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] select-none">
        <div className="max-w-lg md:max-w-3xl mx-auto px-1 h-17 flex items-center justify-around">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
            { id: 'shared', label: 'Shared', icon: Users },
            { id: 'balances', label: 'Balances', icon: Scale },
            { id: 'reports', label: 'Reports', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 min-h-[54px] py-1 rounded-2xl transition-all touch-manipulation active:scale-95 ${
                  isActive ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`px-3.5 py-1 rounded-full transition-all ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] sm:text-[11px] mt-0.5 ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* TRANSACTION ADD / EDIT MODAL */}
      {txModalOpen && (
        <TransactionModal
          editingTx={editingTx}
          defaults={txModalDefaults}
          people={people}
          sections={sections}
          categories={categories}
          onClose={() => {
            setTxModalOpen(false);
            setEditingTx(null);
          }}
          onSave={handleSaveTransaction}
        />
      )}

      {/* SETTLEMENT RECORDING MODAL */}
      {settlementModalItem && (
        <SettlementModal
          item={settlementModalItem}
          getPerson={getPerson}
          onClose={() => setSettlementModalItem(null)}
          onSubmit={handleRecordSettlement}
        />
      )}
    </div>
  );
}

// ============================================================================
// 1. DASHBOARD VIEW
// ============================================================================

function DashboardView({
  summary,
  periodLabel,
  periodMode,
  setPeriodMode,
  recentTransactions,
  getPerson,
  getCategory,
  onQuickAdd,
  onEditTx,
  onNavigate,
  exchangeRate,
  setExchangeRate
}) {
  const [converterAmount, setConverterAmount] = useState('1000');
  const [converterDir, setConverterDir] = useState('AED_TO_EGP');

  const convertedPreview = useMemo(() => {
    const num = parseFloat(converterAmount) || 0;
    const rate = parseFloat(exchangeRate) || 1;
    if (converterDir === 'AED_TO_EGP') {
      return `${round2(num * rate).toLocaleString()} EGP`;
    }
    return `${round2(num / rate).toLocaleString()} AED`;
  }, [converterAmount, exchangeRate, converterDir]);

  return (
    <div className="space-y-4">
      {/* Period Selector Banner & 1-Tap Action Chips */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {periodLabel}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1">Financial Overview</h2>
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl select-none">
            {['month', 'year', 'all'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPeriodMode(mode)}
                className={`min-h-[38px] px-2.5 rounded-lg text-xs font-bold capitalize transition touch-manipulation active:scale-95 ${
                  periodMode === mode
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'all' ? 'All' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Fast 48px Touch Target Action Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onQuickAdd('expense', false)}
            className="min-h-[48px] flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 active:scale-[0.97] text-rose-700 font-extrabold text-xs border border-rose-200/80 touch-manipulation select-none transition"
          >
            <ArrowUpRight size={16} />
            <span>+ Expense</span>
          </button>
          <button
            type="button"
            onClick={() => onQuickAdd('expense', true)}
            className="min-h-[48px] flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 active:scale-[0.97] text-indigo-700 font-extrabold text-xs border border-indigo-200/80 touch-manipulation select-none transition"
          >
            <Users size={16} />
            <span>+ Shared</span>
          </button>
          <button
            type="button"
            onClick={() => onQuickAdd('income', false)}
            className="min-h-[48px] flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:scale-[0.97] text-emerald-700 font-extrabold text-xs border border-emerald-200/80 touch-manipulation select-none transition"
          >
            <ArrowDownLeft size={16} />
            <span>+ Income</span>
          </button>
        </div>
      </div>

      {/* DUAL CURRENCY OVERVIEW CARDS (STRICTLY SEPARATE AED & EGP) */}
      <div className="grid grid-cols-1 gap-4">
        {['AED', 'EGP'].map((cur) => {
          const data = summary[cur];
          const isAED = cur === 'AED';
          const flowTotal = data.totalMoneyReceived + data.totalMoneySpent;
          const incRatio = flowTotal > 0 ? Math.round((data.totalMoneyReceived / flowTotal) * 100) : 50;

          return (
            <div
              key={cur}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden"
            >
              {/* Card Header */}
              <div
                className={`px-5 py-4 flex items-center justify-between border-b ${
                  isAED
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-85">
                    {isAED ? 'UAE Dirham Wallet' : 'Egyptian Pound Wallet'}
                  </span>
                  <div className="text-2xl font-extrabold tracking-tight mt-0.5">
                    {formatMoney(data.remainingBalance, cur)}
                  </div>
                  <span className="text-[11px] opacity-85">Remaining Cash Balance ({periodLabel})</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center font-extrabold text-sm">
                  {cur}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="p-3.5 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <ArrowDownLeft size={14} />
                      <span>Money Received</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                      {formatMoney(data.totalMoneyReceived, cur)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Inc: {formatCompact(data.personalIncome)} · Settled: {formatCompact(data.settlementsReceived)}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <ArrowUpRight size={14} />
                      <span>Money Spent</span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                      {formatMoney(data.totalMoneySpent, cur)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Outflow: {formatCompact(data.cashOutflowExpenses)} · Paid: {formatCompact(data.settlementsPaid)}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="text-xs font-bold text-slate-600">
                      {periodMode === 'month' ? 'This Month Expenses' : 'Period Expenses'}
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                      {formatMoney(data.totalMyExpenses, cur)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Personal: {formatCompact(data.myPersonalExpenses)} · Share: {formatCompact(data.mySharedExpenseShare)}
                    </div>
                  </div>

                  {/* Shared Debt Snapshot */}
                  <button
                    type="button"
                    onClick={() => onNavigate('balances')}
                    className="text-left p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 hover:bg-amber-50 active:scale-[0.97] touch-manipulation transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">Shared Balances</span>
                      <ChevronRight size={15} className="text-amber-600" />
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <div className="text-xs font-extrabold text-emerald-700 flex justify-between">
                        <span>Owed to me:</span>
                        <span>+{formatCompact(data.outstandingReceivable)} {cur}</span>
                      </div>
                      <div className="text-xs font-extrabold text-rose-700 flex justify-between">
                        <span>I owe:</span>
                        <span>-{formatCompact(data.outstandingPayable)} {cur}</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Income vs Expenses Ratio Bar */}
                <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Income vs Outflow ({incRatio}% In)</span>
                    <span>{100 - incRatio}% Out</span>
                  </div>
                  <div className="h-2 rounded-full bg-rose-200 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${incRatio}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MANUAL EXCHANGE RATE REFERENCE CONVERTER (NEVER ALTERS STORED TRANSACTIONS) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
            <Coins size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Manual Currency Reference Converter</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preview conversions using your custom rate. Original AED & EGP records stay strictly separate.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
            <span className="text-xs font-bold text-slate-600">1 AED =</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                className="w-20 text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs font-bold text-slate-500">EGP</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 bg-indigo-50/70 border border-indigo-100 rounded-2xl px-3 py-2 flex-1">
            <input
              type="number"
              inputMode="decimal"
              value={converterAmount}
              onChange={(e) => setConverterAmount(e.target.value)}
              className="w-24 text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() =>
                setConverterDir((d) => (d === 'AED_TO_EGP' ? 'EGP_TO_AED' : 'AED_TO_EGP'))
              }
              className="min-h-[40px] text-xs font-extrabold text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 active:scale-95 touch-manipulation"
            >
              {converterDir === 'AED_TO_EGP' ? 'AED → EGP' : 'EGP → AED'}
            </button>
            <span className="text-xs sm:text-sm font-extrabold text-indigo-950 text-right">
              = {convertedPreview}
            </span>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recent Activity ({periodLabel})</h3>
            <p className="text-xs text-slate-500">Tap any row to edit details or split shares</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('transactions')}
            className="min-h-[44px] px-2.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 touch-manipulation active:scale-95"
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-500">No transactions recorded in {periodLabel}.</p>
            <button
              type="button"
              onClick={() => onQuickAdd('expense', false)}
              className="mt-3 min-h-[48px] inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold touch-manipulation active:scale-95"
            >
              <Plus size={16} /> Add First Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => {
              const cat = getCategory(tx.categoryId);
              const payer = getPerson(tx.paidBy);
              const isIncome = tx.type === 'income';
              const shares = getEffectiveShares(tx);
              return (
                <div
                  key={tx.id}
                  onClick={() => onEditTx(tx)}
                  className="px-4 py-3.5 min-h-[64px] flex items-center justify-between gap-3 hover:bg-slate-50/90 active:bg-slate-100 cursor-pointer touch-manipulation transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon iconName={cat.icon} color={cat.color} size={18} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-slate-900 truncate">{tx.description}</p>
                        {tx.isShared && (
                          <span className="shrink-0 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                            Shared
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                        <span>{tx.date}</span>
                        <span>·</span>
                        <span>{cat.name}</span>
                        {tx.type === 'expense' && (
                          <>
                            <span>·</span>
                            <span>Paid: {payer.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-sm font-extrabold ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatMoney(tx.amount, tx.currency)}
                    </div>
                    {tx.type === 'expense' && (tx.isShared || tx.paidBy !== 'me' || (tx.belongsTo && tx.belongsTo !== 'me')) && (
                      <div className="text-[11px] font-semibold text-slate-500">
                        My share: {formatMoney(shares.me, tx.currency)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 2. TRANSACTIONS VIEW (INCOME & EXPENSES WITH FILTERS)
// ============================================================================

function TransactionsView({
  transactions,
  allTransactionsCount,
  periodLabel,
  sections,
  categories,
  getPerson,
  getCategory,
  getSection,
  onQuickAdd,
  onEditTx,
  onDeleteTx
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (currencyFilter !== 'ALL' && tx.currency !== currencyFilter) return false;
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
      if (scopeFilter === 'shared' && !tx.isShared) return false;
      if (scopeFilter === 'personal' && tx.isShared) return false;
      if (categoryFilter !== 'ALL') {
        const cat = getCategory(tx.categoryId);
        if (tx.categoryId !== categoryFilter && cat.sectionId !== categoryFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = getCategory(tx.categoryId);
        const matchDesc = (tx.description || '').toLowerCase().includes(q);
        const matchCat = (cat.name || '').toLowerCase().includes(q);
        const matchNotes = (tx.notes || '').toLowerCase().includes(q);
        if (!matchDesc && !matchCat && !matchNotes) return false;
      }
      return true;
    });
  }, [transactions, currencyFilter, typeFilter, scopeFilter, categoryFilter, searchQuery, categories]);

  const listTotals = useMemo(() => {
    const calc = (cur) => {
      const items = filtered.filter((t) => t.currency === cur);
      return {
        income: round2(items.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0)),
        expense: round2(items.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0))
      };
    };
    return { AED: calc('AED'), EGP: calc('EGP') };
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Transactions</h2>
          <p className="text-xs text-slate-500">
            Showing {filtered.length} in {periodLabel} ({allTransactionsCount} total saved)
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onQuickAdd('income', false)}
            className="min-h-[44px] px-3 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold active:scale-95 touch-manipulation"
          >
            + Income
          </button>
          <button
            type="button"
            onClick={() => onQuickAdd('expense', false)}
            className="min-h-[44px] px-3 rounded-2xl bg-rose-600 text-white text-xs font-extrabold active:scale-95 touch-manipulation"
          >
            + Expense
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search description, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[46px] pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <CurrencyFilterPills value={currencyFilter} onChange={setCurrencyFilter} />

          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 select-none">
            {[
              { id: 'ALL', label: 'All Types' },
              { id: 'income', label: 'Income' },
              { id: 'expense', label: 'Expenses' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTypeFilter(t.id)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg transition touch-manipulation active:scale-95 ${
                  typeFilter === t.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 select-none">
            {[
              { id: 'ALL', label: 'All Scopes' },
              { id: 'personal', label: 'Personal' },
              { id: 'shared', label: 'Shared' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScopeFilter(s.id)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg transition touch-manipulation active:scale-95 ${
                  scopeFilter === s.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full min-h-[44px] text-xs font-bold bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-700 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Sections & Categories</option>
          {sections.map((sec) => (
            <optgroup key={sec.id} label={`Section: ${sec.name}`}>
              <option value={sec.id}>All in {sec.name}</option>
              {categories
                .filter((c) => c.sectionId === sec.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
          {(currencyFilter === 'ALL' || currencyFilter === 'AED') && (
            <div className="flex items-center gap-2.5 bg-indigo-50/70 px-3 py-2 rounded-xl border border-indigo-100">
              <span className="font-extrabold text-indigo-800">AED:</span>
              <span className="text-emerald-700 font-bold">
                +{formatMoney(listTotals.AED.income, 'AED')}
              </span>
              <span className="text-rose-700 font-bold">
                -{formatMoney(listTotals.AED.expense, 'AED')}
              </span>
            </div>
          )}
          {(currencyFilter === 'ALL' || currencyFilter === 'EGP') && (
            <div className="flex items-center gap-2.5 bg-teal-50/70 px-3 py-2 rounded-xl border border-teal-100">
              <span className="font-extrabold text-teal-800">EGP:</span>
              <span className="text-emerald-700 font-bold">
                +{formatMoney(listTotals.EGP.income, 'EGP')}
              </span>
              <span className="text-rose-700 font-bold">
                -{formatMoney(listTotals.EGP.expense, 'EGP')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200/80 text-center">
            <p className="text-sm font-semibold text-slate-600">No matching transactions found.</p>
          </div>
        ) : (
          filtered.map((tx) => {
            const cat = getCategory(tx.categoryId);
            const sec = getSection(cat.sectionId);
            const payer = getPerson(tx.paidBy);
            const isIncome = tx.type === 'income';
            const shares = getEffectiveShares(tx);

            return (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <CategoryIcon iconName={cat.icon} color={cat.color} size={18} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {tx.description}
                        </h4>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            tx.isShared
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tx.isShared ? 'Shared' : 'Personal'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tx.date} · {sec.name} / {cat.name}
                        {tx.type === 'expense' && ` · Paid by ${payer.name}`}
                      </p>
                      {tx.notes && (
                        <p className="text-xs text-slate-500 italic mt-1">“{tx.notes}”</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-base font-extrabold ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatMoney(tx.amount, tx.currency)}
                    </div>

                    <div className="flex items-center justify-end gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => onEditTx(tx)}
                        title="Edit Transaction"
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 touch-manipulation transition"
                      >
                        <Edit3 size={16} />
                      </button>
                      {confirmDeleteId === tx.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-xl border border-rose-200">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteTx(tx.id);
                              setConfirmDeleteId(null);
                            }}
                            className="min-h-[32px] px-1.5 text-xs font-extrabold text-rose-700 touch-manipulation"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="min-h-[32px] px-1 text-xs text-slate-600 touch-manipulation"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(tx.id)}
                          title="Delete Transaction"
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:scale-95 touch-manipulation transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {tx.type === 'expense' && (tx.isShared || shares.p2 > 0 || shares.p3 > 0) && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] font-bold">
                    {['me', 'p2', 'p3'].map((pid) => {
                      const amt = shares[pid] || 0;
                      if (amt <= 0) return null;
                      return (
                        <span
                          key={pid}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700"
                        >
                          {getPerson(pid).name}: {formatMoney(amt, tx.currency)}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. SHARED EXPENSES VIEW
// ============================================================================

function SharedExpensesView({
  transactions,
  allDebtItems,
  periodLabel,
  people,
  getPerson,
  getCategory,
  onQuickAdd,
  onEditTx,
  onDeleteTx,
  onNavigate
}) {
  // Net open position per person (Person 2 & Person 3)
  const personSummaries = useMemo(() => {
    return people
      .filter((p) => p.id !== 'me')
      .map((person) => {
        const calcNet = (cur) => {
          const theyOweMe = round2(
            allDebtItems.receivables
              .filter((r) => r.personId === person.id && r.currency === cur)
              .reduce((a, r) => a + r.outstanding, 0)
          );
          const iOweThem = round2(
            allDebtItems.payables
              .filter((p) => p.personId === person.id && p.currency === cur)
              .reduce((a, p) => a + p.outstanding, 0)
          );
          return {
            theyOweMe,
            iOweThem,
            net: round2(theyOweMe - iOweThem)
          };
        };
        return {
          person,
          AED: calcNet('AED'),
          EGP: calcNet('EGP')
        };
      });
  }, [people, allDebtItems]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Shared Expenses</h2>
          <p className="text-xs text-slate-500">
            3-person split tracker ({people.map((p) => p.name).join(', ')})
          </p>
        </div>
        <button
          type="button"
          onClick={onQuickAdd}
          className="min-h-[46px] px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm touch-manipulation"
        >
          <Plus size={16} />
          <span>Split Expense</span>
        </button>
      </div>

      {/* PARTICIPANTS & NET STANDING CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {personSummaries.map(({ person, AED, EGP }) => (
          <div
            key={person.id}
            className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm"
                  style={{ backgroundColor: person.color }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{person.name}</h3>
                  <p className="text-[11px] text-slate-500">All-time active balance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('balances')}
                className="min-h-[38px] px-3 rounded-xl bg-slate-100 text-xs font-extrabold text-indigo-700 touch-manipulation"
              >
                Settle
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { cur: 'AED', stats: AED },
                { cur: 'EGP', stats: EGP }
              ].map(({ cur, stats }) => (
                <div
                  key={cur}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <span className="font-extrabold text-slate-700">{cur}</span>
                  {stats.net > 0 ? (
                    <span className="font-extrabold text-emerald-700">
                      Owes you {formatMoney(stats.net, cur)}
                    </span>
                  ) : stats.net < 0 ? (
                    <span className="font-extrabold text-rose-700">
                      You owe {formatMoney(Math.abs(stats.net), cur)}
                    </span>
                  ) : (
                    <span className="font-bold text-slate-400">Settled (0.00)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SHARED EXPENSES LOG FOR SELECTED PERIOD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Shared & On-Behalf Expenses ({periodLabel})
          </h3>
          <span className="text-xs font-bold text-slate-500">{transactions.length} items</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">No shared expenses in {periodLabel}.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const cat = getCategory(tx.categoryId);
              const payer = getPerson(tx.paidBy);
              const shares = getEffectiveShares(tx);

              return (
                <div key={tx.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <CategoryIcon iconName={cat.icon} color={cat.color} size={18} />
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">
                          {tx.description}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {tx.date} · Paid by <strong className="text-slate-700">{payer.name}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-900">
                        {formatMoney(tx.amount, tx.currency)}
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => onEditTx(tx)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTx(tx.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {people.map((p) => (
                      <div
                        key={p.id}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px]"
                      >
                        <div className="text-slate-500 truncate">{p.name}</div>
                        <div className="font-extrabold text-slate-900">
                          {formatMoney(shares[p.id] || 0, tx.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 4. SEPARATE FINANCIAL BALANCES VIEW (A. RECEIVE vs B. PAY)
// ============================================================================

function BalancesView({
  allDebtItems,
  people,
  getPerson,
  getCategory,
  onOpenSettle,
  onDeleteSettlement,
  showToast
}) {
  const [activeSubTab, setActiveSubTab] = useState('receive');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('OPEN');
  const [personFilter, setPersonFilter] = useState('ALL');
  const [expandedKeys, setExpandedKeys] = useState({});

  const toggleExpand = (key) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rawList = activeSubTab === 'receive' ? allDebtItems.receivables : allDebtItems.payables;

  const filteredList = useMemo(() => {
    return rawList.filter((item) => {
      if (currencyFilter !== 'ALL' && item.currency !== currencyFilter) return false;
      if (personFilter !== 'ALL' && item.personId !== personFilter) return false;
      if (statusFilter === 'OPEN' && item.status === 'Paid') return false;
      if (statusFilter === 'PAID' && item.status !== 'Paid') return false;
      return true;
    });
  }, [rawList, currencyFilter, personFilter, statusFilter]);

  const totals = useMemo(() => {
    const calc = (list, cur) =>
      round2(list.filter((i) => i.currency === cur).reduce((acc, i) => acc + i.outstanding, 0));
    return {
      receiveAED: calc(allDebtItems.receivables, 'AED'),
      receiveEGP: calc(allDebtItems.receivables, 'EGP'),
      payAED: calc(allDebtItems.payables, 'AED'),
      payEGP: calc(allDebtItems.payables, 'EGP')
    };
  }, [allDebtItems]);

  const handleShareDebtSummary = () => {
    const p2 = getPerson('p2');
    const p3 = getPerson('p3');
    const lines = [
      '📊 *Shared Expenses & Debt Summary*',
      `Date: ${new Date().toISOString().slice(0, 10)}`,
      '',
      '✅ *Money Owed To Me:*'
    ];

    const openReceivables = allDebtItems.receivables.filter((r) => r.outstanding > 0);
    if (openReceivables.length === 0) {
      lines.push('• All settled (0.00)');
    } else {
      openReceivables.forEach((r) => {
        const who = getPerson(r.personId).name;
        lines.push(`• ${who}: ${formatMoney(r.outstanding, r.currency)} (${r.description} - ${r.date})`);
      });
    }

    lines.push('', '💸 *Money I Should Pay:*');
    const openPayables = allDebtItems.payables.filter((p) => p.outstanding > 0);
    if (openPayables.length === 0) {
      lines.push('• All settled (0.00)');
    } else {
      openPayables.forEach((p) => {
        const who = getPerson(p.personId).name;
        lines.push(`• To ${who}: ${formatMoney(p.outstanding, p.currency)} (${p.description} - ${p.date})`);
      });
    }

    lines.push(
      '',
      `📌 *Totals (${p2.name} & ${p3.name}):*`,
      `• Receivable: ${formatMoney(totals.receiveAED, 'AED')} | ${formatMoney(totals.receiveEGP, 'EGP')}`,
      `• Payable: ${formatMoney(totals.payAED, 'AED')} | ${formatMoney(totals.payEGP, 'EGP')}`
    );

    shareTextSummary({
      title: 'Shared Expenses Debt Summary',
      text: lines.join('\n'),
      onFeedback: showToast
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Financial Balances</h2>
          <p className="text-xs text-slate-500">
            Track receivables & payables with partial settlement logs
          </p>
        </div>

        <button
          type="button"
          onClick={handleShareDebtSummary}
          className="min-h-[46px] px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm touch-manipulation shrink-0"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* A vs B SUMMARY SELECTOR CARDS */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveSubTab('receive')}
          className={`p-3.5 rounded-3xl border text-left transition touch-manipulation active:scale-[0.98] ${
            activeSubTab === 'receive'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold">
            <ArrowDownLeft size={16} />
            <span>A. Should Receive</span>
          </div>
          <div className="mt-2 space-y-0.5">
            <div className="text-sm font-extrabold">{formatMoney(totals.receiveAED, 'AED')}</div>
            <div
              className={`text-xs font-bold ${
                activeSubTab === 'receive' ? 'text-emerald-100' : 'text-slate-500'
              }`}
            >
              {formatMoney(totals.receiveEGP, 'EGP')}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pay')}
          className={`p-3.5 rounded-3xl border text-left transition touch-manipulation active:scale-[0.98] ${
            activeSubTab === 'pay'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-extrabold">
            <ArrowUpRight size={16} />
            <span>B. Should Pay</span>
          </div>
          <div className="mt-2 space-y-0.5">
            <div className="text-sm font-extrabold">{formatMoney(totals.payAED, 'AED')}</div>
            <div
              className={`text-xs font-bold ${
                activeSubTab === 'pay' ? 'text-rose-100' : 'text-slate-500'
              }`}
            >
              {formatMoney(totals.payEGP, 'EGP')}
            </div>
          </div>
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 select-none">
            {[
              { id: 'OPEN', label: 'Unpaid & Partial' },
              { id: 'ALL', label: 'All History' },
              { id: 'PAID', label: 'Fully Paid' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg transition touch-manipulation active:scale-95 ${
                  statusFilter === st.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <CurrencyFilterPills value={currencyFilter} onChange={setCurrencyFilter} />
        </div>

        <select
          value={personFilter}
          onChange={(e) => setPersonFilter(e.target.value)}
          className="w-full min-h-[44px] text-xs font-bold bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 text-slate-700"
        >
          <option value="ALL">All Participants</option>
          {people
            .filter((p) => p.id !== 'me')
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>

      {/* DEBT ITEMS LIST */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200/80 text-center">
            <p className="text-sm font-semibold text-slate-600">
              No {activeSubTab === 'receive' ? 'receivables' : 'payables'} matching your filter.
            </p>
          </div>
        ) : (
          filteredList.map((item) => {
            const person = getPerson(item.personId);
            const cat = getCategory(item.categoryId);
            const isExpanded = !!expandedKeys[item.key];

            return (
              <div
                key={item.key}
                className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <CategoryIcon iconName={cat.icon} color={cat.color} size={18} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="text-xs font-extrabold px-2 py-0.5 rounded-lg text-white"
                          style={{ backgroundColor: person.color }}
                        >
                          {activeSubTab === 'receive' ? `From ${person.name}` : `To ${person.name}`}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 mt-1.5">
                        {item.description}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Date: {item.date} · Original Share: {formatMoney(item.originalShare, item.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-bold text-slate-500">Outstanding</div>
                    <div
                      className={`text-base font-extrabold ${
                        item.outstanding > 0
                          ? activeSubTab === 'receive'
                            ? 'text-emerald-700'
                            : 'text-rose-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {formatMoney(item.outstanding, item.currency)}
                    </div>
                    {item.paidSoFar > 0 && (
                      <div className="text-[11px] font-semibold text-slate-500">
                        Settled: {formatMoney(item.paidSoFar, item.currency)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Total Bill: {formatMoney(item.totalExpenseAmount, item.currency)}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.settlementHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.key)}
                        className="min-h-[42px] px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold flex items-center gap-1 touch-manipulation"
                      >
                        <span>History ({item.settlementHistory.length})</span>
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    )}

                    {item.outstanding > 0 && (
                      <button
                        type="button"
                        onClick={() => onOpenSettle(item)}
                        className={`min-h-[42px] px-4 py-1.5 rounded-2xl text-white text-xs font-extrabold shadow-xs active:scale-95 touch-manipulation transition ${
                          activeSubTab === 'receive'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {activeSubTab === 'receive' ? 'Record Receipt' : 'Record Payment'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Settlement Audit Log */}
                {isExpanded && item.settlementHistory.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Settlement Log
                    </div>
                    {item.settlementHistory.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200/70"
                      >
                        <div>
                          <span className="font-extrabold text-emerald-700">
                            {formatMoney(s.amount, s.currency)}
                          </span>
                          <span className="text-slate-500 ml-2">{s.date}</span>
                          {s.note && <span className="text-slate-500 italic ml-2">({s.note})</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteSettlement(s.id)}
                          title="Delete Settlement Entry"
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. REPORTS & ANALYTICS VIEW
// ============================================================================

function ReportsView({
  transactions,
  periodTransactions,
  summary,
  allDebtItems,
  selectedYear,
  selectedMonth,
  periodLabel,
  people,
  categories,
  getPerson,
  getCategory,
  getSection,
  showToast
}) {
  const [reportCurrency, setReportCurrency] = useState('AED');

  const curStats = summary[reportCurrency];

  // 6-Month Income vs Expenses Trend
  const sixMonthSeries = useMemo(() => {
    const months = [];
    let y = selectedYear;
    let m = selectedMonth;
    for (let i = 0; i < 6; i++) {
      months.unshift({ year: y, month: m, key: `${y}-${pad2(m)}` });
      if (m === 1) {
        m = 12;
        y -= 1;
      } else {
        m -= 1;
      }
    }

    const shortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months.map((slot) => {
      const mTxs = transactions.filter(
        (t) => t.currency === reportCurrency && (t.date || '').startsWith(slot.key)
      );
      const income = round2(
        mTxs.filter((t) => t.type === 'income').reduce((a, t) => a + Number(t.amount || 0), 0)
      );
      const expense = round2(
        mTxs
          .filter((t) => t.type === 'expense')
          .reduce((a, t) => a + getEffectiveShares(t).me, 0)
      );
      return {
        label: shortNames[slot.month - 1],
        key: slot.key,
        income,
        expense
      };
    });
  }, [transactions, reportCurrency, selectedYear, selectedMonth]);

  // Month-over-Month Comparison
  const momComparison = useMemo(() => {
    const current = sixMonthSeries[sixMonthSeries.length - 1] || { income: 0, expense: 0 };
    const previous = sixMonthSeries[sixMonthSeries.length - 2] || { income: 0, expense: 0 };
    const expDiff = round2(current.expense - previous.expense);
    const incDiff = round2(current.income - previous.income);
    return { current, previous, expDiff, incDiff };
  }, [sixMonthSeries]);

  // Spending by Category (My Share)
  const categoryBreakdown = useMemo(() => {
    const map = {};
    let total = 0;
    periodTransactions.forEach((tx) => {
      if (tx.type !== 'expense' || tx.currency !== reportCurrency) return;
      const myShare = getEffectiveShares(tx).me;
      if (myShare <= 0) return;
      if (!map[tx.categoryId]) {
        map[tx.categoryId] = { categoryId: tx.categoryId, amount: 0, count: 0 };
      }
      map[tx.categoryId].amount = round2(map[tx.categoryId].amount + myShare);
      map[tx.categoryId].count += 1;
      total = round2(total + myShare);
    });
    const list = Object.values(map).sort((a, b) => b.amount - a.amount);
    return { list, total };
  }, [periodTransactions, reportCurrency]);

  // Spending & Out-of-Pocket Paid by Person
  const personBreakdown = useMemo(() => {
    return people.map((person) => {
      let paidOutOfPocket = 0;
      let responsibleShare = 0;
      periodTransactions.forEach((tx) => {
        if (tx.type !== 'expense' || tx.currency !== reportCurrency) return;
        if (tx.paidBy === person.id) {
          paidOutOfPocket = round2(paidOutOfPocket + Number(tx.amount || 0));
        }
        const shares = getEffectiveShares(tx);
        responsibleShare = round2(responsibleShare + (shares[person.id] || 0));
      });
      return { person, paidOutOfPocket, responsibleShare };
    });
  }, [people, periodTransactions, reportCurrency]);

  const handleDownloadPeriodReport = (preferShare = false) => {
    const lines = [
      ['Personal Finance & Shared Expenses Period Report'],
      ['Period', periodLabel],
      ['Currency Focus', reportCurrency],
      ['Generated At', new Date().toISOString()],
      [],
      ['SUMMARY METRICS', reportCurrency],
      ['Personal Income', curStats.personalIncome],
      ['Settlements Received from Others', curStats.settlementsReceived],
      ['Total Money Received', curStats.totalMoneyReceived],
      ['My Personal Expenses', curStats.myPersonalExpenses],
      ['My Shared Expense Share', curStats.mySharedExpenseShare],
      ['Total My Expenses', curStats.totalMyExpenses],
      ['Settlements Paid to Others', curStats.settlementsPaid],
      ['Remaining Cash Balance', curStats.remainingBalance],
      ['Active Receivables (Owed to Me)', curStats.outstandingReceivable],
      ['Active Payables (I Owe)', curStats.outstandingPayable],
      [],
      ['CATEGORY BREAKDOWN', 'Section', 'Transactions', `My Share (${reportCurrency})`],
      ...categoryBreakdown.list.map((c) => {
        const cat = getCategory(c.categoryId);
        const sec = getSection(cat.sectionId);
        return [cat.name, sec.name, c.count, c.amount];
      }),
      [],
      ['TRANSACTIONS IN PERIOD'],
      ['Date', 'Type', 'Currency', 'Amount', 'Category', 'Description', 'Shared', 'Paid By', 'My Share']
    ];

    periodTransactions.forEach((tx) => {
      const cat = getCategory(tx.categoryId);
      const payer = getPerson(tx.paidBy);
      const myShare = tx.type === 'income' ? tx.amount : getEffectiveShares(tx).me;
      lines.push([
        tx.date,
        tx.type,
        tx.currency,
        tx.amount,
        cat.name,
        `"${(tx.description || '').replace(/"/g, '""')}"`,
        tx.isShared ? 'Yes' : 'No',
        payer.name,
        myShare
      ]);
    });

    const csvContent = '\uFEFF' + lines.map((r) => r.join(',')).join('\n');
    shareOrDownloadFile({
      content: csvContent,
      fileName: `Finance_Report_${periodLabel.replace(/\s+/g, '_')}_${reportCurrency}.csv`,
      mimeType: 'text/csv;charset=utf-8;',
      title: `Finance Report (${periodLabel} - ${reportCurrency})`,
      text: `Financial report for ${periodLabel} in ${reportCurrency}`,
      preferShare,
      onFeedback: showToast
    });
  };

  const maxBarValue = Math.max(
    100,
    ...sixMonthSeries.map((s) => Math.max(s.income, s.expense))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Reports & Analytics</h2>
          <p className="text-xs text-slate-500">Period insights for {periodLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 select-none">
            {['AED', 'EGP'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setReportCurrency(c)}
                className={`min-h-[42px] px-4 py-1.5 text-xs font-extrabold rounded-lg transition touch-manipulation active:scale-95 ${
                  reportCurrency === c
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleDownloadPeriodReport(false)}
            className="min-h-[46px] flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-extrabold shadow-xs touch-manipulation transition"
          >
            <Download size={15} />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadPeriodReport(true)}
            className="min-h-[46px] flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-extrabold shadow-xs touch-manipulation transition"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* MONTHLY / PERIOD SUMMARY KPI GRID */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            {periodLabel} Overview ({reportCurrency})
          </h3>
          <span className="text-xs font-bold text-indigo-700">
            Net Balance: {formatMoney(curStats.remainingBalance, reportCurrency)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-emerald-800 font-bold">Total Income</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {formatMoney(curStats.personalIncome, reportCurrency)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
            <div className="text-rose-800 font-bold">My Total Expenses</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {formatMoney(curStats.totalMyExpenses, reportCurrency)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-slate-600 font-bold">Personal Expenses</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {formatMoney(curStats.myPersonalExpenses, reportCurrency)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="text-indigo-800 font-bold">My Shared Share</div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              {formatMoney(curStats.mySharedExpenseShare, reportCurrency)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-slate-600 font-bold">Settled In / Out</div>
            <div className="text-xs font-extrabold text-slate-900 mt-1">
              +{formatCompact(curStats.settlementsReceived)} / -{formatCompact(curStats.settlementsPaid)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
            <div className="text-amber-800 font-bold">Open Debts (All-Time)</div>
            <div className="text-xs font-extrabold text-slate-900 mt-1">
              +{formatCompact(curStats.outstandingReceivable)} / -{formatCompact(curStats.outstandingPayable)}
            </div>
          </div>
        </div>
      </div>

      {/* 6-MONTH INCOME VS EXPENSES SVG BAR CHART */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              6-Month Income vs Expenses ({reportCurrency})
            </h3>
            <p className="text-xs text-slate-500">
              MoM Expense Change:{' '}
              <strong className={momComparison.expDiff <= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {momComparison.expDiff >= 0 ? '+' : ''}
                {formatMoney(momComparison.expDiff, reportCurrency)}
              </strong>
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Income
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> Expenses
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 360 175" className="w-full h-44 select-none">
            {[0, 0.5, 1].map((ratio, idx) => {
              const yPos = 140 - ratio * 115;
              return (
                <g key={idx}>
                  <line
                    x1="12"
                    y1={yPos}
                    x2="348"
                    y2={yPos}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {sixMonthSeries.map((bar, idx) => {
              const groupX = 24 + idx * 54;
              const incH = Math.max(2, (bar.income / maxBarValue) * 115);
              const expH = Math.max(2, (bar.expense / maxBarValue) * 115);
              return (
                <g key={bar.key}>
                  <rect
                    x={groupX}
                    y={140 - incH}
                    width="14"
                    height={incH}
                    rx="4"
                    fill="#10b981"
                  />
                  <rect
                    x={groupX + 17}
                    y={140 - expH}
                    width="14"
                    height={expH}
                    rx="4"
                    fill="#f43f5e"
                  />
                  <text
                    x={groupX + 15}
                    y="160"
                    textAnchor="middle"
                    fill="#475569"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {bar.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SPENDING BY CATEGORY */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            Spending by Category ({reportCurrency})
          </h3>
          <span className="text-xs font-bold text-slate-500">
            Total: {formatMoney(categoryBreakdown.total, reportCurrency)}
          </span>
        </div>

        {categoryBreakdown.list.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No {reportCurrency} expenses recorded in {periodLabel}.
          </p>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.list.map((item) => {
              const cat = getCategory(item.categoryId);
              const pct =
                categoryBreakdown.total > 0
                  ? Math.round((item.amount / categoryBreakdown.total) * 100)
                  : 0;
              return (
                <div key={item.categoryId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                      <span className="text-slate-400 font-normal">({pct}%)</span>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {formatMoney(item.amount, reportCurrency)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SPENDING BY PARTICIPANT */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900">
          Participant Breakdown ({periodLabel} · {reportCurrency})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {personBreakdown.map(({ person, paidOutOfPocket, responsibleShare }) => (
            <div
              key={person.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: person.color }}
                />
                <span className="text-xs font-extrabold text-slate-900">{person.name}</span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Paid Out-of-Pocket:</span>
                <strong className="text-slate-900">{formatCompact(paidOutOfPocket)}</strong>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between">
                <span>Responsible Share:</span>
                <strong className="text-indigo-700">{formatCompact(responsibleShare)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AED VS EGP SIDE-BY-SIDE COMPARISON */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900">AED vs EGP Period Comparison</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {['AED', 'EGP'].map((cur) => {
            const s = summary[cur];
            return (
              <div key={cur} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="font-extrabold text-indigo-700 text-sm">{cur}</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Income:</span>
                  <strong className="text-emerald-700">{formatCompact(s.personalIncome)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">My Expenses:</span>
                  <strong className="text-rose-700">{formatCompact(s.totalMyExpenses)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Owed to me:</span>
                  <strong>{formatCompact(s.outstandingReceivable)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">I owe:</span>
                  <strong>{formatCompact(s.outstandingPayable)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. SETTINGS VIEW (PEOPLE, CUSTOM SECTIONS & CATEGORIES, BACKUP & RESTORE)
// ============================================================================

function SettingsView({
  people,
  setPeople,
  sections,
  setSections,
  categories,
  setCategories,
  transactions,
  setTransactions,
  settlements,
  setSettlements,
  exchangeRate,
  setExchangeRate,
  showToast
}) {
  const [settingsTab, setSettingsTab] = useState('people'); // 'people' | 'categories' | 'backup'

  // Section & Category Creation State
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionType, setNewSectionType] = useState('expense');
  const [newCatName, setNewCatName] = useState('');
  const [newCatSectionId, setNewCatSectionId] = useState(sections[0]?.id || 'sec_daily');
  const [newCatColor, setNewCatColor] = useState(COLOR_PALETTE[0]);
  const [newCatIcon, setNewCatIcon] = useState('Receipt');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Backup Import Preview State
  const [pendingImport, setPendingImport] = useState(null);

  const handleUpdatePerson = (id, field, value) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const sec = {
      id: `sec_${Date.now()}`,
      name: newSectionName.trim(),
      type: newSectionType
    };
    setSections((prev) => [...prev, sec]);
    setNewCatSectionId(sec.id);
    setNewSectionName('');
    showToast(`Created section "${sec.name}"`);
  };

  const handleDeleteSection = (secId) => {
    if (sections.length <= 1) {
      showToast('At least one section must remain', 'error');
      return;
    }
    const fallbackSec = sections.find((s) => s.id !== secId);
    setCategories((prev) =>
      prev.map((c) => (c.sectionId === secId ? { ...c, sectionId: fallbackSec.id } : c))
    );
    setSections((prev) => prev.filter((s) => s.id !== secId));
    showToast('Section removed (categories moved)');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const parentSec = sections.find((s) => s.id === newCatSectionId);
    const newCat = {
      id: `cat_${Date.now()}`,
      sectionId: newCatSectionId,
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor,
      type: parentSec?.type || 'expense'
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    showToast(`Added category "${newCat.name}"`);
  };

  const handleRenameCategory = (catId) => {
    if (!editingCatName.trim()) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, name: editingCatName.trim() } : c))
    );
    setEditingCatId(null);
    showToast('Category renamed');
  };

  const handleDeleteCategory = (catId) => {
    const inUse = transactions.some((t) => t.categoryId === catId);
    if (inUse) {
      showToast('Cannot delete a category currently used by existing transactions', 'error');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category deleted');
  };

  // Backup Builders
  const buildJSONBackupString = () => {
    const backupPayload = {
      appIdentifier: 'DirhamAndPoundFinance',
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        people,
        sections,
        categories,
        transactions,
        settlements,
        exchangeRate
      }
    };
    return JSON.stringify(backupPayload, null, 2);
  };

  const handleExportJSON = (preferShare = false) => {
    shareOrDownloadFile({
      content: buildJSONBackupString(),
      fileName: `Finance_Backup_${new Date().toISOString().slice(0, 10)}.json`,
      mimeType: 'application/json',
      title: 'Dirham & Pound Full JSON Backup',
      text: `Full backup (${transactions.length} transactions, ${settlements.length} settlements)`,
      preferShare,
      onFeedback: showToast
    });
  };

  const handleCopyJSONClipboard = async () => {
    try {
      await navigator.clipboard.writeText(buildJSONBackupString());
      showToast('Full JSON backup copied to clipboard');
    } catch {
      showToast('Unable to copy JSON to clipboard', 'error');
    }
  };

  const handleExportCSV = (preferShare = false) => {
    const headers = [
      'ID',
      'Date',
      'Type',
      'Currency',
      'Total Amount',
      'Section',
      'Category',
      'Description',
      'Shared',
      'Paid By',
      `${people[0]?.name || 'Me'} Share`,
      `${people[1]?.name || 'Person 2'} Share`,
      `${people[2]?.name || 'Person 3'} Share`,
      'Notes'
    ];

    const rows = transactions.map((tx) => {
      const cat = categories.find((c) => c.id === tx.categoryId);
      const sec = sections.find((s) => s.id === cat?.sectionId);
      const payer = people.find((p) => p.id === tx.paidBy);
      const shares = getEffectiveShares(tx);
      return [
        tx.id,
        tx.date,
        tx.type,
        tx.currency,
        tx.amount,
        `"${(sec?.name || '').replace(/"/g, '""')}"`,
        `"${(cat?.name || '').replace(/"/g, '""')}"`,
        `"${(tx.description || '').replace(/"/g, '""')}"`,
        tx.isShared ? 'Yes' : 'No',
        `"${(payer?.name || tx.paidBy).replace(/"/g, '""')}"`,
        shares.me,
        shares.p2,
        shares.p3,
        `"${(tx.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    shareOrDownloadFile({
      content: csv,
      fileName: `Finance_Transactions_${new Date().toISOString().slice(0, 10)}.csv`,
      mimeType: 'text/csv;charset=utf-8;',
      title: 'Dirham & Pound Transactions CSV',
      text: `Transactions spreadsheet (${transactions.length} records)`,
      preferShare,
      onFeedback: showToast
    });
  };

  const handleSelectBackupFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const payload = parsed.data ? parsed.data : parsed;
        if (!Array.isArray(payload.transactions)) {
          showToast('Invalid backup file: missing transactions list', 'error');
          return;
        }
        const existingTxIds = new Set(transactions.map((t) => t.id));
        const duplicateCount = payload.transactions.filter((t) => existingTxIds.has(t.id)).length;
        const newCount = payload.transactions.length - duplicateCount;

        setPendingImport({
          fileName: file.name,
          exportedAt: parsed.exportedAt || 'Unknown date',
          payload,
          totalTx: payload.transactions.length,
          duplicateCount,
          newCount,
          settlementCount: Array.isArray(payload.settlements) ? payload.settlements.length : 0
        });
      } catch {
        showToast('Could not parse JSON backup file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const applyImport = (mode) => {
    if (!pendingImport) return;
    const { payload } = pendingImport;

    if (mode === 'replace') {
      if (Array.isArray(payload.people)) setPeople(payload.people);
      if (Array.isArray(payload.sections)) setSections(payload.sections);
      if (Array.isArray(payload.categories)) setCategories(payload.categories);
      setTransactions(payload.transactions || []);
      setSettlements(payload.settlements || []);
      if (payload.exchangeRate) setExchangeRate(payload.exchangeRate);
      showToast(`Restored ${payload.transactions.length} transactions (Replaced existing data)`);
    } else {
      // Merge while strictly skipping duplicate IDs
      const existingTxIds = new Set(transactions.map((t) => t.id));
      const newTxs = (payload.transactions || []).filter((t) => !existingTxIds.has(t.id));

      const existingSetIds = new Set(settlements.map((s) => s.id));
      const newSets = (payload.settlements || []).filter((s) => !existingSetIds.has(s.id));

      const existingSecIds = new Set(sections.map((s) => s.id));
      const newSecs = (payload.sections || []).filter((s) => !existingSecIds.has(s.id));

      const existingCatIds = new Set(categories.map((c) => c.id));
      const newCats = (payload.categories || []).filter((c) => !existingCatIds.has(c.id));

      if (newSecs.length > 0) setSections((prev) => [...prev, ...newSecs]);
      if (newCats.length > 0) setCategories((prev) => [...prev, ...newCats]);
      setTransactions((prev) => [...newTxs, ...prev]);
      setSettlements((prev) => [...newSets, ...prev]);
      showToast(`Merged ${newTxs.length} new transactions (${pendingImport.duplicateCount} duplicates skipped)`);
    }
    setPendingImport(null);
  };

  const handleResetDemo = () => {
    const demo = buildDemoData();
    setPeople(DEFAULT_PEOPLE);
    setSections(DEFAULT_SECTIONS);
    setCategories(DEFAULT_CATEGORIES);
    setTransactions(demo.transactions);
    setSettlements(demo.settlements);
    showToast('Reset to sample demo dataset');
  };

  const handleClearAll = () => {
    setTransactions([]);
    setSettlements([]);
    showToast('All transactions & settlements cleared');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Settings & Backup</h2>
        <p className="text-xs text-slate-500">
          Manage participants, custom sections & categories, and data portability
        </p>
      </div>

      {/* Sub-navigation Pills */}
      <div className="grid grid-cols-3 p-1 bg-slate-200/80 rounded-2xl select-none">
        {[
          { id: 'people', label: 'Participants' },
          { id: 'categories', label: 'Sections & Cats' },
          { id: 'backup', label: 'Backup & Export' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSettingsTab(tab.id)}
            className={`min-h-[44px] py-2 text-xs font-extrabold rounded-xl transition touch-manipulation ${
              settingsTab === tab.id ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PARTICIPANTS MANAGEMENT */}
      {settingsTab === 'people' && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Manage 3 Participants</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize names and badge colors for yourself and the two people you share expenses with.
            </p>
          </div>

          <div className="space-y-3">
            {people.map((person, idx) => (
              <div
                key={person.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    {idx === 0 ? 'Primary Account Holder (Me)' : `Shared Participant ${idx + 1}`}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: person.color }}
                  />
                </div>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handleUpdatePerson(person.id, 'name', e.target.value)}
                  className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_PALETTE.slice(0, 7).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleUpdatePerson(person.id, 'color', col)}
                      className={`w-8 h-8 rounded-xl border-2 transition ${
                        person.color === col ? 'border-slate-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM SECTIONS & CATEGORIES */}
      {settingsTab === 'categories' && (
        <div className="space-y-4">
          {/* Add New Section */}
          <form
            onSubmit={handleAddSection}
            className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3"
          >
            <h3 className="text-sm font-extrabold text-slate-900">Create Custom Section</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g., Medical, Investments, Car..."
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="flex-1 min-h-[46px] px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
              />
              <select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value)}
                className="min-h-[46px] px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold"
              >
                <option value="expense">Expense Section</option>
                <option value="income">Income Section</option>
              </select>
              <button
                type="submit"
                className="min-h-[46px] px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-extrabold"
              >
                Add Section
              </button>
            </div>
          </form>

          {/* Add New Category */}
          <form
            onSubmit={handleAddCategory}
            className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3"
          >
            <h3 className="text-sm font-extrabold text-slate-900">Create New Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Category name (e.g., Gym, Coffee)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="min-h-[46px] px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium"
              />
              <select
                value={newCatSectionId}
                onChange={(e) => setNewCatSectionId(e.target.value)}
                className="min-h-[46px] px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    Section: {s.name} ({s.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Color & Icon Picker */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_PALETTE.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setNewCatColor(col)}
                    className={`w-7 h-7 rounded-lg border-2 ${
                      newCatColor === col ? 'border-slate-900 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {ICON_NAMES.map((iconName) => {
                  const Ic = ICON_MAP[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setNewCatIcon(iconName)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        newCatIcon === iconName
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Ic size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold"
            >
              + Add Category
            </button>
          </form>

          {/* Existing Sections & Categories Tree */}
          <div className="space-y-3">
            {sections.map((sec) => {
              const secCats = categories.filter((c) => c.sectionId === sec.id);
              return (
                <div
                  key={sec.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{sec.name}</h4>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        {sec.type} section · {secCats.length} categories
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                      title="Delete Section"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {secCats.map((cat) => (
                      <div
                        key={cat.id}
                        className="py-2 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <CategoryIcon iconName={cat.icon} color={cat.color} size={15} />
                          {editingCatId === cat.id ? (
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="flex-1 min-h-[38px] px-2.5 py-1 rounded-xl border border-indigo-300 text-xs font-bold"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {cat.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {editingCatId === cat.id ? (
                            <button
                              type="button"
                              onClick={() => handleRenameCategory(cat.id)}
                              className="p-2 text-emerald-600"
                            >
                              <Check size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditingCatName(cat.name);
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600"
                            >
                              <Edit3 size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DATA BACKUP, IMPORT & EXPORT */}
      {settingsTab === 'backup' && (
        <div className="space-y-4">
          {/* Android Home Screen PWA Installation Guide */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 rounded-3xl border border-indigo-800/60 shadow-sm flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0 mt-0.5">
              <Smartphone size={22} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">Install on Android Home Screen</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  PWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open in <strong className="text-white">Google Chrome</strong>, tap{' '}
                <strong className="text-indigo-300">⋮ Menu</strong>, and select{' '}
                <strong className="text-white">“Add to Home screen”</strong> or{' '}
                <strong className="text-white">“Install app”</strong> for a full-screen offline experience.
              </p>
            </div>
          </div>

          {/* Export Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <Download size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Export & Backup</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Version-independent backups ({transactions.length} transactions, {settlements.length} settlements).
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleExportJSON(true)}
                  className="min-h-[50px] py-3 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.97] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm touch-manipulation transition"
                >
                  <Share2 size={17} />
                  <span>Share JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportJSON(false)}
                  className="min-h-[50px] py-3 px-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 active:scale-[0.97] text-indigo-800 border border-indigo-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 touch-manipulation transition"
                >
                  <FileJson size={17} />
                  <span>Download JSON</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleExportCSV(true)}
                  className="min-h-[50px] py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm touch-manipulation transition"
                >
                  <Share2 size={17} />
                  <span>Share CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExportCSV(false)}
                  className="min-h-[50px] py-3 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 active:scale-[0.97] text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 touch-manipulation transition"
                >
                  <FileSpreadsheet size={17} />
                  <span>Download CSV</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyJSONClipboard}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-xs font-bold flex items-center justify-center gap-2 touch-manipulation transition"
              >
                <Copy size={15} />
                <span>Copy Raw JSON Backup to Clipboard</span>
              </button>
            </div>
          </div>

          {/* Import / Restore Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                <Upload size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Import & Restore Backup</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload any previously exported JSON backup file. Duplicate transactions are automatically detected.
                </p>
              </div>
            </div>

            <label className="w-full min-h-[54px] flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-extrabold cursor-pointer touch-manipulation">
              <Upload size={18} />
              <span>Select JSON Backup File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleSelectBackupFile}
                className="hidden"
              />
            </label>

            {pendingImport && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="font-extrabold text-slate-900">
                  Ready to Import: {pendingImport.fileName}
                </div>
                <div className="space-y-1 text-slate-600">
                  <div>• Transactions in file: <strong>{pendingImport.totalTx}</strong></div>
                  <div>• New unique records: <strong className="text-emerald-700">{pendingImport.newCount}</strong></div>
                  <div>• Existing duplicates skipped on merge: <strong>{pendingImport.duplicateCount}</strong></div>
                  <div>• Settlements in file: <strong>{pendingImport.settlementCount}</strong></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => applyImport('merge')}
                    className="min-h-[46px] py-2.5 px-3 rounded-xl bg-indigo-600 text-white font-extrabold"
                  >
                    Merge (Skip Duplicates)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyImport('replace')}
                    className="min-h-[46px] py-2.5 px-3 rounded-xl bg-rose-600 text-white font-extrabold"
                  >
                    Replace All Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Data Management Reset Utilities */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetDemo}
              className="flex-1 min-h-[46px] py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold"
            >
              Load Sample Data
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex-1 min-h-[46px] py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold"
            >
              Clear All Transactions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODAL 1: ADD / EDIT TRANSACTION (ANDROID BOTTOM SHEET)
// ============================================================================

function TransactionModal({
  editingTx,
  defaults,
  people,
  sections,
  categories,
  onClose,
  onSave
}) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [type, setType] = useState(editingTx?.type || defaults.type || 'expense');
  const [amount, setAmount] = useState(editingTx ? String(editingTx.amount) : '');
  const [currency, setCurrency] = useState(editingTx?.currency || 'AED');
  const [description, setDescription] = useState(editingTx?.description || '');
  const [date, setDate] = useState(editingTx?.date || todayStr);
  const [notes, setNotes] = useState(editingTx?.notes || '');

  const availableCategories = useMemo(() => {
    const filtered = categories.filter((c) => c.type === type);
    return filtered.length > 0 ? filtered : categories;
  }, [categories, type]);

  const [categoryId, setCategoryId] = useState(
    editingTx?.categoryId || availableCategories[0]?.id || ''
  );

  useEffect(() => {
    if (!availableCategories.some((c) => c.id === categoryId)) {
      setCategoryId(availableCategories[0]?.id || '');
    }
  }, [type, availableCategories, categoryId]);

  const [isShared, setIsShared] = useState(
    editingTx ? Boolean(editingTx.isShared) : Boolean(defaults.isShared)
  );
  const [paidBy, setPaidBy] = useState(editingTx?.paidBy || 'me');
  const [belongsTo, setBelongsTo] = useState(editingTx?.belongsTo || 'me');
  const [splitMode, setSplitMode] = useState(editingTx?.splitMode || 'equal');

  const [includedIds, setIncludedIds] = useState(() => {
    if (editingTx?.isShared && editingTx.shares) {
      const active = ['me', 'p2', 'p3'].filter((id) => (editingTx.shares[id] || 0) > 0);
      return active.length > 0 ? active : ['me', 'p2', 'p3'];
    }
    return ['me', 'p2', 'p3'];
  });

  const [customAmounts, setCustomAmounts] = useState({
    me: editingTx?.shares?.me ? String(editingTx.shares.me) : '',
    p2: editingTx?.shares?.p2 ? String(editingTx.shares.p2) : '',
    p3: editingTx?.shares?.p3 ? String(editingTx.shares.p3) : ''
  });

  const [customPercentages, setCustomPercentages] = useState({
    me: '33.34',
    p2: '33.33',
    p3: '33.33'
  });

  const [formError, setFormError] = useState('');

  const numericAmount = round2(parseFloat(amount) || 0);

  const toggleParticipant = (pid) => {
    setIncludedIds((prev) => {
      if (prev.includes(pid)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== pid);
      }
      return [...prev, pid];
    });
  };

  // Live computed shares
  const computedShares = useMemo(() => {
    if (type !== 'expense' || numericAmount <= 0) {
      return { me: 0, p2: 0, p3: 0 };
    }
    if (!isShared) {
      return {
        me: belongsTo === 'me' ? numericAmount : 0,
        p2: belongsTo === 'p2' ? numericAmount : 0,
        p3: belongsTo === 'p3' ? numericAmount : 0
      };
    }
    if (splitMode === 'equal') {
      return computeEqualShares(numericAmount, includedIds);
    }
    if (splitMode === 'custom') {
      return {
        me: round2(parseFloat(customAmounts.me) || 0),
        p2: round2(parseFloat(customAmounts.p2) || 0),
        p3: round2(parseFloat(customAmounts.p3) || 0)
      };
    }
    // Percentage split
    const pMe = parseFloat(customPercentages.me) || 0;
    const p2 = parseFloat(customPercentages.p2) || 0;
    const p3 = parseFloat(customPercentages.p3) || 0;
    const amtMe = round2((numericAmount * pMe) / 100);
    const amtP2 = round2((numericAmount * p2) / 100);
    const amtP3 = round2(numericAmount - amtMe - amtP2);
    return {
      me: amtMe,
      p2: amtP2,
      p3: p3 > 0 ? Math.max(0, amtP3) : 0
    };
  }, [type, numericAmount, isShared, belongsTo, splitMode, includedIds, customAmounts, customPercentages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (numericAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a short description.');
      return;
    }

    if (type === 'expense' && isShared) {
      if (splitMode === 'custom') {
        const sum = round2(computedShares.me + computedShares.p2 + computedShares.p3);
        if (Math.abs(sum - numericAmount) > 0.01) {
          setFormError(
            `Custom split amounts (${formatMoney(sum, currency)}) must equal total (${formatMoney(
              numericAmount,
              currency
            )}).`
          );
          return;
        }
      }
      if (splitMode === 'percentage') {
        const pctSum = round2(
          (parseFloat(customPercentages.me) || 0) +
            (parseFloat(customPercentages.p2) || 0) +
            (parseFloat(customPercentages.p3) || 0)
        );
        if (Math.abs(pctSum - 100) > 0.1) {
          setFormError(`Percentages currently sum to ${pctSum}%. They must equal 100%.`);
          return;
        }
      }
    }

    onSave({
      type,
      amount: numericAmount,
      currency,
      description: description.trim(),
      categoryId,
      date,
      notes: notes.trim(),
      isShared: type === 'expense' ? isShared : false,
      paidBy: type === 'expense' ? paidBy : 'me',
      belongsTo: type === 'expense' ? (isShared ? 'shared' : belongsTo) : 'me',
      splitMode: type === 'expense' && isShared ? splitMode : 'equal',
      shares: type === 'expense' ? computedShares : { me: 0, p2: 0, p3: 0 },
      isDemo: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92dvh] flex flex-col">
        {/* Drag Handle Pill */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-base font-extrabold text-slate-900">
            {editingTx ? 'Edit Transaction' : 'Quick Add Transaction'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Expense vs Income Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl select-none">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`min-h-[44px] py-2 text-xs sm:text-sm font-extrabold rounded-xl transition touch-manipulation active:scale-[0.98] ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setIsShared(false);
                }}
                className={`min-h-[44px] py-2 text-xs sm:text-sm font-extrabold rounded-xl transition touch-manipulation active:scale-[0.98] ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount + Currency Row */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-600 block mb-1">Amount</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0.00"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full min-h-[50px] text-xl font-extrabold px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Currency</label>
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl h-[50px] select-none">
                  {['AED', 'EGP'].map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setCurrency(cur)}
                      className={`text-xs font-extrabold rounded-xl transition touch-manipulation active:scale-95 ${
                        currency === cur
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
              <input
                type="text"
                placeholder={
                  type === 'income'
                    ? 'e.g., Monthly Salary, Client Transfer'
                    : 'e.g., Carrefour Groceries, Dinner, DEWA Bill'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[48px] text-sm font-medium px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {type === 'income' ? 'Income Source / Category' : 'Category'}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full min-h-[48px] text-sm font-semibold px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                >
                  {sections.map((sec) => {
                    const secCats = availableCategories.filter((c) => c.sectionId === sec.id);
                    if (secCats.length === 0) return null;
                    return (
                      <optgroup key={sec.id} label={sec.name}>
                        {secCats.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[48px] text-sm font-semibold px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* EXPENSE-ONLY: PERSONAL VS SHARED ENGINE */}
            {type === 'expense' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Ownership
                  </span>
                  <div className="inline-flex p-1 bg-slate-200/80 rounded-xl select-none">
                    <button
                      type="button"
                      onClick={() => setIsShared(false)}
                      className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg transition touch-manipulation ${
                        !isShared ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsShared(true)}
                      className={`min-h-[40px] px-3 py-1.5 text-xs font-bold rounded-lg transition touch-manipulation ${
                        isShared ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Shared Split
                    </button>
                  </div>
                </div>

                {/* Who Paid? */}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">
                    Who Paid for This Expense?
                  </label>
                  <div className="grid grid-cols-3 gap-2 select-none">
                    {people.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaidBy(p.id)}
                        className={`min-h-[46px] py-2 px-2 rounded-xl border text-xs font-extrabold transition touch-manipulation active:scale-95 ${
                          paidBy === p.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal: Who Does It Belong To? */}
                {!isShared && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1.5">
                      Who Does This Personal Expense Belong To?
                    </label>
                    <div className="grid grid-cols-3 gap-2 select-none">
                      {people.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setBelongsTo(p.id)}
                          className={`min-h-[44px] py-2 px-2 rounded-xl border text-xs font-bold transition touch-manipulation active:scale-95 ${
                            belongsTo === p.id
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shared Split Controls */}
                {isShared && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1.5">
                        How Should It Be Divided?
                      </label>
                      <div className="grid grid-cols-3 p-1 bg-slate-200/80 rounded-xl select-none">
                        {[
                          { id: 'equal', label: 'Equal' },
                          { id: 'custom', label: 'Custom' },
                          { id: 'percentage', label: 'Percent %' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSplitMode(m.id)}
                            className={`min-h-[40px] py-1.5 text-xs font-bold rounded-lg transition touch-manipulation ${
                              splitMode === m.id ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {people.map((p) => {
                        const isIncluded = includedIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            className="min-h-[48px] flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80"
                          >
                            <label className="flex items-center gap-2.5 cursor-pointer min-h-[36px] select-none">
                              {splitMode === 'equal' && (
                                <input
                                  type="checkbox"
                                  checked={isIncluded}
                                  onChange={() => toggleParticipant(p.id)}
                                  className="w-5 h-5 rounded accent-indigo-600"
                                />
                              )}
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: p.color }}
                              />
                              <span className="text-xs font-bold text-slate-800">{p.name}</span>
                            </label>

                            {splitMode === 'equal' && (
                              <span className="text-xs font-extrabold text-slate-900">
                                {formatMoney(computedShares[p.id] || 0, currency)}
                              </span>
                            )}

                            {splitMode === 'custom' && (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={customAmounts[p.id]}
                                  onChange={(e) =>
                                    setCustomAmounts({ ...customAmounts, [p.id]: e.target.value })
                                  }
                                  className="w-24 min-h-[38px] text-right text-xs font-extrabold px-2.5 py-1.5 rounded-lg border border-slate-300"
                                />
                                <span className="text-[11px] font-bold text-slate-500">{currency}</span>
                              </div>
                            )}

                            {splitMode === 'percentage' && (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  step="0.1"
                                  value={customPercentages[p.id]}
                                  onChange={(e) =>
                                    setCustomPercentages({
                                      ...customPercentages,
                                      [p.id]: e.target.value
                                    })
                                  }
                                  className="w-16 min-h-[38px] text-right text-xs font-extrabold px-2 py-1.5 rounded-lg border border-slate-300"
                                />
                                <span className="text-xs font-bold text-slate-500">%</span>
                                <span className="text-[11px] font-bold text-indigo-700 w-20 text-right">
                                  ({formatCompact(computedShares[p.id] || 0)})
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Live Debt Impact Preview */}
                {numericAmount > 0 && (isShared || paidBy !== belongsTo) && (
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900 space-y-0.5">
                    <div className="font-bold">Automatic Debt Calculation Preview:</div>
                    {paidBy === 'me' ? (
                      ['p2', 'p3'].map((pid) => {
                        const s = computedShares[pid] || 0;
                        if (s <= 0) return null;
                        const name = people.find((x) => x.id === pid)?.name;
                        return (
                          <div key={pid}>
                            • <strong>{name}</strong> will owe you{' '}
                            <strong>{formatMoney(s, currency)}</strong>
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        • You will owe{' '}
                        <strong>{people.find((x) => x.id === paidBy)?.name}</strong>{' '}
                        <strong>{formatMoney(computedShares.me || 0, currency)}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Optional Notes */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Receipt details, bank ref, or extra context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[46px] text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          </div>

          {/* Sticky Action Footer */}
          <div className="px-5 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] border-t border-slate-100 bg-white flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[50px] py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-sm font-bold touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 min-h-[50px] py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-extrabold shadow-md shadow-indigo-200 touch-manipulation transition"
            >
              {editingTx ? 'Save Changes' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// MODAL 2: RECORD PARTIAL OR FULL SETTLEMENT
// ============================================================================

function SettlementModal({ item, getPerson, onClose, onSubmit }) {
  const person = getPerson(item.personId);
  const [amount, setAmount] = useState(String(item.outstanding));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = (e) => {
    e.preventDefault();
    const num = round2(parseFloat(amount) || 0);
    if (num <= 0) {
      setError('Settlement amount must be greater than 0.');
      return;
    }
    if (num > item.outstanding) {
      setError(`Amount cannot exceed remaining balance (${formatMoney(item.outstanding, item.currency)}).`);
      return;
    }
    onSubmit({
      transactionId: item.transactionId,
      personId: item.personId,
      direction: item.direction,
      amount: num,
      currency: item.currency,
      date,
      note: note.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90dvh] flex flex-col">
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-base font-extrabold text-slate-900">
            {item.direction === 'receive'
              ? `Receive Payment from ${person.name}`
              : `Pay Balance to ${person.name}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
              <div className="font-bold text-slate-900 text-sm">{item.description}</div>
              <div className="flex justify-between text-slate-600">
                <span>Original Share:</span>
                <span className="font-bold">{formatMoney(item.originalShare, item.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Already Settled:</span>
                <span className="font-bold text-emerald-700">
                  {formatMoney(item.paidSoFar, item.currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 pt-1 border-t border-slate-200 font-extrabold">
                <span>Remaining Due:</span>
                <span>{formatMoney(item.outstanding, item.currency)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600">
                  Settlement Amount ({item.currency})
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(String(item.outstanding))}
                  className="min-h-[36px] px-2 text-xs font-extrabold text-indigo-600 hover:underline touch-manipulation"
                >
                  Full Balance ({formatMoney(item.outstanding, item.currency)})
                </button>
              </div>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full min-h-[50px] text-xl font-extrabold px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Settlement Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[48px] text-sm font-semibold px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Bank transfer, Instapay, Cash"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full min-h-[48px] text-sm px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50"
              />
            </div>

            {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
          </div>

          <div className="px-5 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] border-t border-slate-100 bg-white flex gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[50px] py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold touch-manipulation active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 min-h-[50px] py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-sm touch-manipulation active:scale-[0.98]"
            >
              Confirm Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}