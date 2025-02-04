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
        const response = await fetch(`http://localhost:8000/company?company=${decodedCompanyName}`)
        if(!response.ok){
          throw new Error("Failed to fetch this companies data")
        }
        const data = await response.json();
        console.log(data)

      }
      catch{

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
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎓 Top University</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📍 Top Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

      </div>

      {/* Table  */}
      <div className="sm:px-14 px-6">
        <CompanyTable />
      </div>
    </div>
)

}