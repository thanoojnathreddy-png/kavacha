/**
 * KAVACH - Python ML Subprocess Bridge
 * Spawns the trained scikit-learn models asynchronously for URL, SMS, and Email inference.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';

export interface MLUrlResult {
  url: string;
  ml_probability: number;
  risk_score: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  category: 'Benign' | 'Phishing' | 'Malware' | 'Defacement';
}

export interface MLSmsResult {
  text: string;
  ml_probability: number;
  risk_score: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
}

export interface MLEmailResult {
  text: string;
  ml_probability: number;
  risk_score: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
}

const PREDICT_SCRIPT = path.join(process.cwd(), 'ml', 'predict.py');

function runPythonPredict(type: 'url' | 'sms' | 'email', input: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [PREDICT_SCRIPT, type, input]);
    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (d) => { stdout += d.toString(); });
    py.stderr.on('data', (d) => { stderr += d.toString(); });

    py.on('close', (code) => {
      if (code === 0 && stdout.trim()) {
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch (e: any) {
          reject(new Error(`Failed to parse ML output: ${stdout}`));
        }
      } else {
        reject(new Error(`Python inference exited with code ${code}: ${stderr || stdout}`));
      }
    });

    py.on('error', (err) => {
      reject(err);
    });
  });
}

export async function predictUrlML(url: string): Promise<MLUrlResult | null> {
  try {
    return await runPythonPredict('url', url);
  } catch (err: any) {
    console.warn('URL ML inference fallback to TypeScript engine:', err.message);
    return null;
  }
}

export async function predictSmsML(text: string): Promise<MLSmsResult | null> {
  try {
    return await runPythonPredict('sms', text);
  } catch (err: any) {
    console.warn('SMS ML inference fallback:', err.message);
    return null;
  }
}

export async function predictEmailML(text: string): Promise<MLEmailResult | null> {
  try {
    return await runPythonPredict('email', text);
  } catch (err: any) {
    console.warn('Email ML inference fallback:', err.message);
    return null;
  }
}
