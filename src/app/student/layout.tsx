import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute role="student">
      {children}
    </ProtectedRoute>
  );
}
