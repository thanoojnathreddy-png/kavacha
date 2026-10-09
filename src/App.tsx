/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/views/DashboardView.tsx';
import { UrlScannerView } from './components/views/UrlScannerView.tsx';
import { BulkScannerView } from './components/views/BulkScannerView.tsx';
import { EmailAnalyzerView } from './components/views/EmailAnalyzerView.tsx';
import { SmsAnalyzerView } from './components/views/SmsAnalyzerView.tsx';
import { QrScannerView } from './components/views/QrScannerView.tsx';
import { ModelInsightsView } from './components/views/ModelInsightsView.tsx';
import { RedirectThreatMapView } from './components/views/RedirectThreatMapView.tsx';
import { HistoryView } from './components/views/HistoryView.tsx';
import { QuizView } from './components/views/QuizView.tsx';
import { EmergencyGuideView } from './components/views/EmergencyGuideView.tsx';
import { SettingsView } from './components/views/SettingsView.tsx';
import { AboutView } from './components/views/AboutView.tsx';
import { KavachamChatbot } from './components/KavachamChatbot.tsx';
import { TabType } from './types/index.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scannerPreloadUrl, setScannerPreloadUrl] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleNavigate = (tab: TabType, targetUrl?: string) => {
    if (targetUrl) {
      setScannerPreloadUrl(targetUrl);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Subtle Background Cyber Grid on Pure White */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none z-0" />

      {/* Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigate(tab)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Sticky Header */}
        <Header
          currentTab={currentTab}
          onQuickScan={() => handleNavigate('scanner')}
          onEmergencyClick={() => handleNavigate('emergency')}
          isCollapsed={isCollapsed}
        />

        {/* View Content Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
          {currentTab === 'scanner' && <UrlScannerView key={scannerPreloadUrl} initialUrl={scannerPreloadUrl} />}
          {currentTab === 'bulk' && <BulkScannerView />}
          {currentTab === 'email' && <EmailAnalyzerView />}
          {currentTab === 'sms' && <SmsAnalyzerView />}
          {currentTab === 'qr' && <QrScannerView />}
          {currentTab === 'model' && <ModelInsightsView />}
          {currentTab === 'redirect_map' && <RedirectThreatMapView />}
          {currentTab === 'history' && <HistoryView onReScan={(url) => handleNavigate('scanner', url)} />}
          {currentTab === 'quiz' && <QuizView />}
          {currentTab === 'emergency' && <EmergencyGuideView />}
          {currentTab === 'settings' && <SettingsView />}
          {currentTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Floating Kavacham Chatbot on Left-Most Bottom */}
      <KavachamChatbot
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}
