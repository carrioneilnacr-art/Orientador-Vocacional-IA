import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface ProfileRevealProps {
  profile: {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
  };
  onContinue: () => void;
}

export function ProfileReveal({ profile, onContinue }: ProfileRevealProps) {
  const Icon = profile.icon;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden w-full"
      style={{
        background: `
          radial-gradient(circle at 50% 15%, rgba(8, 187, 213, 0.10), transparent 35%),
          radial-gradient(circle at 80% 80%, rgba(24, 168, 107, 0.06), transparent 30%),
          #F5FAFD
        `,
      }}
    >
      {/* Background decoration / Confetti particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[12%] left-[25%] w-2 h-2 bg-[#08BBD5] rounded-full opacity-70" />
        <div className="absolute top-[22%] right-[28%] w-3 h-3 bg-[#F4C95D] rounded-sm rotate-45 opacity-70" />
        <div className="absolute top-[35%] left-[32%] w-2.5 h-2.5 bg-[#18A86B] rounded-sm opacity-60" />
        <div className="absolute top-[18%] right-[38%] w-1.5 h-1.5 bg-[#0B2D4D] rounded-full opacity-40" />
        <div className="absolute top-[40%] right-[20%] w-2 h-2 bg-[#08BBD5] rounded-full opacity-60" />
        <div className="absolute top-[28%] left-[15%] w-3 h-3 border border-[#18A86B] rounded-sm rotate-12 opacity-50" />
      </motion.div>

      <div className="w-full max-w-[720px] flex flex-col items-center text-center z-10">
        {/* Chaski */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { delay: 0.25, duration: 0.55 },
            scale: {
              delay: 0.25,
              duration: 0.55,
              type: "spring",
              stiffness: 200,
              damping: 20,
            },
            y: { delay: 0.8, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-[160px] h-[160px] md:w-[210px] md:h-[210px] mb-6"
        >
          <Image
            src="/assets/chaski/resultado-confeti.png"
            alt="Chaski celebrando"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-[26px] md:text-[32px] font-bold text-[#0B2D4D] mb-2"
        >
          ¡Ya tenemos una ruta para ti!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4 }}
          className="text-[15px] md:text-[16px] text-[#466579] mb-6 font-medium"
        >
          Tu perfil principal es:
        </motion.p>

        {/* Profile Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: [1.05, 1] }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="flex items-center gap-3 px-6 py-3.5 md:py-4 rounded-full shadow-sm mb-6 max-w-[330px] w-[calc(100%-32px)] justify-center"
          style={{
            background: `linear-gradient(90deg, ${profile.bgColor}, #F0FAFA)`,
            border: `1px solid ${profile.borderColor}`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: profile.iconColor }} />
          <span
            className="text-[18px] md:text-[20px] font-bold tracking-wide"
            style={{ color: profile.textColor }}
          >
            {profile.name}
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="text-[15px] md:text-[16px] text-[#466579] leading-relaxed max-w-[520px] mb-8"
        >
          {profile.description}
        </motion.p>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          className="flex items-start gap-4 mb-10 max-w-[480px] text-left"
        >
          <span className="text-[44px] leading-[0.8] text-[#08BBD5] opacity-50 font-serif">
            “
          </span>
          <p className="text-[14px] text-[#355B78] italic pt-1">
            El descubrimiento de tu vocación es el primer paso para transformar no solo tu vida, sino el mundo que te rodea.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.4 }}
          onClick={onContinue}
          className="flex items-center justify-center gap-2 font-bold text-white transition-colors w-full max-w-[300px]"
          style={{
            background: "#08BBD5",
            height: "54px",
            borderRadius: "14px",
            fontSize: "16px",
            boxShadow: "0 6px 20px rgba(8,187,213,0.25)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#06A9C1")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#08BBD5")}
        >
          Ver mis resultados
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
