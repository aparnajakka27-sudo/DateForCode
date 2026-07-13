import React, { useState } from 'react';
import { File, Plus, Trash2, FolderOpen, Code, FileText, Database } from 'lucide-react';

interface FileItem {
  name: string;
  code: string;
}

interface FileExplorerProps {
  files: Record<string, { code: string }>;
  activeFile: string;
  onActiveFileChange: (fileName: string) => void;
  onFileCreate: (fileName: string) => void;
  onFileDelete: (fileName: string) => void;
}

export default function FileExplorer({
  files,
  activeFile,
  onActiveFileChange,
  onFileCreate,
  onFileDelete,
}: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    
    // Normalize path starting with /
    let normalized = newFileName.trim();
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    
    onFileCreate(normalized);
    setNewFileName('');
    setShowInput(false);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html':
        return <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      case 'css':
        return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'js':
      case 'jsx':
        return <Code className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
      case 'ts':
      case 'tsx':
        return <Code className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'json':
        return <File className="w-3.5 h-3.5 text-gray-400 shrink-0" />;
      case 'sql':
        return <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <File className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
    }
  };

  return (
    <div className="w-[150px] h-full border-r border-border-dark/50 bg-[var(--ide-bg)]/80 flex flex-col shrink-0 font-mono select-none">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border-dark/50 flex items-center justify-between text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <FolderOpen className="w-3 h-3 text-[var(--text-muted)]" /> Workspace
        </span>
        <button
          onClick={() => setShowInput(!showInput)}
          className="hover:text-[var(--text-primary)] transition"
          title="Create new file"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New file input form */}
      {showInput && (
        <form onSubmit={handleCreate} className="p-2 border-b border-border-dark/50">
          <input
            autoFocus
            type="text"
            placeholder="App.jsx, index.css"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full bg-[var(--background)] border border-[var(--ide-border)] rounded px-1.5 py-1 text-[10px] text-white focus:outline-none focus:border-[#FF3366]"
          />
        </form>
      )}

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {Object.keys(files).map((fileName) => {
          const isActive = fileName === activeFile;
          // Don't allow deleting core entry files like App.jsx, index.js, index.html, package.json
          const isDeletable = !['/App.jsx', '/index.js', '/index.html', '/package.json'].includes(fileName);

          return (
            <div
              key={fileName}
              onClick={() => onActiveFileChange(fileName)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition text-[10px] ${
                isActive
                  ? 'bg-[#FF3366]/10 text-white font-bold border-l-2 border-[#FF3366]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--ide-header-bg)] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(fileName)}
                <span className="truncate">{fileName.startsWith('/') ? fileName.slice(1) : fileName}</span>
              </div>
              {isDeletable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileDelete(fileName);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition p-0.5"
                  title="Delete file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TabsProps {
  files: string[];
  activeFile: string;
  onActiveFileChange: (fileName: string) => void;
  onCloseTab?: (fileName: string) => void;
}

export function FileTabs({ files, activeFile, onActiveFileChange, onCloseTab }: TabsProps) {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html':
        return <FileText className="w-3 h-3 text-orange-500 shrink-0" />;
      case 'css':
        return <FileText className="w-3 h-3 text-blue-400 shrink-0" />;
      case 'js':
      case 'jsx':
        return <Code className="w-3 h-3 text-yellow-400 shrink-0" />;
      case 'ts':
      case 'tsx':
        return <Code className="w-3 h-3 text-blue-500 shrink-0" />;
      case 'json':
        return <File className="w-3.5 h-3.5 text-gray-400 shrink-0" />;
      case 'sql':
        return <Database className="w-3 h-3 text-emerald-400 shrink-0" />;
      default:
        return <File className="w-3 h-3 text-slate-300 shrink-0" />;
    }
  };

  return (
    <div className="flex items-center bg-[var(--background)] border-b border-border-dark/50 overflow-x-auto scrollbar-none select-none">
      {files.map((fileName) => {
        const isActive = fileName === activeFile;
        return (
          <div
            key={fileName}
            onClick={() => onActiveFileChange(fileName)}
            className={`flex items-center gap-1.5 px-4 py-2 border-r border-border-dark/50 cursor-pointer font-mono text-[10px] transition shrink-0 ${
              isActive
                ? 'bg-[var(--ide-bg)] text-white font-bold border-t-2 border-t-[#FF3366]'
                : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--ide-header-bg)]/40'
            }`}
          >
            {getFileIcon(fileName)}
            <span>{fileName.startsWith('/') ? fileName.slice(1) : fileName}</span>
          </div>
        );
      })}
    </div>
  );
}
