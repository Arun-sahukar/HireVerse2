import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjgigronhrknhobmptkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2lncm9uaHJrbmhvYm1wdGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzkxNjAsImV4cCI6MjA4ODk1NTE2MH0.epPzzS8Tit61bK7TvHmWfg9wcWUc3HM946OIUqGJakI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Checking Companies...');
  const { data: companies, error: cError } = await supabase.from('companies').select('*');
  if (cError) console.error('Error fetching companies:', cError);
  else console.log('Companies:', companies);

  if (!companies || companies.length === 0) {
    console.log('No companies found. Seeding companies...');
    const { data: newCompanies, error: scError } = await supabase.from('companies').insert([
        { name: 'Google', logo_url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' },
        { name: 'Microsoft', logo_url: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageMW/RE1Mu3b?ver=5c31' },
         { name: 'Netflix', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' }
    ]).select();
    if (scError) console.error('Error seeding companies:', scError);
    else {
        console.log('Companies seeded.');
        // Seed Jobs
        console.log('Seeding jobs...');
        const { error: jError } = await supabase.from('jobs').insert([
            { title: 'Full Stack Engineer', description: 'Exciting role at Google...', location: 'Bangalore', company_id: newCompanies[0].id, recruiter_id: 'user_placeholder', is_open: true },
            { title: 'Cloud Architect', description: 'Lead cloud initiatives at Microsoft...', location: 'Hyderabad', company_id: newCompanies[1].id, recruiter_id: 'user_placeholder', is_open: true }
        ]);
        if (jError) console.error('Error seeding jobs:', jError);
        else console.log('Jobs seeded.');
    }
  } else {
     console.log('Seeding jobs with existing companies...');
      const { error: jError } = await supabase.from('jobs').insert([
            { title: 'Frontend Developer', description: 'Build stunning UIs at Netflix...', location: 'Remote', company_id: companies[0].id, recruiter_id: 'user_placeholder', is_open: true },
            { title: 'Backend Lead', description: 'Scale services at Google...', location: 'Bangalore', company_id: companies[0].id, recruiter_id: 'user_placeholder', is_open: true }
        ]);
        if (jError) console.error('Error seeding jobs:', jError);
        else console.log('Jobs seeded.');
  }
}

run();
