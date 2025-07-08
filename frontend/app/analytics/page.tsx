"use client";

import { Metadata } from "next";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap, 
  MapPin, 
  DollarSign,
  BarChart3,
  Award,
  Target,
  Globe
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { CompanyComparison } from "@/components/custom/companyComparison";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Color palette for charts
const COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', 
  '#6366F1', '#EC4899', '#84CC16', '#06B6D4', '#F97316'
];

interface AnalyticsOverview {
  total_reports: number;
  avg_salary: number;
  median_salary: number;
  top_paying_company: string;
  top_paying_company_avg: number;
  most_reported_company: string;
  most_reported_company_count: number;
  total_companies: number;
  total_universities: number;
  total_locations: number;
}

interface SalaryTrendData {
  year: number;
  avg_salary: number;
  median_salary: number;
  count: number;
}

interface CompanyStatsData {
  company: string;
  avg_salary: number;
  total_reports: number;
  salary_range_min: number;
  salary_range_max: number;
}

interface UniversityStatsData {
  university: string;
  avg_salary: number;
  total_reports: number;
}

interface LocationStatsData {
  location: string;
  avg_salary: number;
  total_reports: number;
}

interface RoleStatsData {
  role: string;
  avg_salary: number;
  total_reports: number;
}

interface SalaryDistributionData {
  salary_range: string;
  count: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [salaryTrends, setSalaryTrends] = useState<SalaryTrendData[]>([]);
  const [topCompanies, setTopCompanies] = useState<CompanyStatsData[]>([]);
  const [topUniversities, setTopUniversities] = useState<UniversityStatsData[]>([]);
  const [topLocations, setTopLocations] = useState<LocationStatsData[]>([]);
  const [topRoles, setTopRoles] = useState<RoleStatsData[]>([]);
  const [salaryDistribution, setSalaryDistribution] = useState<SalaryDistributionData[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          overviewRes,
          trendsRes,
          companiesRes,
          universitiesRes,
          locationsRes,
          rolesRes,
          distributionRes
        ] = await Promise.all([
          fetch(`${BACKEND_URL}/analytics/overview`),
          fetch(`${BACKEND_URL}/analytics/salary-trends`),
          fetch(`${BACKEND_URL}/analytics/top-companies?limit=10`),
          fetch(`${BACKEND_URL}/analytics/top-universities?limit=8`),
          fetch(`${BACKEND_URL}/analytics/top-locations?limit=8`),
          fetch(`${BACKEND_URL}/analytics/top-roles?limit=8`),
          fetch(`${BACKEND_URL}/analytics/salary-distribution`)
        ]);

        if (!overviewRes.ok || !trendsRes.ok || !companiesRes.ok || 
            !universitiesRes.ok || !locationsRes.ok || !rolesRes.ok || !distributionRes.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const [
          overviewData,
          trendsData,
          companiesData,
          universitiesData,
          locationsData,
          rolesData,
          distributionData
        ] = await Promise.all([
          overviewRes.json(),
          trendsRes.json(),
          companiesRes.json(),
          universitiesRes.json(),
          locationsRes.json(),
          rolesRes.json(),
          distributionRes.json()
        ]);

        setOverview(overviewData);
        setSalaryTrends(trendsData);
        setTopCompanies(companiesData);
        setTopUniversities(universitiesData);
        setTopLocations(locationsData);
        setTopRoles(rolesData);
        setSalaryDistribution(distributionData);

      } catch (error: unknown) {
        console.error("Error fetching analytics data:", error);
        setError(error instanceof Error ? error.message : "An error occurred while fetching analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button 
              onClick={() => router.push('/')}
              variant="ghost"
              className="mb-6 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-4">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse max-w-md mx-auto"></div>
            </div>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Button 
              onClick={() => router.push('/')}
              variant="ghost"
              className="mb-6 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="text-red-800 font-semibold mb-2">Unable to Load Analytics</div>
              <div className="text-red-600">{error}</div>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.push('/')}
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics Dashboard
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Salary Insights & Analytics
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive analysis of internship salary data across Canadian companies, universities, and locations.
            </p>
          </div>
        </div>

        {/* Overview Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Median Salary</CardTitle>
                <Target className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${overview.median_salary.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Per hour (CAD)</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Average Salary</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${overview.avg_salary.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Per hour (CAD)</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Companies</CardTitle>
                <Building2 className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {overview.total_companies}
                </div>
                <div className="text-xs text-gray-500 mt-1">Hiring interns</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Key Insights Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Top Paying Company</CardTitle>
                <Award className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {overview.top_paying_company}
                </div>
                <div className="text-lg font-semibold text-green-600">
                  ${overview.top_paying_company_avg.toFixed(2)}/hr avg
                </div>
                <div className="text-xs text-gray-500 mt-1">Based on companies with 3+ reports</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200/50 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Most Reported Company</CardTitle>
                <Target className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {overview.most_reported_company}
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {overview.most_reported_company_count} reports
                </div>
                <div className="text-xs text-gray-500 mt-1">Most data submissions</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="space-y-8">
          
          {/* Salary Trends Over Time */}
          {salaryTrends.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Salary Trends Over Time
                </CardTitle>
                <p className="text-gray-600 text-sm">Average and median salary progression by year</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salaryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value.toFixed(2)}`, 
                        name === 'avg_salary' ? 'Average Salary' : 'Median Salary'
                      ]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avg_salary" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Average Salary"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="median_salary" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Median Salary"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Companies */}
          {topCompanies.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Top Paying Companies
                </CardTitle>
                <p className="text-gray-600 text-sm">Companies with highest average salaries (minimum 2 reports)</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topCompanies}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="company" 
                      stroke="#666" 
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Average Salary']}
                      labelFormatter={(label) => `Company: ${label}`}
                    />
                    <Bar dataKey="avg_salary" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Salary Distribution */}
          {salaryDistribution.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Salary Distribution
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Number of reports by salary range</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salaryDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="salary_range" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          value, 
                          name === 'count' ? 'Reports' : 'Percentage'
                        ]}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Distribution Breakdown
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Percentage breakdown of salary ranges</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={salaryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ salary_range, percentage }) => 
                          percentage > 5 ? `${salary_range}: ${percentage}%` : ''
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {salaryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Universities and Locations */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {topLocations.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Top Locations
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Cities with highest average salaries</p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={topLocations}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="location" 
                        stroke="#666" 
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                        fontSize={12}
                        width={120}
                      />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Average Salary']}
                      />
                      <Bar dataKey="avg_salary" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Top Roles */}
          {/* {topRoles.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Top Paying Roles
                </CardTitle>
                <p className="text-gray-600 text-sm">Internship roles with highest average salaries</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topRoles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="role" 
                      stroke="#666" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Average Salary']}
                    />
                    <Bar dataKey="avg_salary" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )} */}
        </div>

        {/* Company Comparison Tool */}
        <CompanyComparison />

        
      </div>
    </div>
  );
}
