import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uydcxbdvcnlwdquyatxb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5ZGN4YmR2Y25sd2RxdXlhdHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MTQ1MDQsImV4cCI6MjA2NjM5MDUwNH0._3WV5PIs14FKCaE5kYz7YFNd1lQ1Y38ID4AVMxnUfEM'

export const supabase = createClient(supabaseUrl, supabaseKey)

