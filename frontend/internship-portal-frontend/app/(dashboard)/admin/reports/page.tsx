'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function AdminReportsPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await adminApi.downloadReport();
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'internships-by-field-report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to download report';
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download comprehensive reports about platform activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Internships by Field
            </CardTitle>
            <CardDescription>
              Excel report showing all validated internships organized by field of study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>This report includes:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Student information</li>
                  <li>Company details</li>
                  <li>Internship positions</li>
                  <li>Agreement status</li>
                  <li>Field of study breakdown</li>
                </ul>
              </div>
              <Button 
                onClick={downloadReport} 
                disabled={isDownloading}
                className="w-full"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Excel Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future reports */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              User Activity Report
            </CardTitle>
            <CardDescription>
              Detailed analysis of user engagement and platform usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Coming soon...</p>
              </div>
              <Button disabled className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Not Available
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Company Performance
            </CardTitle>
            <CardDescription>
              Analysis of company hiring patterns and success rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Coming soon...</p>
              </div>
              <Button disabled className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Not Available
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Information */}
      <Card>
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
          <CardDescription>
            Important details about generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Data Freshness</h4>
              <p className="text-sm text-muted-foreground">
                All reports are generated in real-time using the latest data from the platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">File Formats</h4>
              <p className="text-sm text-muted-foreground">
                Reports are available in Excel (.xlsx) format for easy analysis and sharing.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Privacy & Security</h4>
              <p className="text-sm text-muted-foreground">
                All reports comply with data privacy regulations. Personal information is included only where necessary for administrative purposes.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Support</h4>
              <p className="text-sm text-muted-foreground">
                If you encounter any issues with report generation, please contact the system administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
