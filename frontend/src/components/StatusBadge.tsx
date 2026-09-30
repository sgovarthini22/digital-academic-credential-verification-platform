import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Clock } from 'lucide-react';

export type CredentialStatus = 'VALID' | 'TAMPERED' | 'REVOKED' | 'NOT_FOUND' | 'EXPIRED' | 'ISSUED';

interface StatusBadgeProps {
  status: CredentialStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const norm = String(status || '').toUpperCase();

  let colorClasses = 'bg-[#edf2f8] text-[#3b506e] border-[#cddaeb]';
  let label = norm;
  let Icon = HelpCircle;

  switch (norm) {
    case 'VALID':
      colorClasses = 'bg-[#eaf4ec] text-[#226835] border-[#cbe5cf]';
      label = 'VALID ✓';
      Icon = CheckCircle2;
      break;
    case 'TAMPERED':
      colorClasses = 'bg-[#fdeeed] text-[#b92c28] border-[#f8cbc8] animate-pulse';
      label = 'TAMPERED !';
      Icon = AlertTriangle;
      break;
    case 'REVOKED':
      colorClasses = 'bg-[#fef4e8] text-[#b25c10] border-[#fae0c2]';
      label = 'REVOKED ✕';
      Icon = XCircle;
      break;
    case 'EXPIRED':
      colorClasses = 'bg-[#fcf7e8] text-[#8e6b12] border-[#f5e9bd]';
      label = 'EXPIRED ⏱';
      Icon = Clock;
      break;
    case 'NOT_FOUND':
      colorClasses = 'bg-[#edf2f8] text-[#4f6686] border-[#cddaeb]';
      label = 'NOT FOUND ?';
      Icon = HelpCircle;
      break;
    case 'ISSUED':
      colorClasses = 'bg-[#ebf3f7] text-[#236488] border-[#cbe0ec]';
      label = 'ISSUED 🗎';
      Icon = CheckCircle2;
      break;
    default:
      break;
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs font-semibold px-3 py-1 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-sans tracking-wide rounded-full border shadow-xs ${sizeClasses} ${colorClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />}
      <span>{label}</span>
    </span>
  );
};
