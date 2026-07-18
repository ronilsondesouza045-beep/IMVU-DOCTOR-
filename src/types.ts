/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DeviceInfo {
  os: string;
  browser: string;
  language: string;
  timezone: string;
  resolution: string;
  orientation: string;
  deviceMemory: string;
  hardwareConcurrency: number;
  userAgent: string;
  deviceType: string;
  connectionType: string;
  date: string;
  time: string;
}

export interface NetworkTest {
  name: string;
  endpoint: string;
  status: "pending" | "success" | "failed";
  latencyMs?: number;
  errorMessage?: string;
  statusCode?: number;
}

export interface NetworkTestResults {
  navigatorOnline: boolean;
  connectionSpeed?: string;
  tests: NetworkTest[];
}

export interface OCRResult {
  success: boolean;
  title: string;
  errorMessages: string[];
  buttons: string[];
  codes: string[];
  rawText: string;
  isFallback?: boolean;
}

export interface UserAnswers {
  platformUsed: string; // IMVU Desktop, IMVU Mobile, Next, Web, etc.
  issueType: string; // Login, Lag, Disconnects, Loading screen, etc.
  frequency: string; // Constant, Intermittent, First time, etc.
  additionalDetails: string;
}

export interface Hypothesis {
  title: string;
  confidence: "Alta" | "Média" | "Baixa";
  reason: string;
  recommendations: string[];
}

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  deviceInfo: DeviceInfo;
  testResults: NetworkTestResults;
  ocrResult?: OCRResult | null;
  userAnswers: UserAnswers;
  summary: string;
  hypotheses: Hypothesis[];
  limitations: string[];
  isFallback?: boolean;
}

export interface IpReputationResult {
  success: boolean;
  ip: string;
  isp: string;
  country: string;
  countryCode: string;
  city: string;
  isProxy: boolean;
  isHosting: boolean;
  dnsbl: {
    results: {
      name: string;
      host: string;
      desc: string;
      isListed: boolean;
    }[];
    listedCount: number;
  };
  abuseReport?: {
    abuseConfidenceScore: number;
    totalReports: number;
    lastReportedAt: string | null;
  } | null;
  riskScore: number;
  threatLevel: "low" | "medium" | "high" | "critical";
  flags: string[];
  checkedAt: string;
}

