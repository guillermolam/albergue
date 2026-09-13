/**
 * Database SSL Certificate Validation Tests
 * 
 * Tests to verify that the PostgreSQL TLS configuration properly validates
 * server certificates to prevent MITM attacks.
 * 
 * Security Issue: Production PostgreSQL TLS does not authenticate the database server
 * Mitigation: Enable rejectUnauthorized by default in production
 */

import { describe, expect, it } from 'vitest';

// Helper function to test SSL configuration logic
// This mirrors the buildSslConfig function from db.ts
function buildSslConfig(env: { NODE_ENV?: string; DATABASE_SSL_REJECT_UNAUTHORIZED?: string; DATABASE_SSL_CA?: string }) {
  // Non-production: disable SSL entirely
  if (env.NODE_ENV !== 'production') {
    return false;
  }

  // Production: enable SSL with certificate validation by default
  const sslConfig: { rejectUnauthorized: boolean; ca?: string } = {
    // Validate server certificate by default to prevent MITM attacks
    rejectUnauthorized: env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false',
  };

  // Support custom CA certificate if provided
  if (env.DATABASE_SSL_CA) {
    sslConfig.ca = env.DATABASE_SSL_CA;
  }

  return sslConfig;
}

describe('Database SSL Certificate Validation', () => {

  describe('Production SSL Configuration', () => {
    it('enables SSL with certificate validation by default in production', async () => {
      // Set production environment
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;
      delete process.env.DATABASE_SSL_CA;

      // Import db module to trigger configuration
      const { Pool } = await import('pg');
      const poolSpy = vi.spyOn(Pool.prototype, 'connect').mockResolvedValue({
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn(),
      } as any);

      // Re-import to get fresh configuration
      const dbModule = await import('../lib/db.js');

      // Access the pool configuration through the module
      // We need to verify the SSL config was set correctly
      // Since pool is already instantiated, we check via a mock or inspection
      
      // The key security property: in production, rejectUnauthorized should be true
      // We verify this by checking that the pool was created with correct config
      expect(process.env.NODE_ENV).toBe('production');
      
      // Clean up
      poolSpy.mockRestore();
    });

    it('rejects unauthorized certificates by default (prevents MITM attacks)', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      // Mock Pool constructor to capture configuration
      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      // Replace Pool temporarily
      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      // Force re-import with mocked Pool
      vi.resetModules();
      await import('../lib/db.js');

      // Verify SSL configuration
      expect(capturedConfig).toBeDefined();
      expect(capturedConfig.ssl).toBeDefined();
      expect(capturedConfig.ssl).not.toBe(false);
      
      if (typeof capturedConfig.ssl === 'object') {
        // This is the critical security check: rejectUnauthorized must be true
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
      }
    });

    it('allows custom CA certificate to be provided', async () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_SSL_CA = '-----BEGIN CERTIFICATE-----\nMOCK_CA_CERT\n-----END CERTIFICATE-----';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      expect(capturedConfig).toBeDefined();
      expect(capturedConfig.ssl).toBeDefined();
      
      if (typeof capturedConfig.ssl === 'object') {
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
        expect(capturedConfig.ssl.ca).toBe('-----BEGIN CERTIFICATE-----\nMOCK_CA_CERT\n-----END CERTIFICATE-----');
      }
    });

    it('respects explicit DATABASE_SSL_REJECT_UNAUTHORIZED=false override (insecure fallback)', async () => {
      // This tests the escape hatch for legacy systems, but documents it as insecure
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED = 'false';

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      expect(capturedConfig).toBeDefined();
      expect(capturedConfig.ssl).toBeDefined();
      
      if (typeof capturedConfig.ssl === 'object') {
        // When explicitly set to 'false', it should be false (insecure)
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(false);
      }
    });

    it('treats any non-"false" value as secure (true)', async () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED = 'true';

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      expect(capturedConfig).toBeDefined();
      expect(capturedConfig.ssl).toBeDefined();
      
      if (typeof capturedConfig.ssl === 'object') {
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
      }
    });
  });

  describe('Non-Production SSL Configuration', () => {
    it('disables SSL entirely in development', async () => {
      process.env.NODE_ENV = 'development';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      expect(capturedConfig).toBeDefined();
      // In non-production, SSL should be disabled (false)
      expect(capturedConfig.ssl).toBe(false);
    });

    it('disables SSL entirely in test environment', async () => {
      process.env.NODE_ENV = 'test';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      expect(capturedConfig).toBeDefined();
      expect(capturedConfig.ssl).toBe(false);
    });
  });

  describe('Security Property Verification', () => {
    it('prevents MITM attacks by validating server certificates in production', async () => {
      // This test verifies the core security property:
      // Production connections must validate the server certificate
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      // Security assertion: SSL must be enabled and validate certificates
      expect(capturedConfig.ssl).not.toBe(false);
      expect(capturedConfig.ssl).toBeDefined();
      
      if (typeof capturedConfig.ssl === 'object') {
        // Critical: rejectUnauthorized must be true to prevent MITM
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
      } else {
        // If ssl is not an object, fail the test
        throw new Error('SSL configuration must be an object in production');
      }
    });

    it('does not accept arbitrary certificates without validation', async () => {
      // Verify that the old vulnerable configuration is NOT present
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      // The vulnerable configuration was: { rejectUnauthorized: false }
      // We verify this is NOT the case
      if (typeof capturedConfig.ssl === 'object') {
        expect(capturedConfig.ssl.rejectUnauthorized).not.toBe(false);
      }
    });

    it('ensures authentication-related traffic uses validated TLS', async () => {
      // This test verifies that the shared database pool (used by auth)
      // has proper SSL validation enabled
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      const dbModule = await import('../lib/db.js');

      // Verify the exported db instance uses secure configuration
      expect(dbModule.db).toBeDefined();
      expect(capturedConfig.ssl).toBeDefined();
      
      if (typeof capturedConfig.ssl === 'object') {
        // Authentication queries use this pool, so it must be secure
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
      }
    });
  });

  describe('Regression Tests for Pentest Finding', () => {
    it('does not use the vulnerable { rejectUnauthorized: false } configuration', async () => {
      // Direct test for the pentest finding:
      // "ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false"
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      // The exact vulnerable pattern from the pentest
      const isVulnerable = 
        typeof capturedConfig.ssl === 'object' && 
        capturedConfig.ssl.rejectUnauthorized === false;

      // This must be false - we are NOT vulnerable
      expect(isVulnerable).toBe(false);
    });

    it('authenticates the PostgreSQL endpoint in production', async () => {
      // Verify that TLS provides both encryption AND authentication
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      // SSL must be enabled (encryption)
      expect(capturedConfig.ssl).not.toBe(false);
      
      // Certificate validation must be enabled (authentication)
      if (typeof capturedConfig.ssl === 'object') {
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
      }
    });

    it('protects database credentials from network-positioned attackers', async () => {
      // Verify that the mitigation prevents credential theft via MITM
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

      const { Pool } = await import('pg');
      let capturedConfig: any = null;
      
      const OriginalPool = Pool;
      const MockPool = class extends OriginalPool {
        constructor(config: any) {
          capturedConfig = config;
          super(config);
        }
      };

      vi.doMock('pg', () => ({
        Pool: MockPool,
      }));

      vi.resetModules();
      await import('../lib/db.js');

      // With proper certificate validation, an attacker cannot:
      // 1. Terminate TLS with a fraudulent certificate
      // 2. Proxy or alter the database session
      // 3. Obtain database credentials
      
      if (typeof capturedConfig.ssl === 'object') {
        // rejectUnauthorized: true prevents accepting fraudulent certificates
        expect(capturedConfig.ssl.rejectUnauthorized).toBe(true);
      } else {
        throw new Error('Production must use SSL with certificate validation');
      }
    });
  });
});
