import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Scoper",
  description: "Learn more about the motivation and data behind Scoper | Canadian Internship Salaries",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About the Project
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Bringing transparency to internship compensation in Canada
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Motivation Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why I Built This
              </h2>
              <div className="prose prose-lg">
                <p>
               While platforms like levels.fyi and Glassdoor exist, they lack comprehensive Canadian data or require extensive navigation to find relevant information. The problem with these platforms is either: a. A lack of enough Canadian data or b. It takes too long to get the information I need. I want to be able to search up a company and immediately see the average salary and previous salaries reported. 
                </p>
              </div>
            </section>

            {/* Data Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Data
              </h2>
              <div className="prose prose-lg">
                <p>
                  Quite honestly, the biggest problem with creating a platform like this is access to data. Thankfully, I came across an old reddit post that linked a google sheet (<a className="underline font-medium hover:opacity-45" href="https://docs.google.com/spreadsheets/d/1oYRPr1_NL8kD6ei06C6BWgVo51GTH6e5oGsR5suqwUA/edit?gid=335472327">Concordia Coop Compensation Chart</a>) with student-reported salaries. 
                </p>
              </div>
            </section>

            {/* Learn More Section */}
            <section className="bg-gray-50 rounded-lg p-8 mt-8 border-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Want to Learn More?
              </h2>
              <p className="text-gray-600 mb-4">
                Check out the GitHub repository for more information about the project, 
                including technical details and how to contribute.
              </p>
              <a
                href="https://github.com/HishamLadha/Canadian-Internship-Salaries"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                View on GitHub →
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}