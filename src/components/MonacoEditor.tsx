import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function MonacoEditor({ value, onChange, language, disabled = false }: MonacoEditorProps) {
  const mapLanguage = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'cpp') return 'cpp';
    if (l === 'python') return 'python';
    if (l === 'javascript') return 'javascript';
    if (l === 'typescript') return 'typescript';
    if (l === 'sql') return 'sql';
    if (l === 'nodejs') return 'javascript';
    return 'javascript';
  };

  return (
    <div className="flex-1 h-full w-full min-h-[400px] border border-[var(--ide-border)] rounded-xl overflow-hidden shadow-sm">
      <Editor
        height="100%"
        language={mapLanguage(language)}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          readOnly: disabled,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
