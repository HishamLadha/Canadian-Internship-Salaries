'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CompanyTable } from "@/components/custom/companyTable";

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
 
export default function Company() {
  const params = useParams();
  const { companyName } = params;
  const [decodedCompanyName, setDecodedCompanyName] = useState('');
  const [companyRecords, setCompanyRecords] = useState([]);
  const [averageSalary, setAverageSalary] = useState(0.0);
  const [topUniversity, setTopUniversity] = useState('');
  const [topLocation, setTopLocation] = useState('');
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Decode the companyName when it becomes available or changes.
  useEffect(() => {
    if (companyName) {
      // Ensure companyName is a string.
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

  // Fetch company data from API when component is loaded
  useEffect(() => {
    if (!decodedCompanyName){
      return
    }
    const fetchCompanyData = async (decodedCompanyName: string) => {
      try{
        const [allSalariesRes, averageSalariesRes, topLocationRes, topUniversityRes] = await Promise.all([
          fetch(`${BACKEND_URL}/company/all-salaries?company=${decodedCompanyName}`),
          fetch(`${BACKEND_URL}/company/average-salary?company=${decodedCompanyName}`),
          fetch(`${BACKEND_URL}/company/top-location?company=${decodedCompanyName}`),
          fetch(`${BACKEND_URL}/company/top-university?company=${decodedCompanyName}`)
           ]);
        if(!allSalariesRes.ok || !averageSalariesRes.ok || !topLocationRes.ok || !topUniversityRes.ok){
          throw new Error("Failed to fetch this companies data");
        }
        const [salariesData, averageSalaryData, topLocationData, topUniversityData] = await Promise.all([
          allSalariesRes.json(),
          averageSalariesRes.json(),
          topLocationRes.json(),
          topUniversityRes.json()
        ]);
        setCompanyRecords(salariesData);
        setAverageSalary(averageSalaryData);
        setTopLocation(topLocationData);
        setTopUniversity(topUniversityData);

      }
      catch (error){
        console.log("An error occured fetching all salaries: ", error);

      }finally{

      }

    }

    fetchCompanyData(decodedCompanyName)
  }, [decodedCompanyName])

  return (
  // <p>Post: {companyName}</p>
    <div className='mt-6'>
      {/* Text description of company */}
      <div className='flex justify-center text-center'>
        <h1 className='text-4xl 
                sm:text-5xl 
                font-extrabold 
                tracking-tight 
                text-gray-900 
                bg-clip-text'>
                   {decodedCompanyName}
        </h1>
     
      </div>

      {/* Cards showing quick glimpses  */}
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 sm:px-14 px-6 sm:py-6 py-6">
        <Card>
          <CardHeader>
            <CardTitle>💰 Average Salary</CardTitle>
          </CardHeader>
          <CardContent className='text-xl'>
            <p>{averageSalary.toLocaleString('en-US', { style: 'currency', currency: 'CAD' })}</p>
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

      {/* Table  */}
      <div className="sm:px-14 px-6">
        <CompanyTable companyRecords={companyRecords}/>
      </div>
    </div>
)

}