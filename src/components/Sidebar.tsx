import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Search,
  Layers,
  Mail,
  MessageSquare,
  QrCode,
  BrainCircuit,
  Compass,
  History,
  GraduationCap,
  AlertOctagon,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TabType } from '../types/index.ts';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  totalThreatsNeutralized?: number;
  onOpenChatbot?: () => void;
  isChatbotOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenChatbot,
  isChatbotOpen = false
}) => {
  const navItems: Array<{ id: TabType; label: string; icon: React.ElementType; badge?: string; emergency?: boolean }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'URL Scanner', icon: Search, badge: 'ML' },
    { id: 'bulk', label: 'Bulk Scanner', icon: Layers },
    { id: 'email', label: 'Email Analyzer', icon: Mail },
    { id: 'sms', label: 'SMS / WhatsApp', icon: MessageSquare },
    { id: 'qr', label: 'QR & UPI Scanner', icon: QrCode },
    { id: 'model', label: 'Model Insights', icon: BrainCircuit, badge: '98.4%' },
    { id: 'redirect_map', label: 'Redirect & Map', icon: Compass },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'quiz', label: 'Awareness Quiz', icon: GraduationCap },
    { id: 'emergency', label: 'I Clicked a Link', icon: AlertOctagon, emergency: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white/95 border-r border-slate-200 shadow-sm backdrop-blur-xl transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 border border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.3)] shrink-0 armor-glow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold tracking-wider text-slate-900 text-lg font-mono">
                  KAVACH
                </span>
                <span className="text-[11px] font-semibold text-rose-600 font-sans tracking-tight">
                  कवच
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1 pb-24">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? item.emergency
                    ? 'bg-red-50 text-red-700 border border-red-300 shadow-sm'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm font-semibold'
                  : item.emergency
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? item.emergency
                      ? 'text-red-600'
                      : 'text-rose-600'
                    : item.emergency
                    ? 'text-red-500'
                    : 'text-slate-500 group-hover:text-rose-600'
                }`}
              />

              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-rose-100 text-rose-700 border border-rose-200">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-rose-600 shadow-[0_0_8px_#e11d48]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Emergency Help Badge on Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-2.5 mx-2 mb-2 rounded-xl bg-slate-50 border border-slate-200 shadow-xs shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e]" />
            <span className="text-[11px] font-semibold text-slate-800">CERT-In Aligned</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Cyber Helpline: <span className="text-rose-600 font-bold">1930</span>
          </div>
        </div>
      )}

      {/* Kavacham AI Bot in Sidebar Left-Most Bottom Footer */}
      <div className="p-2 border-t border-slate-200 shrink-0">
        <button
          onClick={onOpenChatbot}
          title={isChatbotOpen ? "Minimize Kavacham AI Bot" : "Open Kavacham AI Bot"}
          className={`w-full flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-rose-400/50 ${
            isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <Shield className="w-4 h-4 text-white animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 border border-rose-700 rounded-full" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left">
                <span className="font-mono tracking-wide text-xs">KAVACHAM BOT</span>
                <span className="text-[9px] text-rose-100 font-sans font-normal -mt-0.5">
                  AI Defense • 24/7 Live
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/20 text-white border border-white/30">
              {isChatbotOpen ? 'ACTIVE' : 'CHAT'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
