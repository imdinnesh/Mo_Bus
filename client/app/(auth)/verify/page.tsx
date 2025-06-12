import { VerifyForm } from "@/components/verify-form";

import { Suspense } from 'react';
export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
      <div>
        <VerifyForm />
      </div>
      </Suspense>
    </div>
  )
}
