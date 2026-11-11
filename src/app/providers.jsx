import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { seedDatabase } from '@/database/seeders/initialSeed';
import { useAuthStore } from '@/stores/authStore';

export function Providers({ children }) {
  const [isReady, setIsReady] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    async function setup() {
      try {
        await seedDatabase();
        await initAuth();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsReady(true);
      }
    }
    setup();
  }, [initAuth]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-neutral-800">Menyiapkan GearFlow Local Database...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
