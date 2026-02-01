-- ============================================
-- UGCHub Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table (managed by NextAuth)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255), -- NULL for OAuth users
  role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'creator')),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Brand Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  active_gigs_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Creator Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT NOT NULL,
  portfolio_url TEXT,
  social_handles JSONB DEFAULT '{}',
  niches TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2) DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  completed_gigs_count INTEGER DEFAULT 0,
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Gigs
-- ============================================
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('reel', 'story', 'post', 'video', 'photo')),
  budget DECIMAL(10, 2) NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  slots_available INTEGER NOT NULL DEFAULT 1,
  slots_filled INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  reference_files TEXT[] DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Submissions
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(gig_id, creator_id) -- One submission per creator per gig
);

-- ============================================
-- Transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES users(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('escrow_deposit', 'payout', 'refund', 'withdrawal')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_gigs_brand_id ON gigs(brand_id);
CREATE INDEX idx_gigs_status ON gigs(status);
CREATE INDEX idx_gigs_deadline ON gigs(deadline);
CREATE INDEX idx_submissions_gig_id ON submissions(gig_id);
CREATE INDEX idx_submissions_creator_id ON submissions(creator_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_transactions_gig_id ON transactions(gig_id);
CREATE INDEX idx_transactions_brand_id ON transactions(brand_id);
CREATE INDEX idx_transactions_creator_id ON transactions(creator_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users: Can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Brand Profiles: Brands can manage their own profile
CREATE POLICY "Brands can view own profile" ON brand_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Brands can update own profile" ON brand_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Brands can insert own profile" ON brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Creator Profiles: Creators can manage their own profile, everyone can view
CREATE POLICY "Anyone can view creator profiles" ON creator_profiles
  FOR SELECT USING (true);

CREATE POLICY "Creators can update own profile" ON creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Creators can insert own profile" ON creator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Gigs: Everyone can view open gigs, brands can manage their own
CREATE POLICY "Anyone can view open gigs" ON gigs
  FOR SELECT USING (status = 'open' OR auth.uid() = brand_id);

CREATE POLICY "Brands can insert own gigs" ON gigs
  FOR INSERT WITH CHECK (auth.uid() = brand_id);

CREATE POLICY "Brands can update own gigs" ON gigs
  FOR UPDATE USING (auth.uid() = brand_id);

CREATE POLICY "Brands can delete own gigs" ON gigs
  FOR DELETE USING (auth.uid() = brand_id);

-- Submissions: Creators can view their own, brands can view submissions to their gigs
CREATE POLICY "Creators can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Brands can view submissions to their gigs" ON submissions
  FOR SELECT USING (
    auth.uid() IN (SELECT brand_id FROM gigs WHERE id = gig_id)
  );

CREATE POLICY "Creators can insert own submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own submissions" ON submissions
  FOR UPDATE USING (auth.uid() = creator_id AND status = 'pending');

-- Transactions: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    auth.uid() = brand_id OR auth.uid() = creator_id
  );

-- ============================================
-- Functions and Triggers
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON gigs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
