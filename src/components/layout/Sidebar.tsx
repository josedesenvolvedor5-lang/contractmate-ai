import { useState } from 'react';
import { FileText, FolderOpen, Upload, Settings, HelpCircle, Home, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'templates', label: 'Modelos', icon: FolderOpen },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'upload', label: 'Novo Upload', icon: Upload },
];

const bottomItems = [
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'help', label: 'Ajuda', icon: HelpCircle },
];

export function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border overflow-hidden"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between px-4 border-b border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-serif text-xl font-semibold text-sidebar-foreground whitespace-nowrap">DocuFill</h1>
                <span className="text-xs text-muted-foreground">AI Automation</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <div className="px-3 py-2">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            {!collapsed && <span className="text-sm flex-1 text-left">Recolher</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-subtle"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t border-sidebar-border px-3 py-2 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.label}
              </button>
            );
          })}
        </div>

        {/* User */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <span className="text-sm font-medium text-muted-foreground">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.email || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">Advogado</p>
                </div>
                <button
                  onClick={signOut}
                  title="Sair"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
