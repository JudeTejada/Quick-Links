import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '../ui/button';

export function Page404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e7d2] via-[#e2f0de] to-[#c7dcc5] p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        <div className="rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5">
          <p className="text-sm text-slate-600">You bumped in a 404 page.</p>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
