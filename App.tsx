import React from 'react';
import { Converter } from './components/Converter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-200 selection:text-brand-900">
      
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="h-10 w-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-200">
               R
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-900 tracking-tight">RevDecoder</h1>
               <p className="text-xs text-slate-500 font-medium">Txt to Zip Utility</p>
             </div>
          </div>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
            Documentation
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Reverse <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-600">Base64</span> Converter
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A secure client-side tool to reconstruct ZIP files from text. We reverse the line order, concatenate, and Base64 decode your files instantly in the browser.
          </p>
        </div>

        <Converter />
        
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} RevDecoder Utility. No data is sent to servers.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;