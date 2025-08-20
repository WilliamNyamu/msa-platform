import { useState, useRef, useCallback, useMemo } from 'react';
import { 
    Bold, 
    Italic, 
    List, 
    Link as LinkIcon, 
    Code, 
    Eye, 
    Edit3,
    Quote,
    Image as ImageIcon,
    Heading,
    ListOrdered,
    Strikethrough,
    Table,
    Minus,
    CheckSquare,
    Hash,
    AlignLeft,
    AlignCenter,
    AlignRight,
    FileText,
    Download,
    Upload,
    Copy,
    Scissors,
    RotateCcw,
    RotateCw,
    Search,
    Replace,
    Maximize2,
    Minimize2,
    Moon,
    Sun,
    Palette,
    Zap,
    Bookmark,
    Save,
    Paperclip,
    Type,
    Code2
} from 'lucide-react';

export default function MarkdownEditor({ 
    value, 
    onChange, 
    placeholder = "Write your content here using Markdown...",
    className = "",
    rows = 15,
    onSave,
    autoSave = false,
    enableAdvancedFeatures = true
}) {
    const [activeTab, setActiveTab] = useState('write');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showFindReplace, setShowFindReplace] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [history, setHistory] = useState([value]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedTheme, setSelectedTheme] = useState('default');
    const textareaRef = useRef(null);
    const findInputRef = useRef(null);

    // Calculate word and character count
    const updateCounts = useCallback((text) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        setWordCount(words);
        setCharCount(chars);
    }, []);

    // Enhanced history management
    const addToHistory = useCallback((newValue) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newValue);
        if (newHistory.length > 50) { // Limit history to 50 entries
            newHistory.shift();
        } else {
            setHistoryIndex(historyIndex + 1);
        }
        setHistory(newHistory);
    }, [history, historyIndex]);

    // Handle undo/redo
    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            onChange({ target: { value: history[newIndex] } });
        }
    }, [historyIndex, history, onChange]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            onChange({ target: { value: history[newIndex] } });
        }
    }, [historyIndex, history, onChange]);

    // Enhanced onChange handler
    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        onChange(e);
        updateCounts(newValue);
        
        // Add to history for undo/redo
        if (newValue !== history[historyIndex]) {
            addToHistory(newValue);
        }
        
        // Auto-save functionality
        if (autoSave && onSave) {
            const timeoutId = setTimeout(() => onSave(newValue), 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [onChange, updateCounts, history, historyIndex, addToHistory, autoSave, onSave]);

    // Function to insert markdown syntax at cursor position
    const insertMarkdown = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        
        const newText = value.substring(0, start) + 
                       before + selectedText + after + 
                       value.substring(end);
        
        onChange({ target: { value: newText } });
        
        // Reset cursor position
        setTimeout(() => {
            textarea.focus();
            const newPosition = start + before.length + selectedText.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    // Function to render markdown as HTML (enhanced implementation)
    const renderMarkdown = useCallback((text) => {
        return text
            // Enhanced headers with anchors
            .replace(/^### (.*$)/gim, '<h3 id="$1" class="text-lg font-semibold text-slate-800 mt-6 mb-3 border-b border-slate-200 pb-1 hover:text-blue-600 cursor-pointer">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 id="$1" class="text-xl font-bold text-slate-800 mt-8 mb-4 border-b-2 border-slate-300 pb-2 hover:text-blue-600 cursor-pointer">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 id="$1" class="text-2xl font-bold text-slate-900 mt-10 mb-6 border-b-2 border-slate-400 pb-3 hover:text-blue-600 cursor-pointer">$1</h1>')
            // Enhanced text formatting
            .replace(/~~(.*?)~~/g, '<del class="line-through text-slate-500 opacity-75">$1</del>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 bg-yellow-100 px-1 rounded">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700 font-medium">$1</em>')
            .replace(/==(.*?)==/g, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
            .replace(/\^(.*?)\^/g, '<sup class="text-xs text-slate-600">$1</sup>')
            .replace(/~(.*?)~/g, '<sub class="text-xs text-slate-600">$1</sub>')
            .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono shadow-inner">$1</code>')
            // Enhanced blockquotes with types
            .replace(/^\> \[!NOTE\] (.*$)/gim, '<div class="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 rounded-r-lg"><div class="flex items-center gap-2 mb-2"><span class="text-blue-600 font-semibold">📝 NOTE</span></div><p class="text-slate-700">$1</p></div>')
            .replace(/^\> \[!WARNING\] (.*$)/gim, '<div class="border-l-4 border-yellow-500 bg-yellow-50 p-4 my-4 rounded-r-lg"><div class="flex items-center gap-2 mb-2"><span class="text-yellow-600 font-semibold">⚠️ WARNING</span></div><p class="text-slate-700">$1</p></div>')
            .replace(/^\> \[!TIP\] (.*$)/gim, '<div class="border-l-4 border-green-500 bg-green-50 p-4 my-4 rounded-r-lg"><div class="flex items-center gap-2 mb-2"><span class="text-green-600 font-semibold">💡 TIP</span></div><p class="text-slate-700">$1</p></div>')
            .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 text-slate-700 italic rounded-r-lg shadow-sm">$1</blockquote>')
            // Enhanced lists with better styling
            .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc text-slate-700 leading-relaxed py-1 hover:bg-slate-50 px-2 rounded transition-colors">$1</li>')
            .replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc text-slate-700 leading-relaxed py-1 hover:bg-slate-50 px-2 rounded transition-colors">$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-slate-700 leading-relaxed py-1 hover:bg-slate-50 px-2 rounded transition-colors">$1</li>')
            .replace(/(<li class="ml-6 list-disc.*?<\/li>)+/gs, '<ul class="space-y-1 my-4 bg-white p-2 rounded-lg border border-slate-100">$&</ul>')
            .replace(/(<li class="ml-6 list-decimal.*?<\/li>)+/gs, '<ol class="space-y-1 my-4 bg-white p-2 rounded-lg border border-slate-100">$&</ol>')
            // Enhanced checkboxes
            .replace(/^\- \[x\] (.*$)/gim, '<li class="flex items-center gap-3 text-slate-700 py-2 px-3 bg-green-50 rounded-lg border border-green-200"><input type="checkbox" checked disabled class="rounded text-green-600 focus:ring-green-500"> <span class="line-through opacity-75">$1</span></li>')
            .replace(/^\- \[ \] (.*$)/gim, '<li class="flex items-center gap-3 text-slate-700 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200"><input type="checkbox" disabled class="rounded text-gray-400"> <span>$1</span></li>')
            // Enhanced links and images
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-6"><img src="$2" alt="$1" class="max-w-full h-auto rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"><p class="text-center text-sm text-slate-500 mt-2 italic">$1</p></div>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:bg-blue-50 px-1 py-0.5 rounded transition-colors">$1 🔗</a>')
            // Enhanced horizontal rule
            .replace(/^---$/gm, '<hr class="border-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent my-8">')
            // Enhanced tables
            .replace(/\|(.+)\|/g, '<table class="w-full border-collapse border border-slate-300 my-6 rounded-lg overflow-hidden shadow-sm"><thead class="bg-slate-100"><tr class="border-b border-slate-200">$1</tr></thead></table>')
            // Code blocks with syntax highlighting simulation
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="my-6"><div class="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-semibold rounded-t-lg border-b border-slate-700">$1</div><pre class="bg-slate-900 text-green-400 p-6 rounded-b-lg overflow-x-auto font-mono text-sm border border-slate-700"><code>$2</code></pre></div>')
            // Enhanced line breaks and paragraphs
            .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-slate-700">')
            .replace(/\n/g, '<br>');
    }, []);

    // Find and replace functionality
    const findAndReplace = useCallback(() => {
        if (!findText) return;
        
        const newValue = value.replace(new RegExp(findText, 'g'), replaceText);
        onChange({ target: { value: newValue } });
        setShowFindReplace(false);
        setFindText('');
        setReplaceText('');
    }, [value, findText, replaceText, onChange]);

    // Export functionality
    const exportMarkdown = useCallback(() => {
        const blob = new Blob([value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    }, [value]);

    // Import functionality
    const importMarkdown = useCallback((event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/markdown') {
            const reader = new FileReader();
            reader.onload = (e) => {
                onChange({ target: { value: e.target.result } });
            };
            reader.readAsText(file);
        }
    }, [onChange]);

    // Copy to clipboard
    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(value).then(() => {
            // Could add a toast notification here
            console.log('Copied to clipboard');
        });
    }, [value]);

    // Theme configurations
    const themes = {
        default: {
            bg: 'bg-white/80',
            border: 'border-blue-100',
            text: 'text-slate-800'
        },
        dark: {
            bg: 'bg-slate-800/90',
            border: 'border-slate-600',
            text: 'text-slate-100'
        },
        minimal: {
            bg: 'bg-gray-50/80',
            border: 'border-gray-200',
            text: 'text-gray-800'
        },
        vibrant: {
            bg: 'bg-gradient-to-br from-purple-50/80 to-pink-50/80',
            border: 'border-purple-200',
            text: 'text-purple-900'
        }
    };

    const currentTheme = themes[selectedTheme] || themes.default;

    const toolbarButtons = useMemo(() => [
        // Basic formatting
        {
            icon: Bold,
            title: 'Bold',
            action: () => insertMarkdown('**', '**'),
            shortcut: 'Ctrl+B',
            category: 'format'
        },
        {
            icon: Italic,
            title: 'Italic',
            action: () => insertMarkdown('*', '*'),
            shortcut: 'Ctrl+I',
            category: 'format'
        },
        {
            icon: Strikethrough,
            title: 'Strikethrough',
            action: () => insertMarkdown('~~', '~~'),
            shortcut: 'Ctrl+Shift+S',
            category: 'format'
        },
        {
            icon: Type,
            title: 'Highlight',
            action: () => insertMarkdown('==', '=='),
            shortcut: 'Ctrl+H',
            category: 'format'
        },
        {
            icon: Code,
            title: 'Inline Code',
            action: () => insertMarkdown('`', '`'),
            shortcut: 'Ctrl+`',
            category: 'format'
        },
        {
            type: 'divider'
        },
        // Headers
        {
            icon: Heading,
            title: 'Heading 1',
            action: () => insertMarkdown('\n# ', ''),
            text: 'H1',
            category: 'structure'
        },
        {
            icon: Heading,
            title: 'Heading 2',
            action: () => insertMarkdown('\n## ', ''),
            text: 'H2',
            category: 'structure'
        },
        {
            icon: Heading,
            title: 'Heading 3',
            action: () => insertMarkdown('\n### ', ''),
            text: 'H3',
            category: 'structure'
        },
        {
            type: 'divider'
        },
        // Lists and structure
        {
            icon: List,
            title: 'Bullet List',
            action: () => insertMarkdown('\n- ', ''),
            shortcut: 'Ctrl+L',
            category: 'structure'
        },
        {
            icon: ListOrdered,
            title: 'Numbered List',
            action: () => insertMarkdown('\n1. ', ''),
            shortcut: 'Ctrl+Shift+L',
            category: 'structure'
        },
        {
            icon: CheckSquare,
            title: 'Task List',
            action: () => insertMarkdown('\n- [ ] ', ''),
            shortcut: 'Ctrl+Shift+C',
            category: 'structure'
        },
        {
            type: 'divider'
        },
        // Content blocks
        {
            icon: Quote,
            title: 'Quote',
            action: () => insertMarkdown('\n> ', ''),
            shortcut: 'Ctrl+Q',
            category: 'content'
        },
        {
            icon: Code2,
            title: 'Code Block',
            action: () => insertMarkdown('\n```\n', '\n```\n'),
            shortcut: 'Ctrl+Shift+`',
            category: 'content'
        },
        {
            icon: Minus,
            title: 'Horizontal Rule',
            action: () => insertMarkdown('\n---\n', ''),
            shortcut: 'Ctrl+R',
            category: 'content'
        },
        {
            type: 'divider'
        },
        // Media and links
        {
            icon: LinkIcon,
            title: 'Link',
            action: () => insertMarkdown('[', '](url)'),
            shortcut: 'Ctrl+K',
            category: 'media'
        },
        {
            icon: ImageIcon,
            title: 'Image',
            action: () => insertMarkdown('![Alt text](', ')'),
            shortcut: 'Ctrl+Shift+I',
            category: 'media'
        },
        {
            icon: Table,
            title: 'Table',
            action: () => insertMarkdown('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', ''),
            shortcut: 'Ctrl+T',
            category: 'structure'
        },
        {
            type: 'divider'
        },
        // Special callouts
        {
            icon: Bookmark,
            title: 'Note Callout',
            action: () => insertMarkdown('\n> [!NOTE] ', ''),
            category: 'callout'
        },
        {
            icon: Zap,
            title: 'Warning Callout',
            action: () => insertMarkdown('\n> [!WARNING] ', ''),
            category: 'callout'
        },
        {
            icon: Paperclip,
            title: 'Tip Callout',
            action: () => insertMarkdown('\n> [!TIP] ', ''),
            category: 'callout'
        }
    ], []);

    // Advanced toolbar for enhanced features
    const advancedButtons = useMemo(() => [
        {
            icon: Save,
            title: 'Save',
            action: () => onSave && onSave(value),
            disabled: !onSave
        },
        {
            icon: Download,
            title: 'Export Markdown',
            action: exportMarkdown
        },
        {
            icon: Upload,
            title: 'Import Markdown',
            action: () => document.getElementById('md-import').click()
        },
        {
            icon: Copy,
            title: 'Copy to Clipboard',
            action: copyToClipboard
        },
        {
            type: 'divider'
        },
        {
            icon: RotateCcw,
            title: 'Undo',
            action: undo,
            shortcut: 'Ctrl+Z',
            disabled: historyIndex <= 0
        },
        {
            icon: RotateCw,
            title: 'Redo',
            action: redo,
            shortcut: 'Ctrl+Y',
            disabled: historyIndex >= history.length - 1
        },
        {
            type: 'divider'
        },
        {
            icon: Search,
            title: 'Find & Replace',
            action: () => setShowFindReplace(!showFindReplace),
            shortcut: 'Ctrl+F'
        },
        {
            icon: isFullscreen ? Minimize2 : Maximize2,
            title: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
            action: () => setIsFullscreen(!isFullscreen),
            shortcut: 'F11'
        },
        {
            icon: isDarkMode ? Sun : Moon,
            title: isDarkMode ? 'Light Mode' : 'Dark Mode',
            action: () => setIsDarkMode(!isDarkMode)
        }
    ], [onSave, value, exportMarkdown, copyToClipboard, undo, redo, historyIndex, history.length, isFullscreen, isDarkMode, showFindReplace]);

    // Initialize counts on mount
    useState(() => {
        updateCounts(value);
    });

    // Enhanced keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    insertMarkdown('**', '**');
                    break;
                case 'i':
                    e.preventDefault();
                    insertMarkdown('*', '*');
                    break;
                case '`':
                    if (e.shiftKey) {
                        e.preventDefault();
                        insertMarkdown('\n```\n', '\n```\n');
                    } else {
                        e.preventDefault();
                        insertMarkdown('`', '`');
                    }
                    break;
                case 'l':
                    if (e.shiftKey) {
                        e.preventDefault();
                        insertMarkdown('\n1. ', '');
                    } else {
                        e.preventDefault();
                        insertMarkdown('\n- ', '');
                    }
                    break;
                case 'q':
                    e.preventDefault();
                    insertMarkdown('\n> ', '');
                    break;
                case 'k':
                    e.preventDefault();
                    insertMarkdown('[', '](url)');
                    break;
                case 'h':
                    e.preventDefault();
                    insertMarkdown('==', '==');
                    break;
                case 'r':
                    e.preventDefault();
                    insertMarkdown('\n---\n', '');
                    break;
                case 't':
                    e.preventDefault();
                    insertMarkdown('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', '');
                    break;
                case 's':
                    if (e.shiftKey) {
                        e.preventDefault();
                        insertMarkdown('~~', '~~');
                    }
                    break;
                case 'c':
                    if (e.shiftKey) {
                        e.preventDefault();
                        insertMarkdown('\n- [ ] ', '');
                    }
                    break;
                case 'z':
                    if (!e.shiftKey) {
                        e.preventDefault();
                        undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    redo();
                    break;
                case 'f':
                    e.preventDefault();
                    setShowFindReplace(true);
                    setTimeout(() => findInputRef.current?.focus(), 0);
                    break;
            }
        }
        
        // F11 for fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
        }
    }, [insertMarkdown, undo, redo, isFullscreen]);

    return (
        <div className={`${currentTheme.bg} backdrop-blur-sm rounded-2xl p-6 border ${currentTheme.border} shadow-xl transition-all duration-300 ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
        } ${className}`}>
            {/* Hidden file input for import */}
            <input
                id="md-import"
                type="file"
                accept=".md,.markdown"
                onChange={importMarkdown}
                className="hidden"
            />

            {/* Header with enhanced controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl flex items-center justify-center shadow-lg">
                        <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold ${currentTheme.text}`}>
                            Enhanced Markdown Editor
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{wordCount} words</span>
                            <span>{charCount} characters</span>
                            {autoSave && <span className="text-green-600">Auto-save enabled</span>}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Theme Selector */}
                    <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="default">Default</option>
                        <option value="dark">Dark</option>
                        <option value="minimal">Minimal</option>
                        <option value="vibrant">Vibrant</option>
                    </select>

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('write')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                activeTab === 'write' 
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            <Edit3 className="w-4 h-4" />
                            Write
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                activeTab === 'preview' 
                                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced Toolbar */}
            {enableAdvancedFeatures && (
                <div className="flex items-center gap-1 p-3 bg-gray-100 rounded-lg mb-4 border overflow-x-auto">
                    {advancedButtons.map((button, index) => {
                        if (button.type === 'divider') {
                            return <div key={index} className="w-px bg-gray-300 mx-2 h-6" />;
                        }

                        const Icon = button.icon;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={button.action}
                                disabled={button.disabled}
                                className={`flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 whitespace-nowrap ${
                                    button.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                }`}
                                title={`${button.title}${button.shortcut ? ` (${button.shortcut})` : ''}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline text-xs">{button.title}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Toolbar */}
            {activeTab === 'write' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    {/* Format Tools */}
                    <div className="bg-white/70 rounded-lg p-3 border">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Format</h4>
                        <div className="flex flex-wrap gap-1">
                            {toolbarButtons.filter(btn => btn.category === 'format').map((button, index) => {
                                const Icon = button.icon;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={button.action}
                                        className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                        title={`${button.title}${button.shortcut ? ` (${button.shortcut})` : ''}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Structure Tools */}
                    <div className="bg-white/70 rounded-lg p-3 border">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Structure</h4>
                        <div className="flex flex-wrap gap-1">
                            {toolbarButtons.filter(btn => btn.category === 'structure').map((button, index) => {
                                const Icon = button.icon;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={button.action}
                                        className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                                        title={`${button.title}${button.shortcut ? ` (${button.shortcut})` : ''}`}
                                    >
                                        {button.text ? (
                                            <span className="text-xs font-bold">{button.text}</span>
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Tools */}
                    <div className="bg-white/70 rounded-lg p-3 border">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Content</h4>
                        <div className="flex flex-wrap gap-1">
                            {toolbarButtons.filter(btn => btn.category === 'content' || btn.category === 'media').map((button, index) => {
                                const Icon = button.icon;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={button.action}
                                        className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-110"
                                        title={`${button.title}${button.shortcut ? ` (${button.shortcut})` : ''}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Callout Tools */}
                    <div className="bg-white/70 rounded-lg p-3 border">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Callouts</h4>
                        <div className="flex flex-wrap gap-1">
                            {toolbarButtons.filter(btn => btn.category === 'callout').map((button, index) => {
                                const Icon = button.icon;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={button.action}
                                        className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-110"
                                        title={button.title}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Find and Replace Panel */}
            {showFindReplace && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <input
                                ref={findInputRef}
                                type="text"
                                value={findText}
                                onChange={(e) => setFindText(e.target.value)}
                                placeholder="Find..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={replaceText}
                                onChange={(e) => setReplaceText(e.target.value)}
                                placeholder="Replace with..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={findAndReplace}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Replace All
                        </button>
                        <button
                            onClick={() => setShowFindReplace(false)}
                            className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Editor/Preview Content */}
            <div className={`${isFullscreen ? 'h-screen' : 'min-h-[500px]'} transition-all duration-300`}>
                {activeTab === 'write' ? (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={`${placeholder}

🚀 Enhanced Markdown Features:

## Basic Formatting
**Bold text** or *italic text*
~~Strikethrough~~ or ==highlighted text==
\`inline code\` or \`\`\`code blocks\`\`\`

## Structure
# Heading 1
## Heading 2
### Heading 3

- Bullet lists
1. Numbered lists
- [ ] Task lists
- [x] Completed tasks

## Content Blocks
> Regular quotes
> [!NOTE] Important notes
> [!WARNING] Warning callouts
> [!TIP] Helpful tips

## Media & Links
[Link text](https://example.com)
![Image description](image-url)

| Table | Headers |
|-------|---------|
| Data  | Here    |

---
Horizontal rules

## Advanced Features
- Drag & drop file import
- Auto-save functionality
- Find & replace (Ctrl+F)
- Undo/redo (Ctrl+Z/Y)
- Export to markdown
- Multiple themes
- Fullscreen mode (F11)
- Live preview`}
                        rows={isFullscreen ? 50 : rows}
                        className={`w-full ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} border border-gray-300 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed shadow-inner`}
                        style={{
                            lineHeight: '1.7',
                            tabSize: '2'
                        }}
                        required
                    />
                ) : (
                    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} border border-gray-300 rounded-xl p-6 overflow-auto shadow-inner ${isFullscreen ? 'h-full' : 'min-h-[500px]'}`}>
                        <div 
                            className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : ''} prose-headings:scroll-mt-4 prose-headings:cursor-pointer prose-a:break-words prose-img:rounded-xl prose-img:shadow-lg`}
                            dangerouslySetInnerHTML={{ 
                                __html: value ? renderMarkdown(value) : '<div class="text-gray-400 text-center py-20"><h3>Preview will appear here...</h3><p>Start typing in the editor to see your markdown rendered beautifully.</p></div>' 
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Enhanced Footer with Statistics and Quick Help */}
            {!isFullscreen && (
                <div className="mt-6 space-y-4">
                    {/* Statistics Bar */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span><strong>{wordCount}</strong> words</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4" />
                                <span><strong>{charCount}</strong> characters</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bookmark className="w-4 h-4" />
                                <span><strong>{value.split('\n').length}</strong> lines</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            {autoSave && (
                                <div className="flex items-center gap-1 text-green-600">
                                    <Save className="w-3 h-3" />
                                    <span>Auto-save</span>
                                </div>
                            )}
                            <span>Last updated: {new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>

                    {/* Quick Reference */}
                    {activeTab === 'write' && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                        ⚡ Quick Reference & Pro Tips
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-blue-800">
                                        <div className="space-y-1">
                                            <p><strong>Text Formatting:</strong></p>
                                            <p>**bold**, *italic*, ~~strike~~, ==highlight==</p>
                                            <p>`code`, ^super^, ~sub~</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p><strong>Structure:</strong></p>
                                            <p># H1, ## H2, ### H3</p>
                                            <p>- bullets, 1. numbers, - [ ] tasks</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p><strong>Special Callouts:</strong></p>
                                            <p>&gt; [!NOTE] Blue note boxes</p>
                                            <p>&gt; [!WARNING] Yellow warnings</p>
                                            <p>&gt; [!TIP] Green tip boxes</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                        <p className="text-xs text-blue-700">
                                            <strong>Keyboard Shortcuts:</strong> 
                                            Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link), Ctrl+F (find), Ctrl+Z/Y (undo/redo), F11 (fullscreen)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
