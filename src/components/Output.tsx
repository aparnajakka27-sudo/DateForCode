import React from 'react';
import { CheckCircle2, XCircle, Loader2, Circle } from 'lucide-react';

interface TestCase {
  input: string;
  expected: string;
}

interface OutputProps {
  testCases: TestCase[];
  results?: (boolean | null)[];
  isExecuting?: boolean;
}

export default function Output({ testCases = [], results = [], isExecuting = false }: OutputProps) {
  return (
    <div className="space-y-2.5">
      {testCases.map((tc, i) => {
        const r = results ? results[i] : null;
        
        let statusText = 'Pending';
        let statusColor = 'border-border-dark/40 text-[var(--text-secondary)]';
        let statusIcon = <Circle className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />;

        if (r === true) {
          statusText = 'Passed';
          statusColor = 'border-emerald-500/30 text-emerald-400 bg-emerald-950/5';
          statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
        } else if (r === false) {
          statusText = 'Failed';
          statusColor = 'border-rose-500/30 text-rose-400 bg-rose-950/5';
          statusIcon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
        } else if (isExecuting) {
          statusText = 'Running';
          statusColor = 'border-amber-500/30 text-amber-400 bg-amber-950/5';
          statusIcon = <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />;
        }

        return (
          <div
            key={i}
            className={`rounded-lg border p-3.5 text-[10px] bg-bg-dark-950/40 transition-all ${statusColor}`}
          >
            <div className="flex items-center justify-between mb-1.5 font-mono">
              <span className="text-[var(--text-muted)] text-[8px] uppercase tracking-wider">
                TEST_CASE_0{i + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-80">{statusText}</span>
                {statusIcon}
              </div>
            </div>
            <p className="overflow-x-auto scrollbar-none font-mono">
              <span className="text-[var(--text-muted)] uppercase tracking-widest text-[8px] mr-1 font-sans">INPUT:</span> {tc.input}
            </p>
            <p className="overflow-x-auto scrollbar-none mt-1 font-mono">
              <span className="text-[var(--text-muted)] uppercase tracking-widest text-[8px] mr-1 font-sans">EXPECTED:</span> {tc.expected}
            </p>
          </div>
        );
      })}
    </div>
  );
}
