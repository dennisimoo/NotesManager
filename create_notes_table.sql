CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  pinned BOOLEAN DEFAULT false
);

-- Create an index on user_id for faster queries
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see only their own notes
CREATE POLICY "Users can only access their own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);