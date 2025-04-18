#!/usr/bin/env node

/**
 * Supabase MCP Server - Node.js wrapper
 * 
 * This script provides a Node.js wrapper for running the Supabase MCP server.
 * It allows users to run the server using npm instead of requiring Docker.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Check for required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`- ${varName}`);
  });
  console.error('\nPlease set these variables in your .env file or your environment.');
  process.exit(1);
}

// Check if Python is installed
try {
  const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
  
  // Path to the MCP server script
  const serverScriptPath = path.join(__dirname, 'supabase_mcp', 'server.py');
  
  // Make sure the server script exists
  if (!fs.existsSync(serverScriptPath)) {
    console.error(`Error: Could not find server script at ${serverScriptPath}`);
    process.exit(1);
  }
  
  // Spawn the Python process
  const pythonProcess = spawn(pythonPath, [serverScriptPath], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: process.env
  });
  
  // Handle process events
  pythonProcess.on('error', (err) => {
    console.error(`Failed to start Python process: ${err.message}`);
    process.exit(1);
  });
  
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      process.exit(code);
    }
  });
  
  // Handle termination signals
  process.on('SIGINT', () => {
    pythonProcess.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    pythonProcess.kill('SIGTERM');
  });
  
  console.log('Supabase MCP server started...');
  
} catch (error) {
  console.error('Error: Failed to start Supabase MCP server:', error.message);
  process.exit(1);
}
