'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OfferCard } from '@/components/custom/offer-card';
import { OfferSearchFilters } from '@/components/custom/offer-search-filters';
import { offersApi } from '@/lib/api';
import { OfferFiltersFormData } from '@/lib/zod-schemas';
import { Loader2 } from 'lucide-react';

export default function StudentOffersPage() {
  const [filters, setFilters] = useState<OfferFiltersFormData>({});

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['offers', filters],
    queryFn: () => offersApi.getOffers(filters),
  });

  const handleFiltersChange = (newFilters: OfferFiltersFormData) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Internships</h1>
        <p className="text-muted-foreground">
          Discover internship opportunities that match your skills and interests.
        </p>
      </div>

      <OfferSearchFilters 
        onFiltersChange={handleFiltersChange} 
        isLoading={isLoading}
      />

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading offers...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load offers. Please try again.</p>
        </div>
      )}

      {offers?.data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {offers.data.length} offer{offers.data.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {offers.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No offers match your search criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers.data.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
