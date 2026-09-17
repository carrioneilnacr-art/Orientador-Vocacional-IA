import { Cpu, Brain, Search, Users, Palette, Briefcase, ClipboardCheck, Wrench } from "lucide-react";
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "@/constants/dimensions";

// Base styling properties shared across all profiles as requested
const defaultColors = {
  iconColor: "#18A86B",
  textColor: "#0B2D4D",
  bgColor: "#EAF8F3",
  borderColor: "#CBEDE6"
};

export const profileData: Record<string, any> = {
  TECH: {
    id: "TECH",
    name: DIMENSION_LABELS["TECH"],
    icon: Cpu,
    description: DIMENSION_DESCRIPTIONS["TECH"],
    ...defaultColors,
  },
  LOGIC: {
    id: "LOGIC",
    name: DIMENSION_LABELS["LOGIC"],
    icon: Brain,
    description: DIMENSION_DESCRIPTIONS["LOGIC"],
    ...defaultColors,
  },
  INVESTIGATIVE: {
    id: "INVESTIGATIVE",
    name: DIMENSION_LABELS["INVESTIGATIVE"],
    icon: Search,
    description: DIMENSION_DESCRIPTIONS["INVESTIGATIVE"],
    ...defaultColors,
  },
  SOCIAL: {
    id: "SOCIAL",
    name: DIMENSION_LABELS["SOCIAL"],
    icon: Users,
    description: DIMENSION_DESCRIPTIONS["SOCIAL"],
    ...defaultColors,
  },
  ARTISTIC: {
    id: "ARTISTIC",
    name: DIMENSION_LABELS["ARTISTIC"],
    icon: Palette,
    description: DIMENSION_DESCRIPTIONS["ARTISTIC"],
    ...defaultColors,
  },
  ENTERPRISING: {
    id: "ENTERPRISING",
    name: DIMENSION_LABELS["ENTERPRISING"],
    icon: Briefcase,
    description: DIMENSION_DESCRIPTIONS["ENTERPRISING"],
    ...defaultColors,
  },
  CONVENTIONAL: {
    id: "CONVENTIONAL",
    name: DIMENSION_LABELS["CONVENTIONAL"],
    icon: ClipboardCheck,
    description: DIMENSION_DESCRIPTIONS["CONVENTIONAL"],
    ...defaultColors,
  },
  REALISTIC: {
    id: "REALISTIC",
    name: DIMENSION_LABELS["REALISTIC"],
    icon: Wrench,
    description: DIMENSION_DESCRIPTIONS["REALISTIC"],
    ...defaultColors,
  }
};
