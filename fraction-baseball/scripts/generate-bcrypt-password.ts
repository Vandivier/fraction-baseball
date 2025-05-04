/**
 * Password Hashing Script
 *
 * This script generates a bcrypt hashed password that can be used in the application.
 *
 * Usage:
 *   Run the script with:
 *   pnpx tsx scripts/generate-bcrypt-password.ts
 *
 *   You will be prompted to enter a password, which will then be hashed.
 *   The hashed password can be used directly in the database for user authentication.
 */

import { hash } from "bcrypt";
import * as readline from "readline";

const SALT_ROUNDS = 10;

async function generateHashedPassword(
  plainTextPassword: string,
): Promise<string> {
  try {
    const hashedPassword = await hash(plainTextPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error("Error generating hashed password:", error);
    throw error;
  }
}

// Ask for password with readline
function promptForPassword(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve, reject) => {
    rl.question("Enter the password to hash: ", (input) => {
      rl.close();
      const trimmedInput = (input ?? "").trim();
      if (!trimmedInput) {
        reject(new Error("Password cannot be empty"));
      } else {
        resolve(trimmedInput);
      }
    });
  });
}

// Main function
async function main(): Promise<void> {
  try {
    // Prompt for a password
    const plainTextPassword = await promptForPassword();

    const hashedPassword = await generateHashedPassword(plainTextPassword);

    console.log("\nHashed Password:");
    console.log(hashedPassword);
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

// Run the script
void main();
