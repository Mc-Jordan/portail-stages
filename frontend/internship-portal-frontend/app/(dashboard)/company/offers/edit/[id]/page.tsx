'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { OfferForm } from '@/components/custom/offer-form';
import { offersApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function EditOfferPage() {
  const params = useParams();
  const offerId = parseInt(params.id as string);

  const { data: offer, isLoading, error } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offersApi.getOffer(offerId),
    enabled: !!offerId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading offer details...</span>
      </div>
    );
  }

  if (error || !offer?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load offer details. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Offer</h1>
        <p className="text-muted-foreground">
          Update the details of your internship offer.
        </p>
      </div>
      
      <OfferForm initialData={offer.data} isEditing />
    </div>
  );
}
