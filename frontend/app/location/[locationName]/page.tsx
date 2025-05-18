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


export default function Company() {
  const router = useRouter()

  const params = useParams();
  const { locationName } = params;
  const [decodedlocationName, setDecodedlocationName] = useState("");
  // change this variable name below and also change the location table
  const [locationRecords, setCompanyRecords] = useState([]);
  const [averageSalary, setAverageSalary] = useState(0.0);
  const [topUniversity, setTopUniversity] = useState("");
  const [topCompany, setTopCompany] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Decode the locationName from URL encoding when it becomes available or changes
  useEffect(() => {
    if (locationName) {
      const safelocationName = Array.isArray(locationName)
        ? locationName[0]
        : locationName;
      try {
        const decoded = decodeURIComponent(safelocationName);
        setDecodedlocationName(decoded);
      } catch (error) {
        console.error("Error decoding locationName:", error);
        setDecodedlocationName(safelocationName);
      }
    }
  }, [locationName]);

  // Fetch company data from API when decodedlocationName changes
  useEffect(() => {
    if (!decodedlocationName) return;

    const fetchCompanyData = async (decodedlocationName: string) => {
      try {
        setLoading(true); 
        setError(null); 

        const [allSalariesRes, averageSalariesRes, topCompanyRes, topUniversityRes] = await Promise.all([
          fetch(`${BACKEND_URL}/location/all-salaries?location=${decodedlocationName}`),
          fetch(`${BACKEND_URL}/location/average-salary?location=${decodedlocationName}`),
          fetch(`${BACKEND_URL}/location/top-company?location=${decodedlocationName}`),
          fetch(`${BACKEND_URL}/location/top-university?location=${decodedlocationName}`),
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

        setCompanyRecords(salariesData);
        setAverageSalary(averageSalaryData);
        setTopCompany(topCompanyData);
        setTopUniversity(topUniversityData);
      } catch (error: unknown) {
        console.error("Error fetching company data:", error);
        setError(error instanceof Error ? error.message : "An error occurred while fetching data");
      } finally {
        setLoading(false); 
      }
    };

    fetchCompanyData(decodedlocationName);
  }, [decodedlocationName]);

  if (loading) {
    return (
      <div className="mt-6">
        <div className="flex justify-center text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 bg-clip-text">
            {"Loading..."}
          </h1>
        </div>
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 sm:px-14 px-6 sm:py-6 py-6">
          <Card>
            <CardHeader>
              <CardTitle>💰 Average Salary</CardTitle>
            </CardHeader>
            <CardContent className="text-xl">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🎓 Top University</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>📍 Top Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <div className="sm:px-14 px-6">
          <LocationTable locationRecords={[]} /> 
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 flex justify-center text-center min-h-screen items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            {"Something went wrong"}
          </h1>
          <p className="mt-2 text-gray-500">
            Please check the company name or try another search.
          </p>
          <Button 
        onClick={() => router.push('/')}
        className="mt-4"
      >
        Return Home
      </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 bg-clip-text">
          {decodedlocationName}
        </h1>
      </div>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 sm:px-14 px-6 sm:py-6 py-6">
        <Card>
          <CardHeader>
            <CardTitle>💰 Average Salary</CardTitle>
          </CardHeader>
          <CardContent className="text-xl">
            <p>{averageSalary.toLocaleString("en-US", { style: "currency", currency: "CAD" })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🎓 Top University</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{topUniversity}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>📍 Top Company</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{topCompany}</p>
          </CardContent>
        </Card>
      </div>
      <div className="sm:px-14 px-6">
        <LocationTable locationRecords={locationRecords} />
      </div>
    </div>
  );
}