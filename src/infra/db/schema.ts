/**
 * LabLink Database Schema - Main export file
 *
 * This file serves as the central export point for all database schemas.
 * Individual table definitions are organized in the schema/ folder for better modularity.
 *
 * Structure:
 * - schema/enums.ts - Database enums (equipmentStatus, userRole, etc.)
 * - schema/users.ts - User accounts and authentication
 * - schema/laboratories.ts - Laboratory facilities management
 * - schema/equipment.ts - Equipment and instruments tracking
 * - schema/refreshTokens.ts - JWT refresh token management
 */

// Re-export all schemas from modular files
export * from "./schema/enums";
export * from "./schema/equipment";
export * from "./schema/laboratories";
export * from "./schema/refreshTokens";
export * from "./schema/users";
