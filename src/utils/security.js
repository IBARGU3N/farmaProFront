/**
 * Security Utilities for Frontend Data Sanitization
 * Focused on preventing XSS and SQL Injection patterns from the client side.
 */

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '/': '&#x2F;',
};

const SQL_PATTERNS = [
  /--+/g,
  /\/\*[\s\S]*?\*\//g,
  /\bOR\b\s+1\s*=\s*1/gi,
  /\bAND\b\s+1\s*=\s*1/gi,
  /\bUNION\b\s+\bSELECT\b/gi,
  /\bDROP\b\s+\bTABLE\b/gi,
  /\bDELETE\b\s+\bFROM\b/gi,
  /\bINSERT\b\s+\bINTO\b/gi,
  /\bUPDATE\b[\s\S]*?\bSET\b/gi,
  /\bTRUNCATE\b\s+\bTABLE\b/gi,
  /\bALTER\b\s+\bTABLE\b/gi,
  /\bCREATE\b\s+\bTABLE\b/gi,
  /\bEXEC(?:UTE)?\b/gi,
  /\bSLEEP\b\s*\(\s*\d+\s*\)/gi,
  /\bBENCHMARK\b\s*\(\s*\d+\s*,/gi,
];

export const SecurityUtils = {
  sanitize: (value) => {
    if (typeof value !== 'string') return value;

    let sanitized = value;
    sanitized = sanitized.replace(/[&<>\"]/g, (char) => HTML_ESCAPE_MAP[char] || char);

    SQL_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '[REMOVED]');
    });

    sanitized = sanitized.replace(/;/g, '');

    return sanitized;
  },

  isSecure: (value, allowedPattern) => {
    if (typeof value !== 'string') return true;

    const maliciousPatterns = /(--|;|\/\*|\*\/|<|>|\bOR\b\s+1\s*=\s*1|\bUNION\b\s+\bSELECT\b|\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b)/i;
    if (maliciousPatterns.test(value)) return false;

    if (allowedPattern && !allowedPattern.test(value)) {
      return false;
    }

    return true;
  },

  sanitizeObject: (data) => {
    if (data === null || data === undefined) return data;
    if (typeof data !== 'object') return SecurityUtils.sanitize(data);

    if (Array.isArray(data)) {
      return data.map((item) => SecurityUtils.sanitizeObject(item));
    }

    const sanitizedData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedData[key] = SecurityUtils.sanitizeObject(data[key]);
      }
    }
    return sanitizedData;
  },
};
