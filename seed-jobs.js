import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjgigronhrknhobmptkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2lncm9uaHJrbmhvYm1wdGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNzkxNjAsImV4cCI6MjA4ODk1NTE2MH0.epPzzS8Tit61bK7TvHmWfg9wcWUc3HM946OIUqGJakI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  const dummyJobs = [
    {
      title: "Senior React Developer",
      description: "We are looking for a Senior React Developer to join our team...",
      location: "Bangalore, KA",
      company_id: 1, // These IDs must exist
      recruiter_id: "user_2uB8pP6WkLqQ8n1m9b0v5", // Replace with a valid ID if testing locally
      isOpen: true,
    },
    {
        title: "Product Designer",
        description: "Looking for a creative Product Designer to lead our design team...",
        location: "Mumbai, MH",
        company_id: 2,
        recruiter_id: "user_2uB8pP6WkLqQ8n1m9b0v5",
        isOpen: true,
    }
  ];

  const { data, error } = await supabase.from('jobs').insert(dummyJobs);
  if (error) console.error(error);
  else console.log('Seeded successfully:', data);
}

seed();
