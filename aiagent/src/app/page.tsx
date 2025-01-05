// src/app/page.tsx
import Image from "next/image";
import ChatInterface from './components/ChatInterface';
import { Github, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr  p-2 rounded-lg">
                  <Image
                    src="/crustdata.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    priority
                  />
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-sm font-medium bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  API Support
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/SaurabhK24/SupportAgent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-lg 
                         hover:bg-slate-100 flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">View on GitHub</span>
              </a>
              <a
                className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 
                         hover:from-blue-700 hover:to-indigo-700 transition-colors px-4 py-2 rounded-lg
                         shadow-md flex items-center gap-2"
                href="https://crustdata.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Visit Crustdata</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <ChatInterface />
      </main>

      {/* Enhanced Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between text-sm">
          <div className="flex gap-6 flex-wrap items-center justify-center">
            <a
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2
                       hover:bg-slate-100 px-3 py-2 rounded-lg"
              href="https://crustdata.notion.site/Crustdata-Discovery-And-Enrichment-API-c66d5236e8ea40df8af114f6d447ab48"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
              />
              API Documentation
            </a>
            <a
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2
                       hover:bg-slate-100 px-3 py-2 rounded-lg"
              href="https://crustdata.notion.site/Crustdata-Dataset-API-Detailed-Examples-b83bd0f1ec09452bb0c2cac811bba88c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
              />
              Examples
            </a>
          </div>
          <div className="text-center md:text-right text-slate-500">
            <p>© 2025 Crustdata. All rights reserved.</p>
            <p className="text-xs mt-1">Powered by CrustData and ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}