import { exec } from 'child_process';
import path from 'path';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req) {
  const electronPath = path.join(
    process.cwd(),
    'node_modules',
    '.bin',
    'electron',
  );

  const platform = os.platform();
  let command;

  if (platform === 'win32') {
    command = `"${electronPath}" ./electron/main.js`;
  } else if (platform === 'darwin') {
    command = `chmod +x "${electronPath}"; "${electronPath}" ./electron/main.js`;
  } else {
    command = `"${electronPath}" ./electron/main.js`;
  }

  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
    return new Response(
      JSON.stringify({ message: 'Electron started successfully' }),
      { status: 200 },
    );
  } catch (err) {
    console.error(`Error starting Electron: ${err}`);
    return new Response(
      JSON.stringify({ error: `Error starting Electron: ${err}` }),
      { status: 500 },
    );
  }
}
