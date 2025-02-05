import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { SmilePlus } from 'lucide-react'
import { SalaryForm } from '@/components/custom/salaryForm'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      {/* Heading */}
      <h1 className='text-3xl 
                  sm:text-4xl 
                  font-extrabold 
                  tracking-tight 
                  text-gray-900 
                  bg-clip-text
                  sm:mt-6 
                  m-3 
                  text-center
                  '>
                    Add your Salary
      </h1>

      <div>
        {/* Anonymous alert banner */}
        <Alert className='sm:max-w-sm max-w-xs'>
          <SmilePlus className="h-4 w-4" />
          <AlertTitle>Your submission is anonymous and private!</AlertTitle>
          <AlertDescription className='text-gray-600'>
            No data is collected nor stored on our servers! The code is fully open-source.
          </AlertDescription>
        </Alert>
        
        {/* Actual form down below */}
        <div className='sm:w-sm w-xs border-slate-400 p-5 rounded-md'>
          <SalaryForm />
        </div>
      </div>
      


        
      
    </div>
  )
}

export default page