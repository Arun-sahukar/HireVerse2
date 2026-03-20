-- Create Companies Table
CREATE TABLE companies (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Jobs Table
CREATE TABLE jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  company_id BIGINT REFERENCES companies(id),
  recruiter_id TEXT NOT NULL,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Saved Jobs Table
CREATE TABLE saved_jobs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Create Applications Table
CREATE TABLE applications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL,
  name TEXT NOT NULL,
  experience INTEGER NOT NULL,
  skills TEXT NOT NULL,
  education TEXT NOT NULL,
  resume TEXT NOT NULL,
  status TEXT DEFAULT 'applied',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Optional but recommended
-- For development, you can disable RLS or add policies as needed.

-- Seed some initial companies
INSERT INTO companies (name, logo_url) VALUES 
('Google', 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'),
('Microsoft', 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageMW/RE1Mu3b?ver=5c31'),
('Netflix', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg'),
('Amazon', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'),
('Meta', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg');

-- Seed some initial jobs (Note: company_id must exist)
INSERT INTO jobs (title, description, location, company_id, recruiter_id, isOpen) VALUES
('Senior Frontend Engineer', 'Join the Google team to build next-gen search features...', 'Mountain View, CA', 1, 'user_placeholder', true),
('Backend Lead', 'Scale global infrastructure at Microsoft Azure...', 'Redmond, WA', 2, 'user_placeholder', true),
('Mobile Architect', 'Redefine mobile streaming experience at Netflix...', 'Los Gatos, CA', 3, 'user_placeholder', true);
