import React from 'react' 
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert' 
import { Shield, TrendingUp, Users } from 'lucide-react' 
import { SalaryForm } from '@/components/custom/salaryForm' 

const page = () => { 
  return ( 
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-16'> 
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Help Build Transparency
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6'>
            Share Your Internship Salary
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your contribution helps students across Canada make informed decisions about their careers. 
            All submissions are completely anonymous and secure.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">100% Anonymous</div>
            <div className="text-xs text-gray-600">No personal data stored</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">Community Driven</div>
            <div className="text-xs text-gray-600">Help fellow students</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 text-center">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">Open Source</div>
            <div className="text-xs text-gray-600">Fully transparent code</div>
          </div>
        </div>

        {/* Form Container */}
        <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8'>
          {/* Anonymous alert banner */}
          {/* <Alert className='mb-6 border-green-200 bg-green-50'>
            <Shield className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 font-semibold">Your privacy is protected</AlertTitle>
            <AlertDescription className='text-green-700'>
              No personally identifiable information is collected. The entire codebase is open source and available for review.
            </AlertDescription>
          </Alert> */}
          
          {/* Actual form */}
          <SalaryForm />
        </div>
      </div> 
    </div> 
  ) 
} 
 
export default page 