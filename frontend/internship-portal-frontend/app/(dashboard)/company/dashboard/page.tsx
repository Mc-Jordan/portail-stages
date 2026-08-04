'use client';

import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/custom/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { offersApi, applicationsApi } from '@/lib/api';
import { FileText, Users, Clock, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboardPage() {
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ['company-offers'],
    queryFn: () => offersApi.getCompanyOffers(),
  });

  // Get recent applications for all company offers
  const { data: recentApplications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['recent-applications'],
    queryFn: async () => {
      if (!offers?.data?.length) return [];
      
      // Get applications for the first few offers (to avoid too many API calls)
      const applicationPromises = offers.data.slice(0, 3).map(offer => 
        applicationsApi.getOfferApplications(offer.id)
      );
      
      const results = await Promise.all(applicationPromises);
      return results.flatMap(result => result.data).slice(0, 5);
    },
    enabled: !!offers?.data?.length,
  });

  const offersData = offers?.data || [];
  const openOffers = offersData.filter(offer => offer.status === 'OPEN');
  const totalApplications = recentApplications?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your internship offers and track applications.
          </p>
        </div>
        <Button asChild>
          <Link href="/company/offers/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Offer
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Offers"
          value={offersData.length}
          description="All internship offers"
          icon={FileText}
        />
        <StatCard
          title="Open Offers"
          value={openOffers.length}
          description="Currently accepting applications"
          icon={Clock}
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          description="Applications received"
          icon={Users}
        />
        <StatCard
          title="This Week"
          value={Math.floor(totalApplications * 0.3)} // Mock data
          description="New applications"
          icon={Users}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Offers</CardTitle>
            <CardDescription>
              Your latest internship postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : offersData.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No offers posted yet</p>
                <Button asChild size="sm">
                  <Link href="/company/offers/new">Create Your First Offer</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {offersData.slice(0, 5).map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{offer.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {offer.location} • {offer.durationInMonths} months
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={offer.status === 'OPEN' ? 'default' : 'secondary'}>
                        {offer.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {offersData.length > 5 && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/company/offers">View All Offers</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest applications to your offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : !recentApplications || recentApplications.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{application.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied to: {application.offerTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        application.status === 'PENDING' ? 'secondary' :
                        application.status === 'ACCEPTED' ? 'default' : 'destructive'
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
