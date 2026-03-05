import React from 'react';

interface PlaceholderProps {
  hint?: string;
  isValidTarget?: boolean;
  onClick?: () => void;
  'data-pile-id'?: string;
}

export const Placeholder = React.memo(function Placeholder({
  hint,
  isValidTarget = false,
  onClick,
  ...rest
}: PlaceholderProps) {
  return (
    <div
      className={`w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] border-2 border-dashed flex items-center justify-center transition-[border-color,box-shadow,background] duration-200 ${
        isValidTarget
          ? 'border-[#FFC107] shadow-[0_0_12px_rgba(255,193,7,0.4)] bg-[rgba(255,193,7,0.08)] animate-[pulse_1.2s_ease-in-out_infinite]'
          : 'border-white/20 bg-black/[0.04]'
      }`}
      onClick={onClick}
      {...rest}
    >
      {hint && (
        <span
          className="text-white opacity-15 overflow-hidden text-center leading-none"
          style={{ fontSize: hint.length > 1 ? 'var(--card-font-size)' : 'var(--card-center-font-size)' }}
        >
          {hint}
        </span>
      )}
    </div>
  );
});
