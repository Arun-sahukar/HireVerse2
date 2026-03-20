import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjgigronhrknhobmptkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2lncm9uaHJrbmhvYm1wdGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzkxNjAsImV4cCI6MjA4ODk1NTE2MH0.epPzzS8Tit61bK7TvHmWfg9wcWUc3HM946OIUqGJakI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testFetch() {
  console.log('Testing getJobs query...');
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url)");

  if (error) {
    console.error('Query Error:', error);
  } else {
    console.log('Jobs Found:', data);
  }
}

testFetch();
