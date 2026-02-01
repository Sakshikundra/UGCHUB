import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const status = {
      vars: {
        NEXT_PUBLIC_SUPABASE_URL: url ? '✅ Set' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: anon ? '✅ Set (' + anon.substring(0, 5) + '...)' : '❌ Missing',
        SUPABASE_SERVICE_ROLE_KEY: service ? '✅ Set (' + service.substring(0, 5) + '...)' : '❌ Missing',
      },
      connection: 'Pending',
      error: null
    };

    if (!url || !service) {
      status.connection = '❌ Failed (Missing Keys)';
      return NextResponse.json(status);
    }

    // Try connection
    try {
      const supabase = createClient(url, service);
      const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
      
      if (error) {
        status.connection = '❌ Supabase Error';
        status.error = error.message || error;
      } else {
        status.connection = '✅ Success';
        status.userCount = count;
      }
    } catch (connErr) {
      status.connection = '❌ Connection Exception';
      status.error = connErr.message;
    }

    return NextResponse.json(status);

  } catch (err) {
    return NextResponse.json({ error: 'Critical Debug Error', details: err.message });
  }
}
