'use client';

import { OfferForm } from '@/components/custom/offer-form';

export default function CreateOfferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Offer</h1>
        <p className="text-muted-foreground">
          Post a new internship opportunity for students.
        </p>
      </div>
      
      <OfferForm />
    </div>
  );
}
