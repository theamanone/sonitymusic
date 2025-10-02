// Security validation and protection utilities
export class SecurityValidator {
    // XSS Protection
    static sanitizeHTML(input: string): string {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // SQL Injection Protection
    static containsSQLInjection(input: string): boolean {
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|DECLARE)\b)/gi,
            /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
            /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi,
            /(--|\/\*|\*\/|;)/g,
            /(\bxp_cmdshell\b)/gi,
            /(\bsp_executesql\b)/gi,
        ];

        return sqlPatterns.some(pattern => pattern.test(input));
    }

    // XSS Protection
    static containsXSS(input: string): boolean {
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /vbscript:/gi,
            /onload\s*=/gi,
            /onerror\s*=/gi,
            /onclick\s*=/gi,
            /onmouseover\s*=/gi,
            /onfocus\s*=/gi,
            /onblur\s*=/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
            /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }

    // Path Traversal Protection
    static containsPathTraversal(input: string): boolean {
        const pathPatterns = [
            /\.\.\//g,
            /\.\.\\/g,
            /%2e%2e%2f/gi,
            /%2e%2e%5c/gi,
            /\.\.%2f/gi,
            /\.\.%5c/gi,
        ];

        return pathPatterns.some(pattern => pattern.test(input));
    }

    // Command Injection Protection
    static containsCommandInjection(input: string): boolean {
        const commandPatterns = [
            /(\b(exec|eval|system|shell_exec|passthru|popen|proc_open)\s*\()/gi,
            /(\b(cmd|command|bash|sh|powershell)\b)/gi,
            /(\||&|;|`|$\(|\))/g,
            /(\b(net|ipconfig|ifconfig|whoami|id|ls|dir|cat|type)\b)/gi,
        ];

        return commandPatterns.some(pattern => pattern.test(input));
    }

    // NoSQL Injection Protection
    static containsNoSQLInjection(input: string): boolean {
        const nosqlPatterns = [
            /(\$where|\$ne|\$gt|\$lt|\$gte|\$lte|\$in|\$nin|\$regex)/gi,
            /(\b(OR|AND)\b\s*\{\s*"\$ne"\s*:\s*null\s*\})/gi,
            /(\b(OR|AND)\b\s*\{\s*"\$gt"\s*:\s*""\s*\})/gi,
        ];

        return nosqlPatterns.some(pattern => pattern.test(input));
    }

    // CSRF Token helpers (Edge-safe)
    static generateCSRFToken(): string {
        // Prefer Web Crypto API when available
        if (typeof globalThis !== 'undefined' && globalThis.crypto && 'getRandomValues' in globalThis.crypto) {
            const bytes = new Uint8Array(32);
            globalThis.crypto.getRandomValues(bytes);
            // Convert to hex
            return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        // Fallback (not cryptographically strong)
        return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    static validateCSRFToken(token: string, storedToken: string): boolean {
        // Constant-time string comparison
        if (typeof token !== 'string' || typeof storedToken !== 'string') return false;
        if (token.length !== storedToken.length) return false;
        let result = 0;
        for (let i = 0; i < token.length; i++) {
            result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
        }
        return result === 0;
    }

    // Input Length Validation
    static validateInputLength(input: string, maxLength: number = 1000): boolean {
        return input.length <= maxLength;
    }

    // Email Validation
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    // Password Strength Validation
    static isStrongPassword(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar;
    }

    // Rate Limiting Helper
    static generateRateLimitKey(identifier: string, action: string): string {
        return `${identifier}:${action}:${Math.floor(Date.now() / 60000)}`;
    }

    // Request Validation
    static validateRequest(data: any): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data) {
            errors.push('Request data is required');
            return { isValid: false, errors };
        }

        // Check for malicious patterns in all string fields
        const checkObject = (obj: any, path: string = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;

                if (typeof value === 'string') {
                    if (this.containsXSS(value)) {
                        errors.push(`XSS detected in ${currentPath}`);
                    }
                    if (this.containsSQLInjection(value)) {
                        errors.push(`SQL injection detected in ${currentPath}`);
                    }
                    if (this.containsCommandInjection(value)) {
                        errors.push(`Command injection detected in ${currentPath}`);
                    }
                    if (this.containsNoSQLInjection(value)) {
                        errors.push(`NoSQL injection detected in ${currentPath}`);
                    }
                    if (this.containsPathTraversal(value)) {
                        errors.push(`Path traversal detected in ${currentPath}`);
                    }
                    if (!this.validateInputLength(value)) {
                        errors.push(`Input too long in ${currentPath}`);
                    }
                } else if (typeof value === 'object' && value !== null) {
                    checkObject(value, currentPath);
                }
            }
        };

        checkObject(data);

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // File Upload Validation
    static validateFileUpload(file: File, allowedTypes: string[], maxSize: number): boolean {
        if (!file) return false;

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            return false;
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const allowedExtensions = allowedTypes.map(type => {
            const ext = type.split('/')[1];
            return ext ? `.${ext}` : '';
        });

        return allowedExtensions.some(ext => fileName.endsWith(ext));
    }

    // JWT Token Validation
    static validateJWTToken(token: string): boolean {
        if (!token) return false;

        // Basic JWT format validation
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
        return jwtRegex.test(token);
    }

    // IP Address Validation
    static isValidIPAddress(ip: string): boolean {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }

    // URL Validation
    static isValidURL(url: string): boolean {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    // Content Security Policy
    static getCSPPolicy(): string {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' https:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
        ].join('; ');
    }

    // Security Headers
    static getSecurityHeaders(): Record<string, string> {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Content-Security-Policy': this.getCSPPolicy(),
        };
    }
}

// Rate limiting class
export class RateLimiter {
    private store = new Map<string, { count: number; resetTime: number }>();

    constructor(
        private windowMs: number = 60000,
        private maxRequests: number = 100
    ) { }

    isAllowed(identifier: string): boolean {
        const key = `${identifier}:${Math.floor(Date.now() / this.windowMs)}`;
        const now = Date.now();

        const current = this.store.get(key);

        if (!current || current.resetTime < now) {
            this.store.set(key, { count: 1, resetTime: now + this.windowMs });
            return true;
        }

        if (current.count >= this.maxRequests) {
            return false;
        }

        current.count++;
        return true;
    }

    getRemaining(identifier: string): number {
        const key = `${identifier}:${Math.floor(Date.now() / this.windowMs)}`;
        const current = this.store.get(key);

        if (!current) {
            return this.maxRequests;
        }

        return Math.max(0, this.maxRequests - current.count);
    }

    reset(identifier: string): void {
        const key = `${identifier}:${Math.floor(Date.now() / this.windowMs)}`;
        this.store.delete(key);
    }
}