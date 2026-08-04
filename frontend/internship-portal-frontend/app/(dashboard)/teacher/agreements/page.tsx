'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ValidateAgreementModal } from '@/components/custom/validate-agreement-modal';
import { agreementsApi } from '@/lib/api';
import { AgreementDTO } from '@/types';
import { Loader2, CheckCircle, User, Building2, Calendar } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING_TEACHER_VALIDATION':
      return 'bg-yellow-100 text-yellow-800';
    case 'VALIDATED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED_BY_TEACHER':
      return 'bg-red-100 text-red-800';
    case 'FINAL_APPROVED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function TeacherAgreementsPage() {
  const [selectedAgreement, setSelectedAgreement] = useState<AgreementDTO | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const { data: agreements, isLoading, error } = useQuery({
    queryKey: ['pending-agreements'],
    queryFn: () => agreementsApi.getPendingAgreements(),
  });

  const handleValidateAgreement = (agreement: AgreementDTO) => {
    setSelectedAgreement(agreement);
    setShowValidationModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading agreements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load agreements. Please try again.</p>
      </div>
    );
  }

  const agreementsData = agreements?.data || [];
  const pendingAgreements = agreementsData.filter(
    agreement => agreement.status === 'PENDING_TEACHER_VALIDATION'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Validate Agreements</h1>
        <p className="text-muted-foreground">
          Review and validate internship agreements between students and companies.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Validation</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAgreements.length}</div>
            <p className="text-xs text-muted-foreground">
              Agreements awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agreementsData.length}</div>
            <p className="text-xs text-muted-foreground">
              All agreements in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validated</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agreementsData.filter(a => a.status === 'VALIDATED').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully validated
            </p>
          </CardContent>
        </Card>
      </div>

      {agreementsData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Agreements Yet</h3>
            <p className="text-muted-foreground text-center">
              No internship agreements have been generated yet. Agreements will appear here once students are accepted by companies.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Internship Agreements</CardTitle>
            <CardDescription>
              {agreementsData.length} agreement{agreementsData.length !== 1 ? 's' : ''} in total
              {pendingAgreements.length > 0 && (
                <span className="text-yellow-600 font-medium">
                  {' • '}{pendingAgreements.length} pending validation
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreementsData.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{agreement.studentName}</p>
                        <p className="text-sm text-muted-foreground">{agreement.studentEmail}</p>
                        <p className="text-xs text-muted-foreground">
                          {agreement.fieldOfStudy} • {agreement.university}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                        {agreement.companyName}
                      </div>
                    </TableCell>
                    <TableCell>{agreement.offerTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {new Date(agreement.generationDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(agreement.status)}>
                        {agreement.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleValidateAgreement(agreement)}
                        variant={agreement.status === 'PENDING_TEACHER_VALIDATION' ? 'default' : 'outline'}
                      >
                        {agreement.status === 'PENDING_TEACHER_VALIDATION' ? 'Review' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedAgreement && (
        <ValidateAgreementModal
          agreement={selectedAgreement}
          open={showValidationModal}
          onOpenChange={(open) => {
            setShowValidationModal(open);
            if (!open) setSelectedAgreement(null);
          }}
        />
      )}
    </div>
  );
}
