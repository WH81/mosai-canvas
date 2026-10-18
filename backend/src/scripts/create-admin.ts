import 'dotenv/config';
import readline from 'readline';
import mongoose from 'mongoose';

import Admin from '../models/admin.model';

/**
 * Prompt the user for input.
 */
function askQuestion(question: string): Promise<string> {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      readlineInterface.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt for a password without displaying the characters.
 */
function askPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;

    process.stdout.write(question);

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = '';

    const onData = (character: string) => {
      if (character === '\r' || character === '\n') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);

        process.stdout.write('\n');
        resolve(password);
        return;
      }

      if (character === '\u0003') {
        process.stdout.write('\n');
        process.exit(1);
      }

      if (character === '\u007f') {
        if (password.length > 0) {
          password = password.slice(0, -1);
        }
        return;
      }

      password += character;
    };

    stdin.on('data', onData);
  });
}

/**
 * Create the initial administrator account.
 *
 * This script should be run manually when an administrator
 * account needs to be created.
 */
async function createAdmin(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured.');
  }

  const username = await askQuestion('Admin username: ');
  const email = await askQuestion('Admin email: ');
  const displayName = await askQuestion('Admin display name (optional): ');
  const password = await askPassword('Admin password: ');

  if (!username || !email || !displayName || !password) {
    throw new Error('Username, email, and password are required.');
  }

  if (password.length < 12) {
    throw new Error('Password must contain at least 12 characters.');
  }

  await mongoose.connect(mongoUri);

  console.log('Connected to MongoDB.');

  const existingAdmin = await Admin.findOne({
    $or: [{ username }, { email: email.toLowerCase() }],
  });

  if (existingAdmin) {
    throw new Error(
      'An administrator with that username or email already exists.',
    );
  }

  /**
   * The Admin model's pre-save hook is responsible
   * for hashing passwordHash.
   */
  const admin = new Admin({
    username,
    email: email.toLowerCase(),
    displayName: displayName || undefined,
    passwordHash: password,
    role: 'admin',
    isActive: true,
  });

  await admin.save();

  console.log(`Administrator "${username}" created successfully.`);
}

/**
 * Execute the script.
 */
createAdmin()
  .catch((error: unknown) => {
    console.error(
      'Failed to create administrator:',
      error instanceof Error ? error.message : error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });