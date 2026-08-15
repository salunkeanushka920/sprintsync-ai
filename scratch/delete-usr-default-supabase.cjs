const { createClient } = require('@supabase/supabase-js');

const url = 'https://newjampgimgidqkbwjti.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld2phbXBnaW1naWRxa2J3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODI0MzUsImV4cCI6MjEwMjM1ODQzNX0.xlhcS6tMmb9RZ9Sp_dWdz4o4YhRzuwnE7dRGMY9w1no';

const client = createClient(url, key);

async function purge() {
  console.log('Purging usr_default from Supabase...');
  const { error } = await client.from('users').delete().eq('id', 'usr_default');
  console.log('Purge result:', error);

  const { data } = await client.from('users').select('id, name, email');
  console.log('Remaining users in Supabase:', data);
}

purge();
