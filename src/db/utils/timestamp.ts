import { customType } from "drizzle-orm/pg-core";

/**
 * Custom timestamp type that returns ISO 8601 formatted strings.
 * Preserves full precision including milliseconds and timezone.
 * Converts postgres timestamp format to ISO format (e.g., "2025-06-22T16:13:37.489Z")
 */
export const timestamp = customType<{
  data: string;
  driverData: string;
  config: { withTimezone: boolean; precision?: number; mode: "iso" };
}>({
  dataType(config) {
    const precision = config?.precision ? ` (${config.precision})` : "";
    return `timestamp${precision}${config?.withTimezone ? " with time zone" : ""}`;
  },
  fromDriver(value: string) {
    // postgres format: "2025-06-22 16:13:37.489301+00" or "2025-06-22 16:13:37.489301"
    // Parse using Date to preserve full precision and handle timezone
    const date = new Date(value.replace(" ", "T"));
    return date.toISOString();
  },
  toDriver(value: string) {
    // Convert ISO string to postgres format for consistent round-trip
    // Input: "2025-06-22T16:13:37.489Z" or any valid date string
    const date = new Date(value);
    // Return ISO string which postgres can parse
    return date.toISOString();
  },
});
