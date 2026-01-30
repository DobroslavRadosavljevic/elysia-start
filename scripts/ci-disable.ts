#!/usr/bin/env bun
/**
 * Disable CI/CD workflows and Dependabot
 * Run with: bun run ci:disable
 */
import { readdir, rename, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT_DIR = join(import.meta.dir, "..");
const GITHUB_DIR = join(ROOT_DIR, ".github");
const WORKFLOWS_DIR = join(GITHUB_DIR, "workflows");

const disableFile = async (filePath: string): Promise<boolean> => {
  if (filePath.endsWith(".disabled")) {
    return false;
  }
  if (!filePath.endsWith(".yml")) {
    return false;
  }

  const newPath = `${filePath}.disabled`;
  await rename(filePath, newPath);
  const fileName = filePath.split("/").pop();
  console.log(`  Disabled: ${fileName}`);
  return true;
};

const main = async () => {
  console.log("Disabling CI/CD...\n");
  let disabledCount = 0;

  // Disable workflow files
  try {
    const workflowFiles = await readdir(WORKFLOWS_DIR);
    for (const file of workflowFiles) {
      const filePath = join(WORKFLOWS_DIR, file);
      if (await disableFile(filePath)) {
        disabledCount += 1;
      }
    }
  } catch {
    console.log("  No workflows directory found");
  }

  // Disable dependabot
  const dependabotPath = join(GITHUB_DIR, "dependabot.yml");
  try {
    await stat(dependabotPath);
    if (await disableFile(dependabotPath)) {
      disabledCount += 1;
    }
  } catch {
    // File doesn't exist or already disabled
  }

  if (disabledCount === 0) {
    console.log("CI/CD is already disabled (no active .yml files found)");
  } else {
    console.log(`\nDisabled ${disabledCount} CI/CD configuration(s)`);
  }
};

await main();
