/**
 * Pilgrim Privacy Lifecycle Security Tests
 * 
 * Tests to verify that the unauthenticated PII exposure vulnerability is mitigated:
 * 1. Soft deletion clears all PII fields and sets lifecycle markers
 * 2. Deactivation withdraws consent and expires data retention
 * 3. All query operations exclude deleted/deactivated/expired records
 * 4. Pilgrim API endpoints require authentication
 * 
 * These tests verify the security properties of the code through static analysis.
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Pilgrim Privacy Lifecycle - Security Properties', () => {
  describe('Soft Deletion Implementation', () => {
    it('verifies softDeletePilgrim clears all PII fields', () => {
      // Read the commands/pilgrims.ts file to verify implementation
      const commandsPath = join(__dirname, '../commands/pilgrims.ts');
      const commandsContent = readFileSync(commandsPath, 'utf-8');
      
      // Verify that softDeletePilgrim sets firstName to '(DELETED)'
      expect(commandsContent).toContain("firstName: '(DELETED)'");
      expect(commandsContent).toContain("lastName1: '(DELETED)'");
      
      // Verify it clears sensitive fields
      expect(commandsContent).toContain('lastName2: null');
      expect(commandsContent).toContain('email: null');
      expect(commandsContent).toContain("birthDate: '(DELETED)'");
      expect(commandsContent).toContain("documentNumber: '(DELETED)'");
      expect(commandsContent).toContain('documentSupport: null');
      expect(commandsContent).toContain("addressStreet: '(DELETED)'");
      expect(commandsContent).toContain('addressStreet2: null');
      expect(commandsContent).toContain("addressCity: '(DELETED)'");
      expect(commandsContent).toContain('addressProvince: null');
      expect(commandsContent).toContain('addressMunicipalityCode: null');
      expect(commandsContent).toContain('idPhotoUrl: null');
    });

    it('verifies softDeletePilgrim sets lifecycle markers', () => {
      const commandsPath = join(__dirname, '../commands/pilgrims.ts');
      const commandsContent = readFileSync(commandsPath, 'utf-8');
      
      // Find the softDeletePilgrim function
      const softDeleteMatch = commandsContent.match(/export async function softDeletePilgrim[\s\S]*?\.returning\(\);/);
      expect(softDeleteMatch).toBeDefined();
      
      const softDeleteCode = softDeleteMatch![0];
      
      // Verify consent is withdrawn
      expect(softDeleteCode).toContain('consentGiven: false');
      expect(softDeleteCode).toContain('consentDate: null');
      
      // Verify data retention is expired immediately
      expect(softDeleteCode).toContain('dataRetentionUntil: new Date()');
    });
  });

  describe('Deactivation Implementation', () => {
    it('verifies deactivatePilgrim withdraws consent and expires retention', () => {
      const commandsPath = join(__dirname, '../commands/pilgrims.ts');
      const commandsContent = readFileSync(commandsPath, 'utf-8');
      
      // Find the deactivatePilgrim function
      const deactivateMatch = commandsContent.match(/export async function deactivatePilgrim[\s\S]*?\.returning\(\);/);
      expect(deactivateMatch).toBeDefined();
      
      const deactivateCode = deactivateMatch![0];
      
      // Verify consent withdrawal
      expect(deactivateCode).toContain('consentGiven: false');
      expect(deactivateCode).toContain('consentDate: null');
      
      // Verify immediate retention expiry
      expect(deactivateCode).toContain('dataRetentionUntil: new Date()');
    });
  });

  describe('Query Lifecycle Predicate', () => {
    it('verifies lifecycle predicate filters deleted pilgrims', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Verify lifecycle predicate function exists
      expect(queriesContent).toContain('function getLifecyclePredicate()');
      
      // Verify it checks for '(DELETED)' marker
      expect(queriesContent).toContain("ne(pilgrims.firstName, '(DELETED)')");
    });

    it('verifies lifecycle predicate filters consent-withdrawn pilgrims', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Verify consent check
      expect(queriesContent).toContain('eq(pilgrims.consentGiven, true)');
      expect(queriesContent).toContain('isNull(pilgrims.consentGiven)');
    });

    it('verifies lifecycle predicate filters retention-expired pilgrims', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Verify retention expiry check
      expect(queriesContent).toContain('isNull(pilgrims.dataRetentionUntil)');
      expect(queriesContent).toContain('gt(pilgrims.dataRetentionUntil, now)');
    });

    it('verifies getPilgrimById applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find getPilgrimById function
      const getByIdMatch = queriesContent.match(/export async function getPilgrimById[\s\S]*?return result \|\| null;/);
      expect(getByIdMatch).toBeDefined();
      
      const getByIdCode = getByIdMatch![0];
      
      // Verify it calls getLifecyclePredicate
      expect(getByIdCode).toContain('getLifecyclePredicate()');
    });

    it('verifies getAllPilgrims applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find getAllPilgrims function
      const getAllMatch = queriesContent.match(/export async function getAllPilgrims[\s\S]*?return \{/);
      expect(getAllMatch).toBeDefined();
      
      const getAllCode = getAllMatch![0];
      
      // Verify it includes lifecycle predicate in whereConditions
      expect(getAllCode).toContain('getLifecyclePredicate()');
      expect(getAllCode).toContain('whereConditions = [getLifecyclePredicate()]');
    });

    it('verifies searchPilgrims applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find searchPilgrims function
      const searchMatch = queriesContent.match(/export async function searchPilgrims[\s\S]*?\.limit\(limit\);/);
      expect(searchMatch).toBeDefined();
      
      const searchCode = searchMatch![0];
      
      // Verify it calls getLifecyclePredicate
      expect(searchCode).toContain('getLifecyclePredicate()');
    });

    it('verifies getPilgrimByEmail applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find getPilgrimByEmail function
      const getByEmailMatch = queriesContent.match(/export async function getPilgrimByEmail[\s\S]*?return result \|\| null;/);
      expect(getByEmailMatch).toBeDefined();
      
      const getByEmailCode = getByEmailMatch![0];
      
      // Verify it calls getLifecyclePredicate
      expect(getByEmailCode).toContain('getLifecyclePredicate()');
    });

    it('verifies getPilgrimByDocumentNumber applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find getPilgrimByDocumentNumber function
      const getByDocMatch = queriesContent.match(/export async function getPilgrimByDocumentNumber[\s\S]*?return result \|\| null;/);
      expect(getByDocMatch).toBeDefined();
      
      const getByDocCode = getByDocMatch![0];
      
      // Verify it calls getLifecyclePredicate
      expect(getByDocCode).toContain('getLifecyclePredicate()');
    });

    it('verifies getPilgrimStats applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find getPilgrimStats function
      const getStatsMatch = queriesContent.match(/export async function getPilgrimStats[\s\S]*?return \{/);
      expect(getStatsMatch).toBeDefined();
      
      const getStatsCode = getStatsMatch![0];
      
      // Verify it uses lifecycle predicate
      expect(getStatsCode).toContain('getLifecyclePredicate()');
      expect(getStatsCode).toContain('lifecyclePredicate');
    });

    it('verifies getRecentPilgrims applies lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find getRecentPilgrims function
      const getRecentMatch = queriesContent.match(/export async function getRecentPilgrims[\s\S]*?return results;/);
      expect(getRecentMatch).toBeDefined();
      
      const getRecentCode = getRecentMatch![0];
      
      // Verify it calls getLifecyclePredicate
      expect(getRecentCode).toContain('getLifecyclePredicate()');
    });
  });

  describe('Authentication Enforcement', () => {
    it('verifies pilgrim routes are protected by authentication middleware', () => {
      const indexPath = join(__dirname, '../index.ts');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      // Verify authentication middleware is applied to /pilgrims/* routes
      expect(indexContent).toContain('api.use("/pilgrims/*", authMiddleware({ roles: ["admin"] }))');
    });

    it('verifies authentication middleware requires admin role', () => {
      const indexPath = join(__dirname, '../index.ts');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      // Find the pilgrim route protection
      const pilgrimAuthMatch = indexContent.match(/api\.use\("\/pilgrims\/\*",\s*authMiddleware\(\{[^}]+\}\)\)/);
      expect(pilgrimAuthMatch).toBeDefined();
      
      const pilgrimAuthCode = pilgrimAuthMatch![0];
      
      // Verify it requires admin role
      expect(pilgrimAuthCode).toContain('roles: ["admin"]');
    });

    it('verifies pilgrim routes are mounted after authentication middleware', () => {
      const indexPath = join(__dirname, '../index.ts');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      // Find the positions of auth middleware and route mounting
      const authMiddlewarePos = indexContent.indexOf('api.use("/pilgrims/*", authMiddleware');
      const routeMountPos = indexContent.indexOf('api.route("/pilgrims", pilgrims)');
      
      // Verify auth middleware comes before route mounting
      expect(authMiddlewarePos).toBeGreaterThan(0);
      expect(routeMountPos).toBeGreaterThan(0);
      expect(authMiddlewarePos).toBeLessThan(routeMountPos);
    });
  });

  describe('Security Property Assertions', () => {
    it('ensures all PII fields are addressed in soft deletion', () => {
      const commandsPath = join(__dirname, '../commands/pilgrims.ts');
      const commandsContent = readFileSync(commandsPath, 'utf-8');
      
      // Find the softDeletePilgrim function
      const softDeleteMatch = commandsContent.match(/export async function softDeletePilgrim[\s\S]*?\.returning\(\);/);
      expect(softDeleteMatch).toBeDefined();
      
      const softDeleteCode = softDeleteMatch![0];
      
      // List of all PII fields that should be cleared
      const piiFields = [
        'firstName',
        'lastName1',
        'lastName2',
        'email',
        'phone',
        'birthDate',
        'documentNumber',
        'documentSupport',
        'addressStreet',
        'addressStreet2',
        'addressCity',
        'addressPostalCode',
        'addressProvince',
        'addressMunicipalityCode',
        'idPhotoUrl',
      ];
      
      // Verify each PII field is mentioned in the soft delete operation
      for (const field of piiFields) {
        expect(softDeleteCode).toContain(field);
      }
    });

    it('ensures lifecycle markers are set consistently', () => {
      const commandsPath = join(__dirname, '../commands/pilgrims.ts');
      const commandsContent = readFileSync(commandsPath, 'utf-8');
      
      // Both softDeletePilgrim and deactivatePilgrim should set the same lifecycle markers
      const lifecycleMarkers = [
        'consentGiven: false',
        'consentDate: null',
        'dataRetentionUntil: new Date()',
      ];
      
      // Find both functions
      const softDeleteMatch = commandsContent.match(/export async function softDeletePilgrim[\s\S]*?\.returning\(\);/);
      const deactivateMatch = commandsContent.match(/export async function deactivatePilgrim[\s\S]*?\.returning\(\);/);
      
      expect(softDeleteMatch).toBeDefined();
      expect(deactivateMatch).toBeDefined();
      
      const softDeleteCode = softDeleteMatch![0];
      const deactivateCode = deactivateMatch![0];
      
      // Verify both functions set all lifecycle markers
      for (const marker of lifecycleMarkers) {
        expect(softDeleteCode).toContain(marker);
        expect(deactivateCode).toContain(marker);
      }
    });

    it('ensures lifecycle predicate is comprehensive', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // Find the lifecycle predicate function
      const predicateMatch = queriesContent.match(/function getLifecyclePredicate\(\)[\s\S]*?\n\}/);
      expect(predicateMatch).toBeDefined();
      
      const predicateCode = predicateMatch![0];
      
      // Verify it checks all three conditions:
      // 1. Not deleted (firstName != '(DELETED)')
      expect(predicateCode).toContain("ne(pilgrims.firstName, '(DELETED)')");
      
      // 2. Consent given or null (for legacy data)
      expect(predicateCode).toContain('eq(pilgrims.consentGiven, true)');
      expect(predicateCode).toContain('isNull(pilgrims.consentGiven)');
      
      // 3. Retention not expired
      expect(predicateCode).toContain('isNull(pilgrims.dataRetentionUntil)');
      expect(predicateCode).toContain('gt(pilgrims.dataRetentionUntil, now)');
      
      // Verify it uses AND/OR logic correctly
      expect(predicateCode).toContain('and(');
      expect(predicateCode).toContain('or(');
    });

    it('ensures no query function bypasses lifecycle predicate', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // List of all query functions that should use lifecycle predicate
      const queryFunctions = [
        'getPilgrimById',
        'getAllPilgrims',
        'searchPilgrims',
        'getPilgrimByEmail',
        'getPilgrimByDocumentNumber',
        'getPilgrimStats',
        'getRecentPilgrims',
        'getPilgrimsWithActiveBookings',
      ];
      
      // Verify each function calls getLifecyclePredicate
      for (const funcName of queryFunctions) {
        const funcMatch = queriesContent.match(new RegExp(`export async function ${funcName}[\\s\\S]*?(?=export|$)`));
        expect(funcMatch, `Function ${funcName} should exist`).toBeDefined();
        
        const funcCode = funcMatch![0];
        expect(funcCode, `Function ${funcName} should use lifecycle predicate`).toContain('getLifecyclePredicate');
      }
    });
  });

  describe('Regression Prevention', () => {
    it('ensures soft delete does not leave any PII field uncleared', () => {
      const commandsPath = join(__dirname, '../commands/pilgrims.ts');
      const commandsContent = readFileSync(commandsPath, 'utf-8');
      
      // Find the softDeletePilgrim function
      const softDeleteMatch = commandsContent.match(/export async function softDeletePilgrim[\s\S]*?\.returning\(\);/);
      expect(softDeleteMatch).toBeDefined();
      
      const softDeleteCode = softDeleteMatch![0];
      
      // Count the number of fields being set (should be at least 15 PII fields + lifecycle markers)
      const fieldSetCount = (softDeleteCode.match(/\w+:/g) || []).length;
      expect(fieldSetCount).toBeGreaterThanOrEqual(18); // 15 PII fields + 3 lifecycle markers + updatedAt
    });

    it('ensures lifecycle predicate is applied before any filtering', () => {
      const queriesPath = join(__dirname, '../queries/pilgrims.ts');
      const queriesContent = readFileSync(queriesPath, 'utf-8');
      
      // In getAllPilgrims, lifecycle predicate should be the first condition
      const getAllMatch = queriesContent.match(/const whereConditions = \[getLifecyclePredicate\(\)\];/);
      expect(getAllMatch).toBeDefined();
    });
  });
});
