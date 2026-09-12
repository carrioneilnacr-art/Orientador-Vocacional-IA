'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MISSIONS_CONFIG, type MissionInfo } from '@/data/questionnaireData';

interface MissionHeaderProps {
  currentStep: number;
  totalQuestions: number;
  currentMissionNumber: number;
}

export function MissionHeader({
  currentStep,
  totalQuestions,
  currentMissionNumber,
}: MissionHeaderProps) {
  const currentMission =
    MISSIONS_CONFIG.find((m) => m.number === currentMissionNumber) || MISSIONS_CONFIG[0];
  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  return (
    <div className="w-full">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#4F6B85] hover:text-[#082A4A] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-[#F0F5F9]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir al inicio</span>
        </Link>

        {/* Mission pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D6E5EF] shadow-sm">
          <span className="text-base leading-none">{currentMission.icon}</span>
          <span className="text-xs font-bold text-[#082A4A] tracking-wide">
            {currentMission.title}: {currentMission.subtitle}
          </span>
        </div>

        {/* Step counter */}
        <div className="text-right">
          <span className="text-xs sm:text-sm font-bold text-[#082A4A]">
            {currentStep + 1}{' '}
            <span className="font-normal text-[#4F6B85]">/ {totalQuestions}</span>
          </span>
        </div>
      </div>

      {/* Segmented Mission Progress Bar */}
      <div className="grid grid-cols-4 gap-2 w-full mb-8">
        {MISSIONS_CONFIG.map((mission) => {
          // Calculate fill percentage for each mission (4 questions per mission)
          const missionStart = (mission.number - 1) * 4;
          const missionEnd = mission.number * 4 - 1;

          let segmentFill = 0;
          if (currentStep > missionEnd) {
            segmentFill = 100;
          } else if (currentStep < missionStart) {
            segmentFill = 0;
          } else {
            const stepsInMission = currentStep - missionStart + 1;
            segmentFill = (stepsInMission / 4) * 100;
          }

          const isCurrent = mission.number === currentMissionNumber;

          return (
            <div key={mission.number} className="flex flex-col gap-1.5">
              <div className="w-full bg-[#E2EDF4] h-[6px] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00C2E0] transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${segmentFill}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium px-0.5">
                <span
                  className={
                    isCurrent
                      ? 'text-[#00C2E0] font-bold'
                      : segmentFill === 100
                      ? 'text-[#082A4A]'
                      : 'text-[#829AB1]'
                  }
                >
                  M0{mission.number}
                </span>
                <span className="hidden sm:inline text-[#829AB1] text-[10px]">
                  {mission.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
