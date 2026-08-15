const { createClient } = require('@supabase/supabase-js');

const url = 'https://newjampgimgidqkbwjti.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld2phbXBnaW1naWRxa2J3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODI0MzUsImV4cCI6MjEwMjM1ODQzNX0.xlhcS6tMmb9RZ9Sp_dWdz4o4YhRzuwnE7dRGMY9w1no';

const client = createClient(url, key);

async function purge() {
  console.log('Purging dummy users from Supabase...');
  const { error: e1 } = await client.from('users').delete().eq('id', 'usr_shiv');
  const { error: e2 } = await client.from('users').delete().eq('id', 'usr_anushka');
  console.log('Purge result:', { e1, e2 });

  const { data } = await client.from('users').select('id, name, email, phoneNumber');
  console.log('Remaining users in Supabase:', data);
}

purge();
