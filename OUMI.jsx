import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  PenTool, 
  Library, 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle,
  Clock,
  X,
  Printer,
  Quote,
  Bold,
  Italic,
  Type,
  List,
  Download,
  CheckSquare,
  Maximize,
  Minimize,
  StickyNote,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  Search,
  ArrowUp,
  ArrowDown,
  Timer,
  Play,
  Pause,
  RefreshCw,
  Target,
  Copy,
  FileBadge,
  Mic,
  MicOff,
  Moon,
  Sun,
  BarChart2
} from 'lucide-react';

// --- دوال مساعدة للتخزين المحلي ---
const loadState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const saveState = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Local Storage Error", e);
  }
};

// --- مكونات واجهة المستخدم (UI Components) ---

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, title, disabled = false }) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  // تعريف الأنماط بناءً على الوضع (Light/Dark سيتم التعامل معه عبر props أو Context لاحقاً، هنا نستخدم Tailwind dark classes بشكل ضمني إذا تم تفعيلها في الأب)
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95",
    secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95",
    ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200",
    toolbar: "p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded bg-transparent px-2 active:bg-gray-300",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm active:scale-95"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`} title={title}>
      {Icon && <Icon size={16} className={children ? "ml-2" : ""} />}
      {children}
    </button>
  );
};

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
      {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-full bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
      <Icon size={24} />
    </div>
  </div>
);

// --- مكونات خاصة ---

// مؤشر التسجيل الصوتي
const VoiceIndicator = ({ isListening }) => {
  if (!isListening) return null;
  return (
    <div className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse border border-red-200">
      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
      جاري الاستماع...
    </div>
  );
};

// نافذة البحث
const SearchModal = ({ isOpen, onClose, query, setQuery, results, onResultClick }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3 bg-gray-50 dark:bg-gray-900">
          <Search className="text-gray-400" />
          <input 
            autoFocus
            type="text" 
            className="flex-1 bg-transparent outline-none text-lg text-gray-800 dark:text-white"
            placeholder="ابحث في الفصول، الملاحظات، والمراجع..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 dark:text-gray-200">
          {results.length > 0 ? (
            results.map((result, idx) => (
              <div 
                key={idx} 
                onClick={() => { onResultClick(result); onClose(); }}
                className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer group transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    result.type === 'chapter' ? 'bg-indigo-100 text-indigo-700' :
                    result.type === 'note' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {result.type === 'chapter' ? 'فصل' : result.type === 'note' ? 'ملاحظة' : 'مرجع'}
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{result.title}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 pr-2 border-r-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-400 pl-4">
                  {result.preview}...
                </p>
              </div>
            ))
          ) : query ? (
            <div className="p-8 text-center text-gray-400">لا توجد نتائج مطابقة لـ "{query}"</div>
          ) : (
            <div className="p-8 text-center text-gray-400">ابدأ الكتابة للبحث...</div>
          )}
        </div>
      </div>
    </div>
  );
};

// مؤقت بومودورو
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); 

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') { setMode('break'); setTimeLeft(5 * 60); } 
      else { setMode('work'); setTimeLeft(25 * 60); }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner">
      <Timer size={16} className={mode === 'work' ? "text-red-500" : "text-green-500"} />
      <span className={`font-mono font-bold text-sm w-12 text-center ${mode === 'work' ? 'text-gray-700 dark:text-gray-200' : 'text-green-600 dark:text-green-400'}`}>
        {formatTime(timeLeft)}
      </span>
      <button onClick={toggleTimer} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-300">
        {isActive ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button onClick={resetTimer} className="hover:text-red-600 dark:hover:text-red-400 transition-colors text-gray-600 dark:text-gray-300">
        <RefreshCw size={14} />
      </button>
    </div>
  );
};

// --- المكونات الرئيسية (Main Components) ---

