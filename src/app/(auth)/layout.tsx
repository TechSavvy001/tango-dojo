// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="w-full max-w-4xl p-6">
        {children}
      </main>
    </div>
  )
}
