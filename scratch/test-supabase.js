const { createClient } = require('@supabase/supabase-js');

const url = 'https://newjampgimgidqkbwjti.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld2phbXBnaW1naWRxa2J3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODI0MzUsImV4cCI6MjEwMjM1ODQzNX0.xlhcS6tMmb9RZ9Sp_dWdz4o4YhRzuwnE7dRGMY9w1no';

const client = createClient(url, key);

async function test() {
  console.log('Testing Supabase query...');
  const { data, error } = await client.from('users').select('*');
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Supabase Users count:', data.length);
    console.log('Data:', data);
  }
}

test();
