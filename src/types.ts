/**
 * Types and interfaces for the Website 3D Video Animator application.
 */

export type PresetName = 'scroll' | 'orbit' | 'zoom' | 'wobble' | 'reveal' | 'manual';
export type VideoRatio = '16:9' | '9:16' | '1:1';
export type BrowserTheme = 'dark' | 'light' | 'none';

export interface AnimationSettings {
  preset: PresetName;
  duration: number; // 3 to 30 seconds
  ratio: VideoRatio;
  browserTheme: BrowserTheme;
  bgGradientStart: string;
  bgGradientEnd: string;
  showGrid: boolean;
  gridColor: string;
  glowColor: string;
  glowIntensity: number;
  cameraDistance: number;
  cameraPitch: number; // inclination angle
  cameraRoll: number;
  animationSpeed: number;
  textOverlay: string;
  textSubtitle: string;
  textColor: string;
  deviceScale: number; // size of mockup
  curveAmount: number; // subtle physical curve
}

export interface AIAnalysis {
  tagline: string;
  subtitle: string;
  bgStart: string;
  bgEnd: string;
  glow: string;
  recommendedPreset: PresetName;
  critique: string;
  brandColors: string[];
}
