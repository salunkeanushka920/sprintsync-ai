const { createClient } = require('@supabase/supabase-js');

const url = 'https://newjampgimgidqkbwjti.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld2phbXBnaW1naWRxa2J3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3ODI0MzUsImV4cCI6MjEwMjM1ODQzNX0.xlhcS6tMmb9RZ9Sp_dWdz4o4YhRzuwnE7dRGMY9w1no';

const client = createClient(url, key);

async function fixNumbers() {
  console.log('Fetching users from Supabase...');
  const { data: users, error } = await client.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  for (const u of users) {
    let phone = (u.phoneNumber || '').trim();
    if (!phone) continue;

    // Clean and check
    let digitsOnly = phone.replace(/[^\d]/g, '');
    let formattedPhone = phone;

    if (digitsOnly.length === 10) {
      formattedPhone = `+91 ${digitsOnly}`;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      formattedPhone = `+91 ${digitsOnly.slice(2)}`;
    }

    if (formattedPhone !== phone) {
      console.log(`Updating ${u.name}: "${phone}" -> "${formattedPhone}"`);
      await client.from('users').update({ phoneNumber: formattedPhone }).eq('id', u.id);
    }
  }

  const { data: updated } = await client.from('users').select('name, phoneNumber');
  console.log('\nFinal Supabase User Phone Numbers:');
  console.log(updated);
}

fixNumbers();