// 1. لوحة التحكم
const Dashboard = ({ stats, chapters }) => {
  // حساب بسيط للرسم البياني
  const maxWords = Math.max(...chapters.map(c => c.content ? c.content.split(/\s+/).length : 0), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8 flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة القيادة</h2>
           <p className="text-gray-500 dark:text-gray-400">نظرة عامة على تقدمك في الأطروحة</p>
        </div>
        <div className="hidden md:block">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <Target size={20} />
                <span className="font-bold">{stats.totalWords} كلمة</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="التقدم العام" value={`${stats.progress}%`} icon={CheckCircle} color="blue" />
        <StatCard title="عدد الفصول" value={stats.chaptersCount} icon={BookOpen} color="indigo" />
        <StatCard title="الملاحظات" value={stats.notesCount} icon={StickyNote} color="yellow" />
        <StatCard title="المهام" value={stats.pendingTasks} icon={CheckSquare} color="orange" subtext={`${stats.completedTasks} مكتملة`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الرسم البياني لحجم الفصول */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-white flex items-center gap-2">
             <BarChart2 size={18} /> توازن الفصول (عدد الكلمات)
           </h3>
           <div className="space-y-3">
             {chapters.map(ch => {
               const count = ch.content ? ch.content.split(/\s+/).length : 0;
               const percent = (count / maxWords) * 100;
               return (
                 <div key={ch.id} className="flex items-center gap-3">
                   <div className="w-24 text-xs font-medium text-gray-500 dark:text-gray-400 truncate text-left">{ch.title}</div>
                   <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                   </div>
                   <div className="w-12 text-xs text-gray-400 text-right">{count}</div>
                 </div>
               );
             })}
           </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-md text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">نصيحة اليوم</h3>
            <p className="opacity-90 leading-relaxed text-sm">
              "الكتابة الأكاديمية هي عملية إعادة كتابة. لا تقلق من جودة المسودة الأولى، القلق الحقيقي هو ألا يكون هناك مسودة أولى."
            </p>
          </div>
          <div className="mt-4 flex justify-end opacity-50">
            <Quote size={48} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. المحرر والهيكلية
const Editor = ({ chapters, setChapters, activeChapterId, setActiveChapterId, references }) => {
  const activeChapter = chapters.find(c => c.id === activeChapterId);
  const textareaRef = useRef(null);
  const [focusMode, setFocusMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // --- منطق التعرف على الصوت ---
  useEffect(() => {
    let recognition;
    if (isListening) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          // إضافة النص الجديد إلى المحتوى الحالي
          // ملاحظة: هذا تنفيذ بسيط، التنفيذ الكامل يحتاج معالجة المؤشر بدقة
          if (event.results[0].isFinal) {
             insertAtCursor(transcript + ' ');
          }
        };

        recognition.start();
      } else {
        alert('متصفحك لا يدعم خاصية تحويل الصوت إلى نص.');
        setIsListening(false);
      }
    }
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  const updateContent = (content) => {
    setChapters(chapters.map(c => c.id === activeChapterId ? { ...c, content } : c));
  };

  const updateStatus = (status) => {
    setChapters(chapters.map(c => c.id === activeChapterId ? { ...c, status } : c));
  };

  const addChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: 'فصل جديد',
      content: '',
      type: 'chapter',
      status: 'draft' 
    };
    setChapters([...chapters, newChapter]);
    setActiveChapterId(newChapter.id);
  };

  const moveChapter = (index, direction) => {
      const newChapters = [...chapters];
      if (direction === 'up' && index > 0) {
          [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
      } else if (direction === 'down' && index < chapters.length - 1) {
          [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
      }
      setChapters(newChapters);
  };

  const insertAtCursor = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeChapter.content || '';
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    updateContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const renderMarkdown = (text) => {
    if (!text) return <p className="text-gray-400 italic">لا يوجد محتوى...</p>;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-gray-700 dark:text-gray-200">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-8 mb-4 text-blue-800 dark:text-blue-400">{line.replace('# ', '')}</h1>;
      if (line.startsWith('- ')) return <li key={i} className="mr-4 text-gray-700 dark:text-gray-300">{line.replace('- ', '')}</li>;
      return <p key={i} className="mb-2 leading-8 text-gray-700 dark:text-gray-300">{line}</p>;
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'review': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'مكتمل';
      case 'review': return 'مراجعة';
      default: return 'مسودة';
    }
  };

  const words = activeChapter?.content ? activeChapter.content.split(/\s+/).filter(w => w !== '').length : 0;
  const readingTime = Math.ceil(words / 200); 

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in relative transition-all duration-300">
      {/* شجرة الفصول */}
      {!focusMode && (
        <div className="w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col animate-slide-in">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 className="font-bold text-gray-700 dark:text-gray-200">هيكل الأطروحة</h3>
            <button onClick={addChapter} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-blue-600 transition-colors" title="إضافة فصل">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`flex items-center justify-between p-2 rounded-lg group text-sm transition-all ${
                  activeChapterId === chapter.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold border-r-4 border-blue-600' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-r-4 border-transparent'
                }`}
              >
                <div onClick={() => setActiveChapterId(chapter.id)} className="flex items-center flex-1 cursor-pointer min-w-0">
                    <div className={`w-2 h-2 rounded-full mr-2 ml-2 flex-shrink-0 ${
                        chapter.status === 'completed' ? 'bg-green-500' : 
                        chapter.status === 'review' ? 'bg-orange-400' : 'bg-gray-300'
                    }`} />
                    <span className="truncate">{chapter.title}</span>
                </div>
                
                <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); moveChapter(index, 'up'); }} className="text-gray-400 hover:text-blue-600 disabled:opacity-30" disabled={index === 0}><ArrowUp size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); moveChapter(index, 'down'); }} className="text-gray-400 hover:text-blue-600 disabled:opacity-30" disabled={index === chapters.length - 1}><ArrowDown size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* المحرر */}
      <div className={`flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ${focusMode ? 'max-w-4xl mx-auto shadow-2xl border-blue-100' : ''}`}>
        {activeChapter ? (
          <>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <input 
                        type="text" 
                        value={activeChapter.title}
                        onChange={(e) => setChapters(chapters.map(c => c.id === activeChapterId ? { ...c, title: e.target.value } : c))}
                        className="bg-transparent font-bold text-xl text-gray-800 dark:text-white outline-none w-full placeholder-gray-400"
                        placeholder="عنوان الفصل..."
                    />
                    <div className="flex items-center gap-2">
                        {/* Voice Dictation Button */}
                        <button 
                          onClick={() => setIsListening(!isListening)}
                          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500'}`}
                          title="الكتابة بالصوت"
                        >
                          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>

                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        
                        <button 
                            onClick={() => setPreviewMode(!previewMode)}
                            className={`p-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${previewMode ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                            title={previewMode ? "العودة للكتابة" : "معاينة التنسيق"}
                        >
                            {previewMode ? <><EyeOff size={16} /> تحرير</> : <><Eye size={16} /> قراءة</>}
                        </button>
                        <button 
                            onClick={() => setFocusMode(!focusMode)} 
                            className={`p-2 rounded-full hover:bg-blue-100 text-gray-500 transition-colors ${focusMode ? 'text-blue-600 bg-blue-50' : ''}`}
                            title={focusMode ? "إنهاء وضع التركيز" : "وضع التركيز"}
                        >
                            {focusMode ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex gap-2 items-center">
                         <div className="relative group">
                            <button className={`flex items-center gap-1 px-2 py-1 rounded-md border ${getStatusColor(activeChapter.status || 'draft')}`}>
                                <span>{getStatusLabel(activeChapter.status || 'draft')}</span>
                                <ArrowDown size={10} />
                            </button>
                            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg hidden group-hover:block z-20 w-32">
                                <button onClick={() => updateStatus('draft')} className="w-full text-right px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200">مسودة 📝</button>
                                <button onClick={() => updateStatus('review')} className="w-full text-right px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-orange-600 dark:text-orange-400">مراجعة 👀</button>
                                <button onClick={() => updateStatus('completed')} className="w-full text-right px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-green-600 dark:text-green-400">مكتمل ✅</button>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            <Clock size={12} /> {readingTime} دقيقة قراءة
                        </span>
                        <VoiceIndicator isListening={isListening} />
                    </div>
                    <span>{words} كلمة</span>
                </div>
            </div>

            {!previewMode && (
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex-wrap">
                <Button variant="toolbar" onClick={() => insertAtCursor('# ')} title="عنوان رئيسي">H1</Button>
                <Button variant="toolbar" onClick={() => insertAtCursor('## ')} title="عنوان فرعي">H2</Button>
                <Button variant="toolbar" onClick={() => insertAtCursor('### ')} title="عنوان فرعي أصغر">H3</Button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <Button variant="toolbar" onClick={() => insertAtCursor('**', '**')} title="عريض"><Bold size={16} /></Button>
                <Button variant="toolbar" onClick={() => insertAtCursor('*', '*')} title="مائل"><Italic size={16} /></Button>
                <Button variant="toolbar" onClick={() => insertAtCursor('- ')} title="قائمة"><List size={16} /></Button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                
                <div className="relative group">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 transition-colors">
                    <Quote size={14} /> إدراج مرجع
                    </button>
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 hidden group-hover:block z-10 p-1 max-h-48 overflow-y-auto">
                        {references.length > 0 ? references.map(ref => (
                        <button 
                            key={ref.id}
                            onClick={() => insertAtCursor(` (${ref.author}, ${ref.year}) `)}
                            className="w-full text-right px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex flex-col border-b dark:border-gray-700 last:border-0"
                        >
                            <span className="font-bold text-gray-700 dark:text-gray-200 truncate w-full">{ref.title}</span>
                            <span className="text-gray-400">{ref.author}</span>
                        </button>
                        )) : (
                        <div className="p-2 text-center text-gray-400 text-xs">لا توجد مراجع محفوظة</div>
                        )}
                    </div>
                </div>
                </div>
            )}

            {previewMode ? (
                 <div className="flex-1 p-8 w-full overflow-y-auto text-lg font-serif leading-9 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    {renderMarkdown(activeChapter.content)}
                 </div>
            ) : (
                <textarea
                ref={textareaRef}
                className="flex-1 p-8 w-full resize-none outline-none text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 leading-9 text-lg font-serif"
                placeholder="ابدأ الكتابة هنا..."
                value={activeChapter.content}
                onChange={(e) => updateContent(e.target.value)}
                dir="rtl"
                />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">اختر فصلاً للبدء</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. المنهجية (نفس الكود السابق مع دعم Dark Mode)
const Methodology = ({ items, setItems }) => {
  const [newItem, setNewItem] = useState({ type: 'hypothesis', content: '' });
  const addItem = () => { if (!newItem.content) return; setItems([...items, { ...newItem, id: Date.now() }]); setNewItem({ ...newItem, content: '' }); };
  const deleteItem = (id) => { setItems(items.filter(i => i.id !== id)); };
  const types = { hypothesis: 'فرضية', question: 'سؤال بحثي', variable: 'متغير', tool: 'أداة دراسة', population: 'مجتمع الدراسة' };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">المنهجية العلمية</h2>
        <p className="text-gray-500 dark:text-gray-400">بناء الهيكل المنهجي للدراسة بشكل منظم</p>
      </header>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <select 
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white md:w-1/4"
            value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          >
            {Object.entries(types).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <input 
            type="text" className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="مثال: توجد فروق ذات دلالة إحصائية..." value={newItem.content} onChange={(e) => setNewItem({ ...newItem, content: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
        </div>
        <div className="flex justify-end"><Button onClick={addItem} icon={Plus}>إضافة</Button></div>
      </div>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-start group hover:border-blue-300 transition-all">
            <div className="flex gap-4">
               <span className={`px-3 py-1 rounded-full text-xs font-bold h-fit whitespace-nowrap
                ${item.type === 'hypothesis' ? 'bg-purple-100 text-purple-700' : item.type === 'question' ? 'bg-blue-100 text-blue-700' : item.type === 'tool' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                {types[item.type]}
              </span>
              <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">{item.content}</p>
            </div>
            <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 py-10">القائمة فارغة</p>}
      </div>
    </div>
  );
};

// 4. المراجع
const References = ({ refs, setRefs }) => {
  const [newRef, setNewRef] = useState({ title: '', author: '', year: '', type: 'book' });
  const addRef = () => { if (!newRef.title) return; setRefs([...refs, { ...newRef, id: Date.now() }]); setNewRef({ title: '', author: '', year: '', type: 'book' }); };
  const copyAPA = (ref) => {
    let citation = ref.type === 'book' ? `${ref.author} (${ref.year}). ${ref.title}.` : ref.type === 'journal' ? `${ref.author} (${ref.year}). ${ref.title}. [Journal], [Vol].` : `${ref.author} (${ref.year}). ${ref.title}. [URL]`;
    navigator.clipboard.writeText(citation); alert('تم نسخ التوثيق (APA)!');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">المراجع والمصادر</h2>
        <p className="text-gray-500 dark:text-gray-400">إدارة المصادر وتنسيق التوثيق</p>
      </header>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2"><input className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="عنوان المرجع" value={newRef.title} onChange={e => setNewRef({...newRef, title: e.target.value})} /></div>
          <input className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="المؤلف" value={newRef.author} onChange={e => setNewRef({...newRef, author: e.target.value})} />
          <div className="flex gap-4">
            <input className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="السنة" type="number" value={newRef.year} onChange={e => setNewRef({...newRef, year: e.target.value})} />
            <select className="w-full p-2 border rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newRef.type} onChange={e => setNewRef({...newRef, type: e.target.value})}>
                <option value="book">كتاب</option><option value="journal">مقال</option><option value="website">ويب</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end"><Button onClick={addRef} icon={Plus}>إضافة مرجع</Button></div>
      </div>
      <div className="space-y-3">
        {refs.map(ref => (
          <div key={ref.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center group hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-500 dark:text-gray-400">{ref.type === 'book' ? <BookOpen size={18}/> : ref.type === 'journal' ? <FileText size={18}/> : <Library size={18}/>}</div>
              <div><h4 className="font-bold text-gray-800 dark:text-gray-200">{ref.title}</h4><p className="text-sm text-gray-500 dark:text-gray-400">{ref.author} ({ref.year})</p></div>
            </div>
            <div className="flex gap-2">
                 <button onClick={() => copyAPA(ref)} className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30" title="نسخ توثيق APA"><Copy size={16} /></button>
                 <button onClick={() => setRefs(refs.filter(r => r.id !== ref.id))} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. المهام (نفس الكود مع دعم Dark Mode)
const Tasks = ({ tasks, setTasks }) => {
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('medium');
    const addTask = () => { if (!newTask) return; setTasks([...tasks, { id: Date.now(), text: newTask, priority, completed: false }]); setNewTask(''); };
    const toggleTask = (id) => { setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };
    const deleteTask = (id) => { setTasks(tasks.filter(t => t.id !== id)); };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-10">
            <header className="mb-8"><h2 className="text-2xl font-bold text-gray-800 dark:text-white">المهام</h2></header>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex gap-4">
                <input className="flex-1 p-3 border rounded-lg outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="مهمة جديدة..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
                <select className="p-3 border rounded-lg outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="high">عالية</option><option value="medium">متوسطة</option><option value="low">منخفضة</option>
                </select>
                <Button onClick={addTask} icon={Plus}>إضافة</Button>
            </div>
            <div className="space-y-3">
                {tasks.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1).map(task => (
                    <div key={task.id} className={`bg-white dark:bg-gray-800 p-4 rounded-xl border flex items-center gap-3 transition-all ${task.completed ? 'opacity-60 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}>
                        <button onClick={() => toggleTask(task.id)} className={`p-1 rounded border ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-blue-500'}`}><CheckSquare size={18} /></button>
                        <div className="flex-1"><p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{task.text}</p></div>
                        <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 6. الملاحظات
const Notes = ({ notes, setNotes }) => {
    const [newNote, setNewNote] = useState('');
    const [color, setColor] = useState('yellow');
    const addNote = () => { if (!newNote) return; setNotes([...notes, { id: Date.now(), text: newNote, color, date: new Date().toLocaleDateString('ar-EG') }]); setNewNote(''); };
    const deleteNote = (id) => { setNotes(notes.filter(n => n.id !== id)); };
    const colors = { yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100' };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in pb-10">
            <header className="mb-8"><h2 className="text-2xl font-bold text-gray-800 dark:text-white">ملاحظات</h2></header>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                <textarea className="w-full p-4 border rounded-lg outline-none focus:border-blue-500 min-h-[100px] mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="اكتب فكرتك هنا..." value={newNote} onChange={e => setNewNote(e.target.value)} />
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {Object.keys(colors).map(c => <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-400' : 'border-transparent'} ${c === 'yellow' ? 'bg-yellow-200' : c === 'blue' ? 'bg-blue-200' : 'bg-pink-200'}`} />)}
                    </div>
                    <Button onClick={addNote} icon={Plus}>حفظ</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                    <div key={note.id} className={`p-6 rounded-xl shadow-sm border relative group ${colors[note.color]}`}>
                        <p className="whitespace-pre-wrap font-medium leading-relaxed mb-6">{note.text}</p>
                        <div className="absolute bottom-4 left-4 flex justify-between w-full pr-8"><span className="text-xs opacity-60 font-mono">{note.date}</span><button onClick={() => deleteNote(note.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 7. الإعدادات (مع إعدادات الغلاف)
const SettingsTab = ({ onExport, onImport, onExportWord, coverPage, setCoverPage }) => {
    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10">
            <header className="mb-8"><h2 className="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h2></header>

            {/* إعدادات صفحة الغلاف */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">تصميم صفحة الغلاف</h3>
                <div className="space-y-4">
                    <input className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="اسم الجامعة" value={coverPage.uni} onChange={e => setCoverPage({...coverPage, uni: e.target.value})} />
                    <input className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="الكلية / القسم" value={coverPage.college} onChange={e => setCoverPage({...coverPage, college: e.target.value})} />
                    <input className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="اسم الطالب" value={coverPage.student} onChange={e => setCoverPage({...coverPage, student: e.target.value})} />
                    <input className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="اسم المشرف" value={coverPage.supervisor} onChange={e => setCoverPage({...coverPage, supervisor: e.target.value})} />
                </div>
            </div>

            <div className="space-y-4">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div><h3 className="font-bold text-gray-800 dark:text-white">تصدير Word</h3><p className="text-sm text-gray-500">تحميل الأطروحة مع صفحة الغلاف</p></div>
                    <Button onClick={onExportWord} variant="secondary" icon={FileBadge}>DOCX</Button>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div><h3 className="font-bold text-gray-800 dark:text-white">نسخة احتياطية</h3><p className="text-sm text-gray-500">حفظ البيانات كملف JSON</p></div>
                    <Button onClick={onExport} variant="secondary" icon={Download}>حفظ</Button>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div><h3 className="font-bold text-gray-800 dark:text-white">استعادة</h3><p className="text-sm text-gray-500">رفع ملف نسخة سابقة</p></div>
                     <label className="flex items-center justify-center px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 cursor-pointer text-sm font-medium"><Upload size={16} className="ml-2" /> استيراد<input type="file" accept=".json" onChange={onImport} className="hidden" /></label>
                </div>
            </div>
        </div>
    );
};

// --- التطبيق الرئيسي ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => loadState('darkMode', false));

  // تحميل البيانات
  const [chapters, setChapters] = useState(() => loadState('chapters', [
    { id: 1, title: 'المقدمة', content: '# مقدمة الدراسة\nتعتبر هذه الدراسة...', type: 'chapter', status: 'draft' }
  ]));
  const [activeChapterId, setActiveChapterId] = useState(() => { const ch = loadState('chapters', []); return ch.length > 0 ? ch[0].id : null; });
  const [methodologyItems, setMethodologyItems] = useState(() => loadState('methodology', []));
  const [references, setReferences] = useState(() => loadState('references', []));
  const [tasks, setTasks] = useState(() => loadState('tasks', []));
  const [notes, setNotes] = useState(() => loadState('notes', []));
  const [coverPage, setCoverPage] = useState(() => loadState('coverPage', { uni: '', college: '', student: '', supervisor: '' }));

  useEffect(() => {
    saveState('chapters', chapters);
    saveState('methodology', methodologyItems);
    saveState('references', references);
    saveState('tasks', tasks);
    saveState('notes', notes);
    saveState('darkMode', isDarkMode);
    saveState('coverPage', coverPage);
  }, [chapters, methodologyItems, references, tasks, notes, isDarkMode, coverPage]);

  // تطبيق الوضع الليلي
  useEffect(() => {
      if (isDarkMode) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [isDarkMode]);

  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const handleExportData = () => {
      const dataStr = JSON.stringify({ chapters, methodologyItems, references, tasks, notes, coverPage }, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `thesis_backup.json`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      showNotification('تم الحفظ بنجاح');
  };

  const handleExportWord = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Thesis</title></head><body>";
    const footer = "</body></html>";
    
    // تصميم صفحة الغلاف
    let htmlBody = `
        <div style="text-align:center; padding-top: 50px; font-family: Arial, sans-serif;">
            <h2>${coverPage.uni}</h2>
            <h3>${coverPage.college}</h3>
            <br><br><br><br>
            <h1 style="font-size: 32px; border: 2px solid black; padding: 20px;">عنوان الأطروحة</h1>
            <br><br><br>
            <h3>إعداد الطالب: ${coverPage.student}</h3>
            <h3>إشراف الدكتور: ${coverPage.supervisor}</h3>
            <br><br><br><br>
            <h4>${new Date().getFullYear()}</h4>
        </div>
        <br style="page-break-before: always;">
    `;

    chapters.forEach(chapter => {
        htmlBody += `<h2>${chapter.title}</h2>`;
        const contentHtml = chapter.content.replace(/\n/g, "<br>").replace(/# (.*)/g, "<h1>$1</h1>").replace(/## (.*)/g, "<h2>$1</h2>");
        htmlBody += `<p>${contentHtml}</p><br><hr><br>`;
    });

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(header+htmlBody+footer);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source; fileDownload.download = 'thesis_draft.doc';
    fileDownload.click(); document.body.removeChild(fileDownload);
    showNotification('تم تصدير ملف Word');
  };

  const handleImportData = (event) => {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const data = JSON.parse(e.target.result);
              if (confirm('هل أنت متأكد من استعادة البيانات؟')) {
                  setChapters(data.chapters || []); setMethodologyItems(data.methodologyItems || []);
                  setReferences(data.references || []); setTasks(data.tasks || []); setNotes(data.notes || []);
                  if(data.coverPage) setCoverPage(data.coverPage);
                  showNotification('تمت الاستعادة');
              }
          } catch (error) { alert('ملف غير صالح'); }
      };
      reader.readAsText(file);
  };

  const searchResults = searchQuery.trim() === '' ? [] : [
    ...chapters.filter(c => c.title.includes(searchQuery) || c.content.includes(searchQuery)).map(c => ({...c, type: 'chapter', preview: c.title})),
    ...notes.filter(n => n.text.includes(searchQuery)).map(n => ({...n, type: 'note', preview: n.text, title: 'ملاحظة'})),
    ...references.filter(r => r.title.includes(searchQuery)).map(r => ({...r, type: 'reference', preview: r.title, title: 'مرجع'}))
  ];

  const handleSearchResultClick = (result) => {
    if (result.type === 'chapter') { setActiveChapterId(result.id); setActiveTab('editor'); }
    else if (result.type === 'note') setActiveTab('notes');
    else if (result.type === 'reference') setActiveTab('references');
  };

  const stats = {
    progress: Math.round((chapters.filter(c => c.content.length > 50).length / Math.max(chapters.length, 1)) * 100),
    chaptersCount: chapters.length, referencesCount: references.length, notesCount: notes.length,
    pendingTasks: tasks.filter(t => !t.completed).length, completedTasks: tasks.filter(t => t.completed).length,
    totalWords: chapters.reduce((acc, curr) => acc + (curr.content ? curr.content.split(/\s+/).filter(w => w !== '').length : 0), 0)
  };

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'editor', label: 'المحرر', icon: PenTool },
    { id: 'methodology', label: 'المنهجية', icon: Settings },
    { id: 'references', label: 'المراجع', icon: Library },
    { id: 'notes', label: 'ملاحظات', icon: StickyNote },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className={`flex h-screen font-sans text-right ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`} dir="rtl">
      <aside className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-sm z-10 hidden md:flex">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg"><BookOpen size={20} /></div>
          <h1 className="text-xl font-extrabold tracking-tight">أطروحتي</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm translate-x-1' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <item.icon size={20} className={activeTab === item.id ? "text-blue-600 dark:text-blue-300" : "text-gray-400"} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
             <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mb-2">
                 {isDarkMode ? <><Sun size={16}/> وضع النهار</> : <><Moon size={16}/> وضع الليل</>}
             </button>
            <button onClick={handleExportData} className="flex items-center justify-center gap-2 w-full p-2 text-xs text-gray-500 hover:text-blue-600 transition-colors"><Download size={14} /> حفظ نسخة احتياطية</button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col relative bg-gray-50 dark:bg-gray-900">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-gray-700 dark:text-white text-lg hidden md:block">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <button onClick={() => setShowSearch(true)} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-500 dark:text-gray-300 px-3 py-1.5 rounded-lg transition-colors text-sm"><Search size={16} /> <span className="hidden sm:inline">بحث شامل...</span></button>
          </div>
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2">{navItems.map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-2 rounded flex-shrink-0 ${activeTab === item.id ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}><item.icon size={20} /></button>)}</div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block"><PomodoroTimer /></div>
            <Button variant="ghost" onClick={() => setShowPreview(true)} icon={Printer} className="hidden md:flex">معاينة</Button>
            <Button variant="secondary" onClick={() => showNotification('تم الحفظ بنجاح')} icon={Save}>حفظ</Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
          {activeTab === 'dashboard' && <Dashboard stats={stats} chapters={chapters} />}
          {activeTab === 'editor' && <Editor chapters={chapters} setChapters={setChapters} activeChapterId={activeChapterId} setActiveChapterId={setActiveChapterId} references={references} />}
          {activeTab === 'methodology' && <Methodology items={methodologyItems} setItems={setMethodologyItems} />}
          {activeTab === 'references' && <References refs={references} setRefs={setReferences} />}
          {activeTab === 'notes' && <Notes notes={notes} setNotes={setNotes} />}
          {activeTab === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} />}
          {activeTab === 'settings' && <SettingsTab onExport={handleExportData} onImport={handleImportData} onExportWord={handleExportWord} coverPage={coverPage} setCoverPage={setCoverPage} />}
        </div>

        {showPreview && <PrintPreview chapters={chapters} onClose={() => setShowPreview(false)} thesisTitle={coverPage.uni ? `أطروحة - ${coverPage.student}` : "مسودة الأطروحة"} />}
        <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} query={searchQuery} setQuery={setSearchQuery} results={searchResults} onResultClick={handleSearchResultClick} />
        {notification && <div className="absolute bottom-6 left-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up z-50"><CheckCircle size={18} className="text-green-400" />{notification}</div>}
      </main>
    </div>
  );
};

export default App;