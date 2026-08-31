import {
  FaAward,
  FaCarSide,
  FaClock,
  FaHandPaper,
  FaLeaf,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import {
  FaDroplet,
  FaHandshake,
  FaMagnifyingGlass,
  FaSoap,
} from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi";
import type { IconType } from "react-icons";

export const WHY_CHOOSE_ICON_KEYS = [
  "hand",
  "search",
  "shield",
  "handshake",
  "car",
  "droplet",
  "sparkle",
  "soap",
  "clock",
  "star",
  "leaf",
  "award",
] as const;

export type WhyChooseIconKey = (typeof WHY_CHOOSE_ICON_KEYS)[number];

export const DEFAULT_WHY_CHOOSE_ICONS: WhyChooseIconKey[] = [
  "hand",
  "search",
  "shield",
  "handshake",
];

export const WHY_CHOOSE_ICON_LABELS: Record<WhyChooseIconKey, string> = {
  hand: "Hand wash",
  search: "Detail",
  shield: "Protection",
  handshake: "Service",
  car: "Vehicle",
  droplet: "Water",
  sparkle: "Shine",
  soap: "Soap",
  clock: "Time",
  star: "Quality",
  leaf: "Eco",
  award: "Premium",
};

const WHY_CHOOSE_ICON_MAP: Record<WhyChooseIconKey, IconType> = {
  hand: FaHandPaper,
  search: FaMagnifyingGlass,
  shield: FaShieldAlt,
  handshake: FaHandshake,
  car: FaCarSide,
  droplet: FaDroplet,
  sparkle: HiSparkles,
  soap: FaSoap,
  clock: FaClock,
  star: FaStar,
  leaf: FaLeaf,
  award: FaAward,
};

export function isWhyChooseIconKey(value: string): value is WhyChooseIconKey {
  return (WHY_CHOOSE_ICON_KEYS as readonly string[]).includes(value);
}

export function getWhyChooseIcon(
  key: string | undefined,
  index: number,
): IconType {
  if (key && isWhyChooseIconKey(key)) {
    return WHY_CHOOSE_ICON_MAP[key];
  }
  return WHY_CHOOSE_ICON_MAP[DEFAULT_WHY_CHOOSE_ICONS[index] ?? "hand"];
}
