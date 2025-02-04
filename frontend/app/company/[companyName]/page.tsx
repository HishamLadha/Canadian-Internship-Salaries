'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CompanyTable } from "@/components/custom/companyTable";

import { useParams } from 'next/navigation'
 
export default function Company() {
  const params = useParams();
  const { companyName } = params;

  return (
  // <p>Post: {companyName}</p>
    <div className='mt-6'>
      {/* Text description of company */}
      <div className='flex justify-center'>
        <h1 className='text-4xl 
                sm:text-5xl 
                font-extrabold 
                tracking-tight 
                text-gray-900 
                bg-clip-text'>
                   {companyName}
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