import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Award, Zap, BarChart3, LogIn, UserPlus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setError('');
        try {
            const endpoint = isLogin ? 'http://localhost:8000/login' : 'http://localhost:8000/signup';
            const response = await axios.post(endpoint, { email, password });
            if (response.data.error) throw new Error(response.data.error);
            setUser(response.data.user || response.data);
            localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Authentication failed');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setResult(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a resume first.');
            return;
        }

        setLoading(true);
        setResult(null);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jd);

        try {
            const response = await axios.post('http://localhost:8000/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                            Resume AI
                        </h1>
                        <p className="text-slate-400">{isLogin ? 'Welcome back! Please login.' : 'Create an account to start.'}</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-400">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-400">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {authLoading ? <Loader2 className="animate-spin text-white" /> : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}

                    <p className="mt-6 text-center text-slate-400 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-cyan-400 hover:underline font-medium"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-2"
                        >
                            AI Resume Analyzer
                        </motion.h1>
                        <p className="text-slate-400">Welcome, {user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors self-center md:self-auto"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Upload className="text-cyan-400" /> Upload Resume
                        </h2>

                        <div
                            className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-400 transition-colors mb-6 group"
                            onClick={() => document.getElementById('resume-upload').click()}
                        >
                            <input
                                id="resume-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.docx"
                            />
                            <FileText className="w-12 h-12 mx-auto text-slate-500 mb-4 group-hover:text-cyan-400 transition-colors" />
                            <p className="text-slate-300 font-medium">
                                {file ? file.name : 'Click to upload PDF or DOCX'}
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-blue-400" /> Job Description
                        </h2>
                        <textarea
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
                            placeholder="Paste the job description here (optional)..."
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                        />

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                            {loading ? 'Analyzing...' : 'Analyze Now'}
                        </button>
                        {error && <p className="mt-4 text-red-400 flex items-center gap-2 text-sm"><AlertCircle size={16} /> {error}</p>}
                    </motion.div>

                    <div className="flex flex-col gap-6">
                        {!result && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-slate-800 border-dashed rounded-3xl p-12">
                                <BarChart3 size={64} className="mb-4 opacity-20" />
                                <p>Upload and analyze to see results</p>
                            </div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl h-full flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold">Analysis Summary</h2>
                                    <div className="h-16 w-16 rounded-full border-4 border-cyan-500/30 flex items-center justify-center relative">
                                        <span className="text-xl font-bold">{result.ats_score}</span>
                                        <svg className="absolute -rotate-90 w-full h-full">
                                            <circle
                                                cx="32" cy="32" r="28"
                                                fill="transparent"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeDasharray={176}
                                                strokeDashoffset={176 - (176 * result.ats_score) / 100}
                                                className="text-cyan-500 transition-all duration-1000"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-3 flex items-center gap-2">
                                            <Award size={14} className="text-yellow-400" /> Match Percentage
                                        </h3>
                                        <div className="w-full bg-slate-900 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${result.match_percentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-right text-sm mt-1 text-slate-400">{result.match_percentage}% Match</p>
                                    </div>

                                    <div>
                                        <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-3">Professional Summary</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed italic">"{result.summary}"</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={20} /> Detected Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.skills.map((skill, i) => (
                                    <span key={i} className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-sm text-cyan-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="text-orange-400" size={20} /> Improvement Suggestions
                            </h3>
                            <ul className="space-y-4">
                                {result.improvements.map((imp, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-300">
                                        <span className="text-orange-400 mt-1">•</span>
                                        {imp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default App;
