import React, { useState } from 'react';
import { 
  MessageSquare, 
  Code2, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Send 
} from 'lucide-react';

export default function WorkspaceLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dark flex h-screen w-full bg-background text-foreground antialiased overflow-hidden">
      {/* Sidebar Panel */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 ease-in-out border-r border-border bg-panel flex flex-col relative overflow-hidden`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="font-semibold text-sm tracking-wide">Workspace</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-border/50 rounded-md transition-colors"
          >
            <PanelLeftClose className="w-4 h-4 text-muted" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-border/40 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted" />
            <span>Chat Session</span>
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-border/40 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-muted" />
            <span>Code Inspector</span>
          </button>
        </div>

        <div className="p-3 border-t border-border">
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-border/40 flex items-center gap-2 text-muted">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header Bar */}
        <header className="h-14 border-b border-border px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 hover:bg-border/50 rounded-md transition-colors"
              >
                <PanelLeftOpen className="w-4 h-4 text-muted" />
              </button>
            )}
            <h1 className="text-sm font-medium">Dashboard View</h1>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl border border-border bg-panel/50 max-w-3xl">
            <p className="text-sm leading-relaxed">
              Workspace ready. Send a command or prompt to begin generating interface components.
            </p>
          </div>
        </div>

        {/* Floating Bottom Input Bar */}
        <div className="p-4 border-t border-border max-w-4xl w-full mx-auto">
          <div className="relative flex items-center bg-panel border border-border rounded-lg overflow-hidden focus-within:border-muted/50 transition-colors">
            <input 
              type="text" 
              placeholder="Ask a question or request code..."
              className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-muted/60"
            />
            <button className="p-2 mr-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}