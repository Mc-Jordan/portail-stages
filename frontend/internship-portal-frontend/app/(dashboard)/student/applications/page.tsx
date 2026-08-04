'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { applicationsApi } from '@/lib/api';
import { ApplicationStatus } from '@/types';
import { Loader2, FileText, Calendar, Building2 } from 'lucide-react';

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function StudentApplicationsPage() {
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['student-applications'],
    queryFn: () => applicationsApi.getStudentApplications(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your applications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load applications. Please try again.</p>
      </div>
    );
  }

  const applicationsData = applications?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your internship applications.
        </p>
      </div>

      {applicationsData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven&apos;t submitted any applications yet. Start by browsing available internships.
            </p>
            <Button asChild>
              <a href="/student/offers">Browse Internships</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {applicationsData.length} application{applicationsData.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid gap-4">
            {applicationsData.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{application.offerTitle}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {application.companyName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      Applied: {new Date(application.applicationDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      CV: {application.cvUrl}
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Cover Letter</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {application.feedback && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm mb-2">Company Feedback</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.feedback}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
