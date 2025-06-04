"use client";

import { Metadata } from "next";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// export const metadata: Metadata = {
//   title: "About | Scoper",
//   description: "Learn more about the motivation and data behind Scoper | Canadian Internship Salaries",
// };

export default function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "Where does the data come from?",
      answer: "The initial dataset comes from the Concordia Coop Compensation Chart, a community-driven Google sheet with student-reported salaries. New data is continuously added through user submissions on this platform."
    },
    {
      question: "Is my data anonymous and secure?",
      answer: "Yes, absolutely. No personally identifiable information is collected or stored. We only collect salary data, company information, and work details. The platform is fully open source, so you can review exactly what data is collected and how it's handled."
    },
    {
      question: "How does the data approval process work?",
      answer: "All salary submissions go through an admin review process before being published. This helps ensure data quality and prevents spam or inaccurate entries. Admins review submissions for reasonableness and completeness before approving them for public display."
    },
    {
      question: "What are the future plans for this platform?",
      answer: "We're continuously working to improve the platform. Future plans include adding more detailed analytics, expanding to include full-time positions, implementing advanced search and filtering capabilities, and potentially adding salary trend analysis over time. Community feedback helps guide our development priorities."
    },
    {
      question: "Can I contribute to the project?",
      answer: "Yes! This is an open source project and we welcome contributions. You can submit salary data, report bugs, suggest features, or contribute code. Check out our GitHub repository for more information on how to get involved."
    },
    {
      question: "Is this platform only for Canadian students?",
      answer: "Currently, we focus on Canadian internship salaries and Canadian universities. However, we welcome data from international students studying in Canada or Canadian students doing internships abroad, as long as the context is relevant to the Canadian student experience."
    }
  ];

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

            

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      {openFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-4 border-t border-gray-100">
                        <p className="text-gray-600 pt-4">
                          {faq.answer}
                          {index === 0 && (
                            <>
                              {" "}
                              <a 
                                className="underline font-medium hover:opacity-70" 
                                href="https://docs.google.com/spreadsheets/d/1oYRPr1_NL8kD6ei06C6BWgVo51GTH6e5oGsR5suqwUA/edit?gid=335472327" 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                View the original spreadsheet here.
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
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