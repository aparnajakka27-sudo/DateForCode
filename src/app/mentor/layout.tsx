import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="mentor">
      {children}
    </ProtectedRoute>
  );
}
