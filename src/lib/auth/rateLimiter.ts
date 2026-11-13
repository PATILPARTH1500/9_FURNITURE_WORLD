/**
 * Rate Limiter and Abuse Protection
 * Handles progressive backoff, cooldowns, and non-enumerating error sanitization.
 */

export interface RateLimitState {
  allowed: boolean;
  remainingCooldownSeconds: number;
  message?: string;
}

interface ActionAttemptRecord {
  timestamps: number[];
  lastCooldownUntil: number;
}

const STORAGE_PREFIX = 'fw_auth_throttle_';

// In-memory fallback if localStorage is unavailable
const memoryRecords = new Map<string, ActionAttemptRecord>();

const getActionRecord = (actionKey: string): ActionAttemptRecord => {
  if (typeof window === 'undefined') {
    return memoryRecords.get(actionKey) || { timestamps: [], lastCooldownUntil: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + actionKey);
    if (!raw) return { timestamps: [], lastCooldownUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return memoryRecords.get(actionKey) || { timestamps: [], lastCooldownUntil: 0 };
  }
};

const saveActionRecord = (actionKey: string, record: ActionAttemptRecord): void => {
  if (typeof window === 'undefined') {
    memoryRecords.set(actionKey, record);
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_PREFIX + actionKey, JSON.stringify(record));
  } catch {
    memoryRecords.set(actionKey, record);
  }
};

export const RateLimiter = {
  /**
   * Check if an action is currently throttled
   * @param action 'login' | 'register' | 'resend_verification' | 'password_recovery'
   * @param identifier sanitized non-sensitive key (e.g. lowercase email or 'global')
   * @param maxAttempts allowed within the window before cooldown
   * @param windowMs window duration in milliseconds
   * @param cooldownSeconds forced cooldown duration when exceeded
   */
  check(
    action: 'login' | 'register' | 'resend_verification' | 'password_recovery',
    identifier = 'global',
    maxAttempts = 5,
    windowMs = 60000,
    cooldownSeconds = 60
  ): RateLimitState {
    const now = Date.now();
    const actionKey = `${action}:${identifier.trim().toLowerCase()}`;
    const record = getActionRecord(actionKey);

    // 1. Check if currently in an active cooldown period
    if (record.lastCooldownUntil > now) {
      const remainingSeconds = Math.ceil((record.lastCooldownUntil - now) / 1000);
      return {
        allowed: false,
        remainingCooldownSeconds: remainingSeconds,
        message: `Too many attempts. For your security, please wait ${remainingSeconds} second${
          remainingSeconds === 1 ? '' : 's'
        } before trying again.`,
      };
    }

    // 2. Prune timestamps older than windowMs
    const recentAttempts = record.timestamps.filter((ts) => now - ts < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      // Trigger new cooldown
      const cooldownUntil = now + cooldownSeconds * 1000;
      saveActionRecord(actionKey, {
        timestamps: recentAttempts,
        lastCooldownUntil: cooldownUntil,
      });

      return {
        allowed: false,
        remainingCooldownSeconds: cooldownSeconds,
        message: `Too many attempts. Please wait ${cooldownSeconds} seconds before trying again.`,
      };
    }

    return {
      allowed: true,
      remainingCooldownSeconds: 0,
    };
  },

  /**
   * Record a new attempt
   */
  record(
    action: 'login' | 'register' | 'resend_verification' | 'password_recovery',
    identifier = 'global',
    windowMs = 60000
  ): void {
    const now = Date.now();
    const actionKey = `${action}:${identifier.trim().toLowerCase()}`;
    const record = getActionRecord(actionKey);
    const recentAttempts = record.timestamps.filter((ts) => now - ts < windowMs);
    recentAttempts.push(now);

    saveActionRecord(actionKey, {
      timestamps: recentAttempts,
      lastCooldownUntil: record.lastCooldownUntil,
    });
  },

  /**
   * Reset attempts on successful authentication
   */
  reset(action: 'login' | 'register' | 'resend_verification' | 'password_recovery', identifier = 'global'): void {
    const actionKey = `${action}:${identifier.trim().toLowerCase()}`;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_PREFIX + actionKey);
      } catch {
        // ignore
      }
    }
    memoryRecords.delete(actionKey);
  },

  /**
   * Sanitize Supabase Auth errors to avoid account enumeration and format safe feedback
   */
  sanitizeAuthError(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return 'An unexpected error occurred. Please try again.';
    }

    const err = error as { message?: string; status?: number; code?: string };
    const msg = (err.message || '').toLowerCase();

    // Rate limit errors from Supabase GoTrue
    if (err.status === 429 || msg.includes('rate limit') || msg.includes('too many requests')) {
      return 'Security limit reached. Please wait a minute before requesting another verification or login.';
    }

    if (msg.includes('over_email_send_rate_limit')) {
      return 'For your security, verification emails are limited. Please check your inbox or wait before requesting another.';
    }

    // Invalid credentials (generic to prevent enumeration)
    if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
      return 'Invalid email address or password. Please verify and try again.';
    }

    // Email not confirmed
    if (msg.includes('email not confirmed')) {
      return 'Please verify your email address to sign in. Check your inbox for the confirmation link.';
    }

    // User already exists
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return 'An account with this email address already exists. Please sign in or reset your password.';
    }

    // Password requirements
    if (msg.includes('password should be at least')) {
      return 'Password must be at least 8 characters and include a mixture of letters, numbers, and symbols.';
    }

    // Expired or invalid recovery/verification token
    if (msg.includes('token has expired') || msg.includes('token is invalid') || msg.includes('otp expired')) {
      return 'This verification or password recovery link has expired or has already been used. Please request a new one.';
    }

    return err.message || 'An error occurred while processing your request. Please try again.';
  },
};
