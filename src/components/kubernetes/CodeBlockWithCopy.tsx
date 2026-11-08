import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface Props {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlockWithCopy({ code, language = 'yaml', filename }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="my-6 rounded-lg border border-border-subtle bg-surface-elevated/70 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-surface">
        <span className="text-[11px] text-text-muted">
          {filename || language.toUpperCase()}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-text-muted" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 overflow-x-auto text-text-primary leading-relaxed font-code select-all">
        <code>{code}</code>
      </pre>
    </div>
  );
}
