#!/usr/bin/env bun
/**
 * Enable CI/CD workflows and Dependabot
 * Run with: bun run ci:enable
 */
import { readdir, rename, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT_DIR = join(import.meta.dir, "..");
const GITHUB_DIR = join(ROOT_DIR, ".github");
const WORKFLOWS_DIR = join(GITHUB_DIR, "workflows");

const enableFile = async (filePath: string): Promise<boolean> => {
  if (!filePath.endsWith(".disabled")) {
    return false;
  }

  const newPath = filePath.replace(/\.disabled$/, "");
  await rename(filePath, newPath);
  const fileName = newPath.split("/").pop();
  console.log(`  Enabled: ${fileName}`);
  return true;
};

const main = async () => {
  console.log("Enabling CI/CD...\n");
  let enabledCount = 0;

  // Enable workflow files
  try {
    const workflowFiles = await readdir(WORKFLOWS_DIR);
    for (const file of workflowFiles) {
      const filePath = join(WORKFLOWS_DIR, file);
      if (await enableFile(filePath)) {
        enabledCount += 1;
      }
    }
  } catch {
    console.log("  No workflows directory found");
  }

  // Enable dependabot
  const dependabotPath = join(GITHUB_DIR, "dependabot.yml.disabled");
  try {
    await stat(dependabotPath);
    if (await enableFile(dependabotPath)) {
      enabledCount += 1;
    }
  } catch {
    // File doesn't exist or already enabled
  }

  if (enabledCount === 0) {
    console.log("CI/CD is already enabled (no .disabled files found)");
  } else {
    console.log(`\nEnabled ${enabledCount} CI/CD configuration(s)`);
    console.log("\nNext steps:");
    console.log("  1. Commit and push these changes");
    console.log("  2. GitHub Actions will run on push/PR to main");
    console.log("  3. Dependabot will create PRs weekly for updates");
  }
};

await main();
