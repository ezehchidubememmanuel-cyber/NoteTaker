// Load environment variables
// Note: In production, use proper environment variable handling
// IMPORTANT: Replace these with your actual Supabase credentials from your project dashboard
const SUPABASE_URL = 'https://rhxbsjmfjulsxizbgudp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoeGJzam1manVsc3hpemJndWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Nzk4OTIsImV4cCI6MjA3NjE1NTg5Mn0.wumJqRlOTpPAyZH14Rs94GmcG8e6V5zIOa1SKShQSr8';

// Check if credentials are configured
if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key-here') {
    console.warn('⚠️ SUPABASE CREDENTIALS NOT CONFIGURED!');
    console.warn('Please update config.js with your actual Supabase Project URL and Anon Key');
    console.warn('Get them from: https://supabase.com/dashboard > Your Project > Settings > API');
}

// Initialize Supabase client
let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    alert('⚠️ Configuration Error: Please update your Supabase credentials in config.js\n\nSee README.md for setup instructions.');
}
