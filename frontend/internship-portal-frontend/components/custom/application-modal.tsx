'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Loader2, Upload, X } from 'lucide-react';

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
import { Input } from '@/components/ui/input';

import { applicationsApi } from '@/lib/api';
import { applicationSchema, type ApplicationFormData } from '@/lib/zod-schemas';
import { InternshipOfferDTO } from '@/types';

interface ApplicationModalProps {
  offer: InternshipOfferDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationModal({ offer, open, onOpenChange }: ApplicationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
    },
  });

  const applicationMutation = useMutation({
    mutationFn: (data: { formData: FormData }) => 
      applicationsApi.applyToOffer(offer.id, data.formData),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['student-applications'] });
      onOpenChange(false);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    if (!selectedFile) {
      toast.error('Please select a CV file');
      return;
    }

    const formData = new FormData();
    formData.append('cv', selectedFile);
    formData.append('applicationData', JSON.stringify(data));

    applicationMutation.mutate({ formData });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {offer.title}</DialogTitle>
          <DialogDescription>
            Submit your application to {offer.companyName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">CV Upload (PDF only)</label>
                <div className="mt-2">
                  {!selectedFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="cv-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload your CV
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PDF files only, max 10MB
                          </span>
                        </label>
                        <Input
                          id="cv-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your cover letter here... (minimum 50 characters)"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={applicationMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={applicationMutation.isPending || !selectedFile}
              >
                {applicationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
