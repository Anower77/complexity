import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function KnowledgeCheck({ question, options, correctIndex, explanation }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIndex(idx);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className="my-8 rounded-lg border border-border-subtle bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-mono text-brand font-semibold">
          <HelpCircle className="w-4 h-4" />
          <span>KNOWLEDGE CHECK</span>
        </div>
        {isSubmitted && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <h3 className="font-technical text-sm font-semibold text-text-primary mb-4 leading-snug">
        {question}
      </h3>

      <div className="space-y-2">
        {options.map((option, idx) => {
          let optionStyles = 'border-border-subtle hover:border-border-strong bg-surface hover:bg-surface-elevated text-text-secondary';

          if (isSubmitted) {
            if (idx === correctIndex) {
              optionStyles = 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 font-medium';
            } else if (idx === selectedIndex) {
              optionStyles = 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300';
            } else {
              optionStyles = 'border-border-subtle opacity-50 text-text-muted';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-3.5 py-2.5 rounded-md border text-xs font-technical transition-all flex items-start gap-2.5 ${optionStyles}`}
            >
              <span className="font-mono text-[11px] font-semibold opacity-70 mt-0.5">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="flex-1">{option}</span>
              {isSubmitted && idx === correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              {isSubmitted && idx === selectedIndex && idx !== correctIndex && (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className={`mt-4 p-3.5 rounded-md border text-xs leading-relaxed ${
          isCorrect
            ? 'bg-green-500/5 border-green-500/20 text-green-800 dark:text-green-200'
            : 'bg-red-500/5 border-red-500/20 text-red-800 dark:text-red-200'
        }`}>
          <div className="font-semibold font-mono text-[11px] mb-1">
            {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
          </div>
          <p className="text-text-secondary">{explanation}</p>
        </div>
      )}
    </div>
  );
}
