import { HomeTable } from "@/components/custom/homeTable";
import Footer from "@/components/custom/footer";
import Search from "@/components/custom/search";
import { AnnouncementBanner } from "@/components/custom/announcement-banner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <AnnouncementBanner />
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="
                text-4xl 
                sm:text-5xl 
                font-extrabold 
                tracking-tight 
                text-gray-900 
                bg-clip-text 
              "
            >
              Discover Internship Salaries Across Canada
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Search for competitive internship salaries or contribute your own!
            </p>
            <div className="mt-8 sm:flex hidden sm:justify-center sm:items-center sm:w-full">
              <Search />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="data-table" className="px-4 sm:px-24">
        <HomeTable />
      </main>

      <Footer />
    </div>
  );
}
