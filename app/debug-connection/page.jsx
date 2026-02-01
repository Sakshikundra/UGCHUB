'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DebugPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  async function runCheck() {
    setLoading(true);
    try {
      const res = await fetch('/api/debug');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to fetch debug API' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-500">Connection Debugger</h1>
      
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <p>Running checks...</p>}
          
          {result && (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-400">Environment Variables</h3>
                <div className="bg-black p-3 rounded text-sm font-mono">
                  <p>URL: {result.vars?.NEXT_PUBLIC_SUPABASE_URL}</p>
                  <p>ANON: {result.vars?.NEXT_PUBLIC_SUPABASE_ANON_KEY}</p>
                  <p>SERVICE: {result.vars?.SUPABASE_SERVICE_ROLE_KEY}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-400">Database Connection</h3>
                <div className={`p-3 rounded text-lg font-bold ${result.connection?.includes('Success') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                  {result.connection}
                </div>
                {result.error && (
                  <div className="bg-red-950 p-3 rounded text-sm text-red-300 border border-red-800">
                    Error Detail: {JSON.stringify(result.error)}
                  </div>
                )}
                {result.userCount !== undefined && (
                   <p className="text-sm text-gray-400">Users found in DB: {result.userCount}</p>
                )}
              </div>
            </>
          )}

          <Button onClick={runCheck} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
            Re-run Check
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
