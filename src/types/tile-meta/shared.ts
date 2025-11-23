// Canonical shared types/constants for layout/positioning
export type FloatingDirection =
  | "none"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

// Optional runtime-safe constants (useful for serialization/validation)
export const FLOATING_DIRECTIONS = [
  "none",
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;
export type FloatingDirectionConst = (typeof FLOATING_DIRECTIONS)[number];