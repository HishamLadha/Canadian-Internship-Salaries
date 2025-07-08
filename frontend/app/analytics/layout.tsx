import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Scoper - Canadian Internship Salaries",
  description: "Comprehensive analytics and insights for Canadian internship salaries. View trends, compare companies, universities, and locations.",
  keywords: ["analytics", "salary trends", "internship data", "Canadian salaries", "company comparison", "university rankings"],
  openGraph: {
    title: "Salary Analytics Dashboard | Scoper",
    description: "Explore comprehensive analytics for Canadian internship salaries",
    type: "website",
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
