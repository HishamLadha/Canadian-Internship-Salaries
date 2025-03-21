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
              <CardTitle>📍 Top Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <div className="sm:px-14 px-6">
          <CompanyTable companyRecords={[]} /> 
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
          {decodedCompanyName}
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
            <CardTitle>📍 Top Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{topLocation}</p>
          </CardContent>
        </Card>
      </div>
      <div className="sm:px-14 px-6">
        <CompanyTable companyRecords={companyRecords} />
      </div>
    </div>
  );
}