"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyTable } from "@/components/custom/companyTable";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Building2, DollarSign, GraduationCap, MapPin, ArrowLeft, TrendingUp } from "lucide-react";


export default function Company() {
  const router = useRouter()

  const params = useParams();
  const { companyName } = params;
  const [decodedCompanyName, setDecodedCompanyName] = useState("");
  const [companyRecords, setCompanyRecords] = useState([]);
  const [averageSalary, setAverageSalary] = useState(0.0);
  const [topUniversity, setTopUniversity] = useState("");
  const [topLocation, setTopLocation] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Decode the companyName from URL encoding when it becomes available or changes
  useEffect(() => {
    if (companyName) {
      const safeCompanyName = Array.isArray(companyName)
        ? companyName[0]
        : companyName;
      try {
        const decoded = decodeURIComponent(safeCompanyName);
        setDecodedCompanyName(decoded);
      } catch (error) {
        console.error("Error decoding companyName:", error);
        setDecodedCompanyName(safeCompanyName);
      }
    }
  }, [companyName]);

  // Fetch company data from API when decodedCompanyName changes
  useEffect(() => {
    if (!decodedCompanyName) return;

    const fetchCompanyData = async (decodedCompanyName: string) => {
      try {
        setLoading(true); 
        setError(null); 

        const [allSalariesRes, averageSalariesRes, topLocationRes, topUniversityRes] = await Promise.all([
          fetch(`${BACKEND_URL}/company/all-salaries?company=${decodedCompanyName}`),
          fetch(`${BACKEND_URL}/company/average-salary?company=${decodedCompanyName}`),
          fetch(`${BACKEND_URL}/company/top-location?company=${decodedCompanyName}`),
          fetch(`${BACKEND_URL}/company/top-university?company=${decodedCompanyName}`),
        ]);

        // Check if any response failed and immediately throw an error
        if (!allSalariesRes.ok || !averageSalariesRes.ok || !topLocationRes.ok || !topUniversityRes.ok) {
          throw new Error("Company not found or data unavailable");
        }

        const [salariesData, averageSalaryData, topLocationData, topUniversityData] = await Promise.all([
          allSalariesRes.json(),
          averageSalariesRes.json(),
          topLocationRes.json(),
          topUniversityRes.json(),
        ]);

        setCompanyRecords(salariesData);
        setAverageSalary(averageSalaryData);
        setTopLocation(topLocationData);
        setTopUniversity(topUniversityData);
      } catch (error: unknown) {
        console.error("Error fetching company data:", error);
        setError(error instanceof Error ? error.message : "An error occurred while fetching data");
      } finally {
        setLoading(false); 
      }
    };

    fetchCompanyData(decodedCompanyName);
  }, [decodedCompanyName]);

  if (loading) {
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
                <Building2 className="w-4 h-4 mr-2" />
                Company Profile
              </div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse max-w-md mx-auto"></div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Average Salary</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Top University</CardTitle>
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Top Location</CardTitle>
                <MapPin className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <CompanyTable companyRecords={[]} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Company Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't find salary data for this company. Please check the spelling or try searching for a different company.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
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
              <Building2 className="w-4 h-4 mr-2" />
              Company Profile
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              {decodedCompanyName}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Internship salary insights and trends
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">Average Salary</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {averageSalary.toLocaleString("en-US", { style: "currency", currency: "CAD" })}
              </div>
              <div className="text-xs text-gray-500 mt-1">Per hour</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">Top University</CardTitle>
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-gray-900 leading-tight">
                {topUniversity}
              </div>
              <div className="text-xs text-gray-500 mt-1">Most represented</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600">Top Location</CardTitle>
              <MapPin className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-gray-900 leading-tight">
                {topLocation}
              </div>
              <div className="text-xs text-gray-500 mt-1">Primary office location</div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="mb-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Salary Reports</h2>
            <p className="text-gray-600">Individual salary data from students</p>
          </div>
          <CompanyTable companyRecords={companyRecords} />
        </div>
      </div>
    </div>
  );
}