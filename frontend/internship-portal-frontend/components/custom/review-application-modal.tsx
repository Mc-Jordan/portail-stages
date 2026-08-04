'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Loader2, Download, User, GraduationCap, Calendar } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { applicationsApi } from '@/lib/api';
import { updateApplicationStatusSchema, type UpdateApplicationStatusFormData } from '@/lib/zod-schemas';
import { ApplicationDTO } from '@/types';

interface ReviewApplicationModalProps {
  application: ApplicationDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewApplicationModal({ 
  application, 
  open, 
  onOpenChange 
}: ReviewApplicationModalProps) {
  const [decision, setDecision] = useState<'ACCEPTED' | 'REJECTED' | ''>('');
  const queryClient = useQueryClient();

  const form = useForm<UpdateApplicationStatusFormData>({
    resolver: zodResolver(updateApplicationStatusSchema),
    defaultValues: {
      status: 'ACCEPTED',
      feedback: '',
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateApplicationStatusFormData) =>
      applicationsApi.updateApplicationStatus(application.id, data),
    onSuccess: () => {
      toast.success('Application status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['offer-applications'] });
      onOpenChange(false);
      form.reset();
      setDecision('');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update application status';
      toast.error(message);
    },
  });

  const onSubmit = (data: UpdateApplicationStatusFormData) => {
    updateStatusMutation.mutate(data);
  };

  const downloadCV = () => {
    // In a real app, this would download the CV file
    window.open(`/api/files/${application.cvUrl}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Application</DialogTitle>
          <DialogDescription>
            Review {application.studentName}&apos;s application for {application.offerTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{application.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{application.studentEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Field of Study</p>
                  <p className="text-sm text-muted-foreground">{application.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">University</p>
                  <p className="text-sm text-muted-foreground">{application.university}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Expected Graduation</p>
                  <p className="text-sm text-muted-foreground">{application.expectedGraduationYear}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Application Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CV Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CV Document</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadCV} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download CV ({application.cvUrl})
              </Button>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </CardContent>
          </Card>

          {/* Decision Form */}
          {application.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Make Decision</CardTitle>
                <CardDescription>
                  Accept or reject this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decision</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                setDecision(value as 'ACCEPTED' | 'REJECTED');
                              }}
                              value={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ACCEPTED" id="accepted" />
                                <Label htmlFor="accepted" className="text-green-600 font-medium">
                                  Accept Application
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="REJECTED" id="rejected" />
                                <Label htmlFor="rejected" className="text-red-600 font-medium">
                                  Reject Application
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
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Feedback {decision === 'REJECTED' ? '(Required)' : '(Optional)'}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                decision === 'ACCEPTED'
                                  ? "Congratulations! We're excited to have you join our team..."
                                  : decision === 'REJECTED'
                                  ? "Thank you for your interest. Unfortunately..."
                                  : "Provide feedback to the student..."
                              }
                              className="min-h-[100px]"
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
                        disabled={updateStatusMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateStatusMutation.isPending || !decision}
                        className={decision === 'ACCEPTED' ? 'bg-green-600 hover:bg-green-700' : 
                                 decision === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        {updateStatusMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {decision === 'ACCEPTED' ? 'Accept Application' : 
                         decision === 'REJECTED' ? 'Reject Application' : 'Submit Decision'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Current Status */}
          {application.status !== 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge 
                    variant={application.status === 'ACCEPTED' ? 'default' : 'destructive'}
                  >
                    {application.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Decision already made
                  </span>
                </div>
                {application.feedback && (
                  <div>
                    <p className="text-sm font-medium mb-2">Feedback provided:</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">{application.feedback}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
