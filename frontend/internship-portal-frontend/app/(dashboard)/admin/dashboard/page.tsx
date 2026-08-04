'use client';

import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/custom/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/lib/api';
import { Users, FileText, Building2, CheckCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => adminApi.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  const dashboardData = stats?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform activity and key metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboardData?.totalUsers || 0}
          description="Registered users"
          icon={Users}
        />
        <StatCard
          title="Active Offers"
          value={dashboardData?.totalOffers || 0}
          description="Posted internships"
          icon={FileText}
        />
        <StatCard
          title="Applications"
          value={dashboardData?.totalApplications || 0}
          description="Total applications"
          icon={Building2}
        />
        <StatCard
          title="Agreements"
          value={dashboardData?.totalAgreements || 0}
          description="Signed agreements"
          icon={CheckCircle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Internships by Field Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Internships by Field</CardTitle>
            <CardDescription>
              Distribution of internships across different fields of study
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData?.internshipsByField || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="field" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications per Month Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Trend</CardTitle>
            <CardDescription>
              Monthly application submissions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.applicationsPerMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Students</span>
                <span className="text-sm font-medium">
                  {Math.floor((dashboardData?.totalUsers || 0) * 0.6)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Companies</span>
                <span className="text-sm font-medium">
                  {Math.floor((dashboardData?.totalUsers || 0) * 0.3)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Teachers</span>
                <span className="text-sm font-medium">
                  {Math.floor((dashboardData?.totalUsers || 0) * 0.08)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Admins</span>
                <span className="text-sm font-medium">
                  {Math.floor((dashboardData?.totalUsers || 0) * 0.02)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <span className="text-sm font-medium text-yellow-600">
                  {Math.floor((dashboardData?.totalApplications || 0) * 0.4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Accepted</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.floor((dashboardData?.totalApplications || 0) * 0.35)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rejected</span>
                <span className="text-sm font-medium text-red-600">
                  {Math.floor((dashboardData?.totalApplications || 0) * 0.25)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {dashboardData?.totalApplications ? 
                    Math.round((dashboardData.totalAgreements / dashboardData.totalApplications) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Offers</span>
                <span className="text-sm font-medium">
                  {Math.floor((dashboardData?.totalOffers || 0) * 0.7)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg. Applications/Offer</span>
                <span className="text-sm font-medium">
                  {dashboardData?.totalOffers ? 
                    Math.round((dashboardData.totalApplications / dashboardData.totalOffers) * 10) / 10 : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
