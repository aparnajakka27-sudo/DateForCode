import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';

interface SandpackEditorProps {
  template: 'react' | 'react-ts' | 'vanilla' | 'svelte' | 'vue';
  theme?: string;
}

export default function SandpackEditor({ template, theme = 'dracula' }: SandpackEditorProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-[var(--ide-border)]">
      <Sandpack
        template={template}
        theme={theme as any}
        options={{
          showNavigator: true,
          showLineNumbers: true,
          showInlineErrors: true,
          editorHeight: "100%",
          editorWidthPercentage: 55,
          closableTabs: true,
          resizablePanels: true,
        }}
      />
    </div>
  );
}
