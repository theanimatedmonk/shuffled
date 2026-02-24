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
      className={`placeholder ${isValidTarget ? 'placeholder--valid-target' : ''}`}
      onClick={onClick}
      {...rest}
    >
      {hint && <span className="placeholder__hint">{hint}</span>}
    </div>
  );
});
