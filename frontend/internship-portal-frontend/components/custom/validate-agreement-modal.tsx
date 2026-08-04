'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Loader2, Download, User, Building2, FileText } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { agreementsApi } from '@/lib/api';
import { validateAgreementSchema, type ValidateAgreementFormData } from '@/lib/zod-schemas';
import { AgreementDTO } from '@/types';

interface ValidateAgreementModalProps {
  agreement: AgreementDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ValidateAgreementModal({ 
  agreement, 
  open, 
  onOpenChange 
}: ValidateAgreementModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<ValidateAgreementFormData>({
    resolver: zodResolver(validateAgreementSchema),
    defaultValues: {
      decision: 'VALIDATED',
      comments: '',
    },
  });

  const validateMutation = useMutation({
    mutationFn: (data: ValidateAgreementFormData) =>
      agreementsApi.validateAgreement(agreement.id, data),
    onSuccess: () => {
      toast.success('Agreement validation submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['pending-agreements'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to validate agreement';
      toast.error(message);
    },
  });

  const onSubmit = (data: ValidateAgreementFormData) => {
    validateMutation.mutate(data);
  };

  const downloadAgreement = () => {
    agreementsApi.downloadAgreement(agreement.id)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `agreement_${agreement.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast.error('Failed to download agreement');
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validate Internship Agreement</DialogTitle>
          <DialogDescription>
            Review and validate the internship agreement between {agreement.studentName} and {agreement.companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agreement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2" />
                Agreement Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-sm text-muted-foreground">{agreement.studentName}</p>
                  <p className="text-xs text-muted-foreground">{agreement.studentEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">{agreement.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Position</p>
                  <p className="text-sm text-muted-foreground">{agreement.offerTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Generated Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(agreement.generationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Field of Study</p>
                    <p className="text-sm text-muted-foreground">{agreement.fieldOfStudy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">University</p>
                    <p className="text-sm text-muted-foreground">{agreement.university}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected Graduation</p>
                    <p className="text-sm text-muted-foreground">{agreement.expectedGraduationYear}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Status</p>
                    <Badge variant="secondary">{agreement.status}</Badge>
                  </div>
                  <Button onClick={downloadAgreement} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Form */}
          {agreement.status === 'PENDING_TEACHER_VALIDATION' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation Decision</CardTitle>
                <CardDescription>
                  Review the agreement and provide your validation decision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="decision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decision</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="VALIDATED" id="validated" />
                                <Label htmlFor="validated" className="text-green-600 font-medium">
                                  Validate Agreement
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="REJECTED_BY_TEACHER" id="rejected" />
                                <Label htmlFor="rejected" className="text-red-600 font-medium">
                                  Reject Agreement
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments (Required)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide detailed comments about your validation decision..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={validateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={validateMutation.isPending}
                        className={form.watch('decision') === 'VALIDATED' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'}
                      >
                        {validateMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit Validation
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Already Validated */}
          {agreement.status !== 'PENDING_TEACHER_VALIDATION' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={agreement.status === 'VALIDATED' ? 'default' : 'destructive'}
                    >
                      {agreement.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {agreement.validatingTeacherName && `Validated by ${agreement.validatingTeacherName}`}
                    </span>
                  </div>
                  {agreement.teacherComments && (
                    <div>
                      <p className="text-sm font-medium mb-2">Teacher Comments:</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{agreement.teacherComments}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
