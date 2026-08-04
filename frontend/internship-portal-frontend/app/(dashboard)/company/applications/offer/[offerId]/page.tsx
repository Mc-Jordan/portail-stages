'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReviewApplicationModal } from '@/components/custom/review-application-modal';
import { ChatModal } from '@/components/custom/chat-modal';
import { applicationsApi, offersApi } from '@/lib/api';
import { ApplicationDTO } from '@/types';
import { Loader2, ArrowLeft, User, Calendar, FileText, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const getStatusColor = (status: string) => {
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

export default function OfferApplicationsPage() {
  const params = useParams();
  const offerId = parseInt(params.offerId as string);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDTO | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [chatApplication, setChatApplication] = useState<ApplicationDTO | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  const { data: offer, isLoading: offerLoading } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => offersApi.getOffer(offerId),
    enabled: !!offerId,
  });

  const { data: applications, isLoading: applicationsLoading, error } = useQuery({
    queryKey: ['offer-applications', offerId],
    queryFn: () => applicationsApi.getOfferApplications(offerId),
    enabled: !!offerId,
  });

  const handleReviewApplication = (application: ApplicationDTO) => {
    setSelectedApplication(application);
    setShowReviewModal(true);
  };

  const handleChatWithStudent = (application: ApplicationDTO) => {
    setChatApplication(application);
    setShowChatModal(true);
  };

  if (offerLoading || applicationsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading applications...</span>
      </div>
    );
  }

  if (error || !applications?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load applications. Please try again.</p>
      </div>
    );
  }

  const applicationsData = applications.data;
  const offerData = offer?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/company/offers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Offers
          </Link>
        </Button>
      </div>

      {offerData && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications for {offerData.title}</h1>
          <p className="text-muted-foreground">
            Review and manage applications for this internship offer.
          </p>
        </div>
      )}

      {applicationsData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground text-center">
              No students have applied for this position yet. Applications will appear here once submitted.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {applicationsData.length} application{applicationsData.length !== 1 ? 's' : ''} received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Field of Study</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicationsData.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.studentName}</p>
                        <p className="text-sm text-muted-foreground">{application.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{application.university}</TableCell>
                    <TableCell>{application.fieldOfStudy}</TableCell>
                    <TableCell>
                      {new Date(application.applicationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReviewApplication(application)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChatWithStudent(application)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedApplication && (
        <ReviewApplicationModal
          application={selectedApplication}
          open={showReviewModal}
          onOpenChange={(open) => {
            setShowReviewModal(open);
            if (!open) setSelectedApplication(null);
          }}
        />
      )}

      {chatApplication && (
        <ChatModal
          open={showChatModal}
          onOpenChange={(open) => {
            setShowChatModal(open);
            if (!open) setChatApplication(null);
          }}
          companyId={chatApplication.companyId}
          studentId={chatApplication.studentId}
          companyName={offerData?.companyName || 'Company'}
          studentName={chatApplication.studentName}
        />
      )}
    </div>
  );
}
