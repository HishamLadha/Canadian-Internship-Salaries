"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationTable } from "@/components/custom/locationTable";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MapPin, DollarSign, GraduationCap, Building2, ArrowLeft } from "lucide-react";


export default function Location() {
  const router = useRouter()

  const params = useParams();
  const { locationName } = params;
  const [decodedLocationName, setDecodedLocationName] = useState("");
  const [locationRecords, setLocationRecords] = useState([]);
  const [averageSalary, setAverageSalary] = useState(0.0);
  const [topUniversity, setTopUniversity] = useState("");
  const [topCompany, setTopCompany] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Decode the locationName from URL encoding when it becomes available or changes
  useEffect(() => {
    if (locationName) {
      const safeLocationName = Array.isArray(locationName)
        ? locationName[0]
        : locationName;
      try {
        const decoded = decodeURIComponent(safeLocationName);
        setDecodedLocationName(decoded);
      } catch (error) {
        console.error("Error decoding locationName:", error);
        setDecodedLocationName(safeLocationName);
      }
    }
  }, [locationName]);

  // Fetch location data from API when decodedLocationName changes
  useEffect(() => {
    if (!decodedLocationName) return;

    const fetchLocationData = async (decodedLocationName: string) => {
      try {
        setLoading(true); 
        setError(null); 

        const [allSalariesRes, averageSalariesRes, topCompanyRes, topUniversityRes] = await Promise.all([
          fetch(`${BACKEND_URL}/location/all-salaries?location=${decodedLocationName}`),
          fetch(`${BACKEND_URL}/location/average-salary?location=${decodedLocationName}`),
          fetch(`${BACKEND_URL}/location/top-company?location=${decodedLocationName}`),
          fetch(`${BACKEND_URL}/location/top-university?location=${decodedLocationName}`),
        ]);

        // Check if any response failed and immediately throw an error
        if (!allSalariesRes.ok || !averageSalariesRes.ok || !topCompanyRes.ok || !topUniversityRes.ok) {
          throw new Error("Location not found or data unavailable");
        }

        const [salariesData, averageSalaryData, topCompanyData, topUniversityData] = await Promise.all([
          allSalariesRes.json(),
          averageSalariesRes.json(),
          topCompanyRes.json(),
          topUniversityRes.json(),
        ]);

        setLocationRecords(salariesData);
        setAverageSalary(averageSalaryData);
        setTopCompany(topCompanyData);
        setTopUniversity(topUniversityData);
      } catch (error: unknown) {
        console.error("Error fetching location data:", error);
        setError(error instanceof Error ? error.message : "An error occurred while fetching data");
      } finally {
        setLoading(false); 
      }
    };

    fetchLocationData(decodedLocationName);
  }, [decodedLocationName]);

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
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-800 text-sm font-medium mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                Location Profile
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
                <CardTitle className="text-sm font-semibold text-gray-600">Top Company</CardTitle>
                <Building2 className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <LocationTable locationRecords={[]} />
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
              <MapPin className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Location Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't find salary data for this location. Please check the spelling or try searching for a different location.
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
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-800 text-sm font-medium mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              Location Profile
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              {decodedLocationName}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Internship salary insights and location trends
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
              <CardTitle className="text-sm font-semibold text-gray-600">Top Company</CardTitle>
              <Building2 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-gray-900 leading-tight">
                {topCompany}
              </div>
              <div className="text-xs text-gray-500 mt-1">Most hiring</div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="mb-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Salary Reports</h2>
            <p className="text-gray-600">Individual salary data from students in this location</p>
          </div>
          <LocationTable locationRecords={locationRecords} />
        </div>
      </div>
    </div>
  );
}