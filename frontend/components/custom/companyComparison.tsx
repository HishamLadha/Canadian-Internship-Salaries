"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, Search } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface CompanyComparisonData {
  [company: string]: {
    avg_salary: number;
    median_salary: number;
    min_salary: number;
    max_salary: number;
    total_reports: number;
    salary_data: number[];
  };
}

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  companies: string[];
}

// Company search input component
function CompanySearchInput({ value, onChange, placeholder, companies }: CompanySearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue) {
      const filtered = companies.filter(company => 
        company.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (value && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-gray-900">{suggestion}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CompanyComparison() {
  const [company1, setCompany1] = useState<string>('');
  const [company2, setCompany2] = useState<string>('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<CompanyComparisonData>({});

  // Fetch companies list on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/all-companies`);
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data: string[] = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompare = async () => {
    if (!company1.trim() || !company2.trim()) {
      setError('Please select two companies to compare');
      return;
    }

    if (company1.trim().toLowerCase() === company2.trim().toLowerCase()) {
      setError('Please select two different companies');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const companiesQuery = `${company1.trim()},${company2.trim()}`;
      const response = await fetch(`${BACKEND_URL}/analytics/company-comparison?companies=${encodeURIComponent(companiesQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (error: unknown) {
      console.error('Error fetching comparison data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Transform data for chart
  const chartData = Object.entries(comparisonData).map(([company, data]) => ({
    company,
    avg_salary: data.avg_salary,
    median_salary: data.median_salary,
    total_reports: data.total_reports
  }));

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-white/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          Company Comparison Tool
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Compare salary data between two companies using the search below
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Company 1</label>
            <CompanySearchInput
              value={company1}
              onChange={setCompany1}
              placeholder="Search for first company..."
              companies={companies}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Company 2</label>
            <CompanySearchInput
              value={company2}
              onChange={setCompany2}
              placeholder="Search for second company..."
              companies={companies}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button   
            onClick={handleCompare} 
            disabled={loading || !company1.trim() || !company2.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Comparing...' : 'Compare Companies'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {Object.keys(comparisonData).length > 0 && (
          <div className="space-y-6">
            {/* Chart */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Salary Comparison</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="company" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${value.toFixed(2)}`, 
                      name === 'avg_salary' ? 'Average Salary' : 'Median Salary'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="avg_salary" fill="#3B82F6" name="Average Salary" />
                  <Bar dataKey="median_salary" fill="#8B5CF6" name="Median Salary" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Statistics */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {Object.entries(comparisonData).map(([company, data]) => (
                  <Card key={company} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {company}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Average:</span>
                        <span className="font-semibold text-green-600 ml-2">
                          ${data.avg_salary.toFixed(2)}/hr
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Median:</span>
                        <span className="font-semibold text-blue-600 ml-2">
                          ${data.median_salary.toFixed(2)}/hr
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Range:</span>
                        <span className="font-semibold text-gray-700 ml-2">
                          ${data.min_salary.toFixed(2)} - ${data.max_salary.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Reports:</span>
                        <span className="font-semibold text-purple-600 ml-2">
                          {data.total_reports}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {Object.keys(comparisonData).length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Select two companies above to start comparing salary data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
