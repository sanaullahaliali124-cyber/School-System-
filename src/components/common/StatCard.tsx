import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  change,
  changeType = 'positive',
  color = 'indigo',
  onClick,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      glow: 'group-hover:border-indigo-300',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'group-hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'group-hover:border-amber-300',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      glow: 'group-hover:border-rose-300',
    },
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-100',
      glow: 'group-hover:border-sky-300',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'group-hover:border-purple-300',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          <div className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            {value}
          </div>
          {subValue && (
            <p className="text-xs font-medium text-slate-500 mt-1">{subValue}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} shrink-0 transition-transform group-hover:scale-105`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs font-medium">
          {changeType === 'positive' && (
            <span className="inline-flex items-center gap-0.5 text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              {change}
            </span>
          )}
          {changeType === 'negative' && (
            <span className="inline-flex items-center gap-0.5 text-rose-600">
              <TrendingDown className="w-3.5 h-3.5" />
              {change}
            </span>
          )}
          {changeType === 'neutral' && (
            <span className="text-slate-500">{change}</span>
          )}
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
