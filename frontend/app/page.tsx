import { HomeTable } from "@/components/custom/homeTable";
import { AnnouncementBanner } from "@/components/custom/announcement-banner";
import { TrendingUp, MapPin, Building2, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-gray-50">
      {/* <AnnouncementBanner /> */}
      
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transparent Salary Data
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              Discover Internship
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Salaries
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access the most comprehensive database of Canadian internship salaries. 
              Make informed decisions about your career with real, anonymized data.
            </p>
            
            {/* Stats Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">157+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <GraduationCap className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">5+</div>
                <div className="text-sm text-gray-600">Universities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="data-table" className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Salary Reports</h2>
            <p className="text-gray-600">Real data from students across Canada</p>
          </div>
          <HomeTable />
        </div>
      </main>
    </div>
  );
}
