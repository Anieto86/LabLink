import { pgEnum } from "drizzle-orm/pg-core";

// Database enums for LabLink system

export const equipmentStatus = pgEnum("equipment_status", [
	"available",
	"in_use",
	"maintenance",
	"out_of_order",
	"retired",
]);

export const formStatus = pgEnum("form_status", ["draft", "published", "archived"]);

export const userRole = pgEnum("user_role", ["admin", "scientist", "student", "tech", "viewer"]);
