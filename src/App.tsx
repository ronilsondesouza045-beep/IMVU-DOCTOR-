/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Activity,
  Wifi,
  WifiOff,
  Clock,
  ShieldCheck,
  Terminal,
  History,
  Image,
  Sparkles
} from "lucide-react";

import { getSavedTheme, applyTheme, ThemeMode } from "./utils/theme";
import { getReportHistory } from "./utils/storage";

// Components
import Dashboard from "./components/Dashboard";
import DiagnosticsRunner from "./components/DiagnosticsRunner";
import ScreenshotAnalyzer from "./components/ScreenshotAnalyzer";
import HistoryManager from "./components/HistoryManager";
import TechnicalMode from "./components/TechnicalMode";

type ViewState = "dashboard" | "diagnostics" | "screenshot" | "history" | "tech";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [view, setView] = useState<ViewState>("dashboard");
  const [savedReportsCount, setSavedReportsCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // 1. Initialize Theme & Watch Connection Status
  useEffect(() => {
    const saved = getSavedTheme();
    setTheme(saved);
    applyTheme(saved);

    // Update reports count
    setSavedReportsCount(getReportHistory().length);

    // Browser Connection triggers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Live Clock timer
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(clockTimer);
    };
  }, []);

  // 2. Toggle dark/light mode
  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const refreshHistoryCount = () => {
    setSavedReportsCount(getReportHistory().length);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-200/50 dark:border-slate-900 bg-white/45 dark:bg-slate-950/45 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo / Title */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => setView("dashboard")}
            id="nav-logo-container"
          >
            <div className="p-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm md:text-base tracking-tight text-slate-900 dark:text-white">
                IMVU <span className="text-blue-600 dark:text-blue-400">DOCTOR AI</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider text-slate-400 ml-1 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-slate-800">
                PRO v1.0
              </span>
            </div>
          </div>

          {/* Center Status Tickers */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-400 font-semibold select-none">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold uppercase">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-red-500 font-bold uppercase animate-pulse">Offline</span>
                </>
              )}
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            {view !== "dashboard" && (
              <button
                onClick={() => setView("dashboard")}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                Início
              </button>
            )}

            {/* Theme switch button */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              aria-label="Alternar tema"
              id="theme-toggler"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">
          
          {/* View Router */}
          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard
                onStartDiagnostics={() => setView("diagnostics")}
                onStartOcr={() => setView("screenshot")}
                onOpenHistory={() => setView("history")}
                onOpenTechMode={() => setView("tech")}
                savedReportsCount={savedReportsCount}
              />
            </motion.div>
          )}

          {view === "diagnostics" && (
            <motion.div
              key="diagnostics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DiagnosticsRunner
                onCancel={() => setView("dashboard")}
                onCompleted={(report) => {
                  refreshHistoryCount();
                  setView("dashboard");
                }}
              />
            </motion.div>
          )}

          {view === "screenshot" && (
            <motion.div
              key="screenshot"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScreenshotAnalyzer
                onCancel={() => setView("dashboard")}
                onCompleted={(report) => {
                  refreshHistoryCount();
                  setView("dashboard");
                }}
              />
            </motion.div>
          )}

          {view === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HistoryManager onCancel={() => setView("dashboard")} />
            </motion.div>
          )}

          {view === "tech" && (
            <motion.div
              key="tech"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TechnicalMode onCancel={() => setView("dashboard")} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-200/50 dark:border-slate-900 py-6 text-center text-xs text-slate-400 select-none bg-white/20 dark:bg-slate-950/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center space-x-1 justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>IMVU Doctor AI Pro v1.0 • Diagnóstico Técnico Avançado</span>
          </p>
          <p className="text-[10px] text-slate-500">
            Aviso: Este utilitário de suporte independente não possui afiliação oficial com a IMVU Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
