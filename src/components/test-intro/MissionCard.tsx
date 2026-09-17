import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MissionCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColorClass?: string;
  delay?: number;
}

export function MissionCard({
  number,
  title,
  description,
  icon: Icon,
  iconColorClass = "text-[#08BBD5]",
  delay = 0
}: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group flex items-center gap-4 rounded-2xl border border-[#D8E8F0] bg-[#F8FCFE] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BBDCE7] hover:shadow-[0_6px_20px_rgba(11,45,77,0.06)]"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D6E6ED] bg-white shadow-sm ${iconColorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#08AFC8]">
          MISIÓN {number}
        </span>
        <h3 className="mt-0.5 text-sm font-bold text-[#0B2D4D] sm:text-base">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-[#66829A]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
