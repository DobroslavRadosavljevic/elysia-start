export const HealthService = {
  check() {
    return {
      status: "ok" as const,
      timestamp: new Date().toISOString(),
    };
  },
};
