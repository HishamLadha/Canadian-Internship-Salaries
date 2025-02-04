'use client'
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
      <div>

      </div>

      {/* Table  */}
      <div>

      </div>
    </div>
)

}