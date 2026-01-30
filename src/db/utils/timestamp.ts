import { customType } from "drizzle-orm/pg-core";

/**
 * Custom timestamp type that returns ISO 8601 formatted strings.
 * Converts postgres timestamp format to ISO format (e.g., "2025-06-22T16:13:37Z")
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
  fromDriver(value: string): string {
    // postgres format: 2025-06-22 16:13:37.489301+00
    // what we want:    2025-06-22T16:13:37Z
    return `${value.slice(0, 10)}T${value.slice(11, 19)}Z`;
  },
});
