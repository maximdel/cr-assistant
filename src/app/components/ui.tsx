// Small shared UI pieces, so every page looks the same
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  // default padding, unless the caller sets its own (e.g. p-0 for a table)
  const padding = /(^|\s)p-\d/.test(className) ? '' : 'p-5';
  return (
    <div className={`rounded-xl border border-border bg-surface ${padding} ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{children}</h2>
      {right}
    </div>
  );
}

const buttonStyles = {
  primary: 'bg-primary text-white hover:brightness-110',
  secondary: 'bg-surface-2 text-fg border border-border hover:border-muted',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
  danger: 'text-loss hover:bg-loss/10',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonStyles }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted/70 outline-none focus:border-primary ${className}`}
      {...props}
    />
  );
}

export function Pill({
  children,
  className = 'bg-surface-2 text-muted',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-transparent ${className}`}
    />
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-lg bg-loss/10 px-3 py-2 text-sm text-loss">{children}</p>
  );
}
