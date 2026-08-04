import { Suspense } from 'react';
import AdminLoginClient from './login-client';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-shell min-h-screen bg-[var(--admin-bg)]" />}>
      <AdminLoginClient />
    </Suspense>
  );
}
