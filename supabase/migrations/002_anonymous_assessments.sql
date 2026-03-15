-- Allow anonymous assessments by making user_id nullable
ALTER TABLE assessments ALTER COLUMN user_id DROP NOT NULL;

-- Drop the foreign key constraint and re-add it without NOT NULL
-- (The FK itself is fine with NULL values, but we need to allow NULL)

-- RLS policies for anonymous assessments

-- Allow anonymous inserts (user_id IS NULL)
CREATE POLICY "Allow anonymous assessment inserts"
  ON assessments FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Allow reading anonymous assessments (for results page)
CREATE POLICY "Allow reading anonymous assessments"
  ON assessments FOR SELECT
  USING (user_id IS NULL);

-- Allow updating anonymous assessments (to set scores after creation)
CREATE POLICY "Allow updating anonymous assessments"
  ON assessments FOR UPDATE
  USING (user_id IS NULL);

-- Allow anonymous response inserts
CREATE POLICY "Allow anonymous response inserts"
  ON responses FOR INSERT
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id IS NULL
    )
  );

-- Allow reading anonymous responses (for results page)
CREATE POLICY "Allow reading anonymous responses"
  ON responses FOR SELECT
  USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id IS NULL
    )
  );
