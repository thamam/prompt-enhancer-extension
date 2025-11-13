// Security Scanner for Prompt Enhancer Pro
// Detects sensitive information in prompts before sending to LLMs

// Only define class if not already defined
if (typeof window.SecurityScanner === 'undefined') {

window.SecurityScanner = class SecurityScanner {
  constructor() {
    // Detection patterns for various sensitive data types
    this.patterns = {
      // API Keys and Tokens
      apiKeys: [
        { name: 'OpenAI API Key', regex: /sk-[A-Za-z0-9]{48}/, severity: 'critical' },
        { name: 'Anthropic API Key', regex: /sk-ant-[A-Za-z0-9-]{95,}/, severity: 'critical' },
        { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/, severity: 'critical' },
        { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/, severity: 'critical' },
        { name: 'GitHub Token', regex: /ghp_[A-Za-z0-9]{36}/, severity: 'critical' },
        { name: 'GitHub OAuth', regex: /gho_[A-Za-z0-9]{36}/, severity: 'critical' },
        { name: 'Stripe API Key', regex: /sk_live_[0-9a-zA-Z]{24}/, severity: 'critical' },
        { name: 'Stripe Publishable Key', regex: /pk_live_[0-9a-zA-Z]{24}/, severity: 'high' },
        { name: 'Generic API Key', regex: /api[_-]?key[_-]?[=:]\s*['"]?[A-Za-z0-9]{20,}['"]?/i, severity: 'high' },
        { name: 'Bearer Token', regex: /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/i, severity: 'critical' },
        { name: 'JWT Token', regex: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+\/=]+/, severity: 'high' }
      ],

      // Passwords
      passwords: [
        { name: 'Password Field', regex: /password[_-]?[=:]\s*['"]?[^\s'"]{6,}['"]?/i, severity: 'critical' },
        { name: 'Password Variable', regex: /pwd[_-]?[=:]\s*['"]?[^\s'"]{6,}['"]?/i, severity: 'critical' },
        { name: 'Pass Field', regex: /pass[_-]?[=:]\s*['"]?[^\s'"]{6,}['"]?/i, severity: 'high' },
        { name: 'Secret Field', regex: /secret[_-]?[=:]\s*['"]?[^\s'"]{8,}['"]?/i, severity: 'high' }
      ],

      // Personal Identifiable Information (PII)
      pii: [
        { name: 'Email Address', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, severity: 'medium' },
        { name: 'US Phone Number', regex: /(?:^|[^\w-])(\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}(?:[^\w-]|$)/, severity: 'medium' },
        { name: 'US Social Security', regex: /\b\d{3}-\d{2}-\d{4}\b/, severity: 'critical' },
        { name: 'US SSN (no dashes)', regex: /(?:^|[^\d])\d{9}(?:[^\d]|$)/, severity: 'high' },
        { name: 'IP Address (IPv4)', regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/, severity: 'low' },
        { name: 'IPv6 Address', regex: /([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/, severity: 'low' }
      ],

      // Financial Information
      financial: [
        { name: 'Credit Card Number', regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/, severity: 'critical', validate: this.validateCreditCard },
        { name: 'Bank Account', regex: /\b\d{8,17}\b/, severity: 'high' }
      ],

      // Database Connection Strings
      database: [
        { name: 'MongoDB Connection', regex: /mongodb(\+srv)?:\/\/[^\s]+/, severity: 'critical' },
        { name: 'PostgreSQL Connection', regex: /postgresql:\/\/[^\s]+/, severity: 'critical' },
        { name: 'MySQL Connection', regex: /mysql:\/\/[^\s]+/, severity: 'critical' },
        { name: 'Database Connection', regex: /(Server|Host|Data Source)\s*=\s*[^;]+/i, severity: 'high' }
      ],

      // Private Keys
      privateKeys: [
        { name: 'RSA Private Key', regex: /-----BEGIN RSA PRIVATE KEY-----/, severity: 'critical' },
        { name: 'EC Private Key', regex: /-----BEGIN EC PRIVATE KEY-----/, severity: 'critical' },
        { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/, severity: 'critical' },
        { name: 'SSH Private Key', regex: /-----BEGIN OPENSSH PRIVATE KEY-----/, severity: 'critical' }
      ]
    };

    // Sensitivity levels - higher sensitivity detects more issues
    this.sensitivityLevels = {
      low: ['critical'], // Only detect critical issues
      medium: ['critical', 'high'], // Detect critical and high severity
      high: ['critical', 'high', 'medium'], // Detect critical, high, and medium
      paranoid: ['critical', 'high', 'medium', 'low'] // Detect everything
    };

    this.currentSensitivity = 'high'; // Default
  }

  // Validate credit card using Luhn algorithm
  validateCreditCard(number) {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Scan text for security issues
  scan(text, sensitivity = null) {
    const level = sensitivity || this.currentSensitivity;
    const allowedSeverities = this.sensitivityLevels[level];

    const findings = [];
    let totalScore = 100; // Start with perfect score

    // Scan all pattern categories
    for (const [category, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        // Skip if severity is below current sensitivity level
        if (!allowedSeverities.includes(pattern.severity)) continue;

        // Create global regex from the pattern
        const globalRegex = new RegExp(pattern.regex.source, 'g');
        const matches = text.match(globalRegex);

        if (matches) {
          for (const match of matches) {
            // Additional validation for credit cards
            if (pattern.validate && !pattern.validate(match)) {
              continue; // Skip invalid credit card numbers
            }

            const finding = {
              type: pattern.name,
              category: category,
              severity: pattern.severity,
              match: match,
              position: text.indexOf(match),
              length: match.length,
              suggestion: this.getRedactionSuggestion(match, pattern.name)
            };

            findings.push(finding);

            // Decrease score based on severity
            const scorePenalty = {
              critical: 30,
              high: 20,
              medium: 10,
              low: 5
            };
            totalScore -= scorePenalty[pattern.severity] || 10;
          }
        }
      }
    }

    // Ensure score doesn't go below 0
    totalScore = Math.max(0, totalScore);

    return {
      score: totalScore,
      findings: findings,
      hasCriticalIssues: findings.some(f => f.severity === 'critical'),
      hasHighIssues: findings.some(f => f.severity === 'high'),
      hasMediumIssues: findings.some(f => f.severity === 'medium'),
      hasLowIssues: findings.some(f => f.severity === 'low'),
      totalIssues: findings.length,
      recommendation: this.getRecommendation(totalScore, findings)
    };
  }

  // Get redaction suggestion for a match
  getRedactionSuggestion(match, type) {
    const suggestions = {
      'OpenAI API Key': '[OPENAI_API_KEY]',
      'Anthropic API Key': '[ANTHROPIC_API_KEY]',
      'Google API Key': '[GOOGLE_API_KEY]',
      'AWS Access Key': '[AWS_ACCESS_KEY]',
      'GitHub Token': '[GITHUB_TOKEN]',
      'GitHub OAuth': '[GITHUB_OAUTH]',
      'Stripe API Key': '[STRIPE_API_KEY]',
      'Stripe Publishable Key': '[STRIPE_PUBLIC_KEY]',
      'Generic API Key': '[API_KEY]',
      'Bearer Token': 'Bearer [TOKEN]',
      'JWT Token': '[JWT_TOKEN]',
      'Password Field': 'password=[REDACTED]',
      'Password Variable': 'pwd=[REDACTED]',
      'Pass Field': 'pass=[REDACTED]',
      'Secret Field': 'secret=[REDACTED]',
      'Email Address': '[EMAIL_REDACTED]',
      'US Phone Number': '[PHONE_REDACTED]',
      'US Social Security': '[SSN_REDACTED]',
      'US SSN (no dashes)': '[SSN_REDACTED]',
      'IP Address (IPv4)': '[IP_ADDRESS]',
      'IPv6 Address': '[IPv6_ADDRESS]',
      'Credit Card Number': '[CARD_****' + match.slice(-4) + ']',
      'Bank Account': '[ACCOUNT_REDACTED]',
      'MongoDB Connection': 'mongodb://[REDACTED]',
      'PostgreSQL Connection': 'postgresql://[REDACTED]',
      'MySQL Connection': 'mysql://[REDACTED]',
      'Database Connection': 'Server=[REDACTED]',
      'RSA Private Key': '[RSA_PRIVATE_KEY_REDACTED]',
      'EC Private Key': '[EC_PRIVATE_KEY_REDACTED]',
      'Private Key': '[PRIVATE_KEY_REDACTED]',
      'SSH Private Key': '[SSH_PRIVATE_KEY_REDACTED]'
    };

    return suggestions[type] || '[REDACTED]';
  }

  // Auto-redact sensitive information
  redact(text, findings) {
    let redactedText = text;

    // Sort findings by position (descending) to avoid offset issues
    const sortedFindings = [...findings].sort((a, b) => b.position - a.position);

    for (const finding of sortedFindings) {
      const before = redactedText.substring(0, finding.position);
      const after = redactedText.substring(finding.position + finding.length);
      redactedText = before + finding.suggestion + after;
    }

    return redactedText;
  }

  // Get recommendation based on score and findings
  getRecommendation(score, findings) {
    if (score === 100) {
      return {
        level: 'safe',
        message: '✅ No security issues detected. Safe to send.',
        color: 'green',
        action: 'proceed'
      };
    }

    if (score >= 80) {
      return {
        level: 'low-risk',
        message: '⚠️ Minor security concerns detected. Review before sending.',
        color: 'yellow',
        action: 'review'
      };
    }

    if (score >= 60) {
      return {
        level: 'medium-risk',
        message: '⚠️ Security issues detected. Consider redacting sensitive data.',
        color: 'orange',
        action: 'redact'
      };
    }

    if (score >= 40) {
      return {
        level: 'high-risk',
        message: '🚨 Serious security issues detected. Redaction strongly recommended.',
        color: 'red',
        action: 'block'
      };
    }

    return {
      level: 'critical',
      message: '🛑 CRITICAL security issues detected. DO NOT send without redaction.',
      color: 'darkred',
      action: 'block'
    };
  }

  // Set sensitivity level
  setSensitivity(level) {
    if (this.sensitivityLevels[level]) {
      this.currentSensitivity = level;
      return true;
    }
    return false;
  }

  // Get summary for display
  getSummary(scanResult) {
    const { score, findings, totalIssues, recommendation } = scanResult;

    const severityCounts = {
      critical: findings.filter(f => f.severity === 'critical').length,
      high: findings.filter(f => f.severity === 'high').length,
      medium: findings.filter(f => f.severity === 'medium').length,
      low: findings.filter(f => f.severity === 'low').length
    };

    return {
      score: score,
      grade: this.getGrade(score),
      totalIssues: totalIssues,
      severityCounts: severityCounts,
      recommendation: recommendation,
      findings: findings.map(f => ({
        type: f.type,
        severity: f.severity,
        preview: f.match.substring(0, 20) + (f.match.length > 20 ? '...' : ''),
        suggestion: f.suggestion
      }))
    };
  }

  // Get letter grade
  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
} // End of SecurityScanner class

} // End of if for duplicate prevention

// Export for use in content script (Node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.SecurityScanner || SecurityScanner;
}
