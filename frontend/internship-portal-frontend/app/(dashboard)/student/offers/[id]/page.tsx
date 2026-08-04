'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplicationModal } from '@/components/custom/application-modal';
import { offersApi } from '@/lib/api';
import { MapPin, Calendar, Clock, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
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
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const offerData = offer.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/student/offers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Offers
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{offerData.title}</CardTitle>
                  <CardDescription className="flex items-center text-lg">
                    <Building2 className="h-5 w-5 mr-2" />
                    {offerData.companyName}
                  </CardDescription>
                </div>
                <Badge variant={offerData.status === 'OPEN' ? 'default' : 'secondary'}>
                  {offerData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {offerData.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {offerData.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{offerData.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{offerData.durationInMonths} months</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Starts: {new Date(offerData.startDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Domain: </span>
                <span className="text-sm text-muted-foreground">{offerData.domain}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Posted: </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(offerData.createdDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
              <CardDescription>
                Submit your application for this internship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => setShowApplicationModal(true)}
                disabled={offerData.status !== 'OPEN'}
              >
                {offerData.status === 'OPEN' ? 'Apply for this Position' : 'Position Closed'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ApplicationModal
        offer={offerData}
        open={showApplicationModal}
        onOpenChange={setShowApplicationModal}
      />
    </div>
  );
}
