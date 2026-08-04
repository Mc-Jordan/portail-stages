'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { offersApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Users, Eye, Loader2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function CompanyOffersPage() {
  const queryClient = useQueryClient();

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ['company-offers'],
    queryFn: () => offersApi.getCompanyOffers(),
  });

  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      offersApi.updateOffer(id, data),
    onSuccess: () => {
      toast.success('Offer updated successfully');
      queryClient.invalidateQueries({ queryKey: ['company-offers'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update offer');
    },
  });

  const toggleOfferStatus = (offerId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    
    // We need to get the full offer data to update it
    const offer = offers?.data.find(o => o.id === offerId);
    if (!offer) return;

    const updatedOffer = {
      title: offer.title,
      description: offer.description,
      requiredSkills: offer.requiredSkills,
      domain: offer.domain,
      location: offer.location,
      durationInMonths: offer.durationInMonths,
      startDate: offer.startDate,
      status: newStatus,
    };

    updateOfferMutation.mutate({ id: offerId, data: updatedOffer });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your offers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load offers. Please try again.</p>
      </div>
    );
  }

  const offersData = offers?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Offers</h1>
          <p className="text-muted-foreground">
            Create and manage your internship postings.
          </p>
        </div>
        <Button asChild>
          <Link href="/company/offers/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Offer
          </Link>
        </Button>
      </div>

      {offersData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Offers Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven&apos;t created any internship offers yet. Start by creating your first offer.
            </p>
            <Button asChild>
              <Link href="/company/offers/new">Create Your First Offer</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Offers</CardTitle>
            <CardDescription>
              {offersData.length} offer{offersData.length !== 1 ? 's' : ''} created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offersData.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{offer.title}</p>
                        <p className="text-sm text-muted-foreground">{offer.domain}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={offer.status === 'OPEN' ? 'default' : 'secondary'}>
                        {offer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{offer.location}</TableCell>
                    <TableCell>{offer.durationInMonths} months</TableCell>
                    <TableCell>
                      {new Date(offer.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/company/applications/offer/${offer.id}`}>
                          <Users className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/company/offers/edit/${offer.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/company/applications/offer/${offer.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Applications
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleOfferStatus(offer.id, offer.status)}
                            disabled={updateOfferMutation.isPending}
                          >
                            {offer.status === 'OPEN' ? 'Close Offer' : 'Reopen Offer'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
