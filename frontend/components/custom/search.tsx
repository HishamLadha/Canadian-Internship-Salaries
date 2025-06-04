'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, Building, MapPin } from 'lucide-react';

interface Suggestion {
  type: "Company" | "Location" | "No results";
  value: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

    const fetchLocations = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/all-locations`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data: string[] = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    fetchCompanies();
    fetchLocations();
  }, []);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter suggestions based on input
    if (value) {
      const filteredCompanies: Suggestion[] = companies
        .filter((company) => company.toLowerCase().startsWith(value.toLowerCase()))
        .map((company) => ({ type: "Company", value: company }));

      const filteredLocations: Suggestion[] = locations
        .filter((location) => location.toLowerCase().startsWith(value.toLowerCase()))
        .map((location) => ({ type: "Location", value: location }));

      const combinedSuggestions: Suggestion[] = [...filteredCompanies, ...filteredLocations];

      setSuggestions(
        combinedSuggestions.length > 0
          ? combinedSuggestions.slice(0, 6) // Limit to 6 results
          : [{ type: "No results", value: `No results for: ${value}` }]
      );
    } else {
      setSuggestions([]);
    }
  };

  const router = useRouter();

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.value);
    setSuggestions([]);
    if (suggestions.length > 0 && !(suggestions[0].value.includes("No results"))) {
      if(suggestion.type === "Location"){
        router.push(`/location/${suggestion.value}`)
      }
      if(suggestion.type === "Company"){
        router.push(`/company/${suggestion.value}`);
      }
    } else {
      alert(`Not a valid company`);
      setSearchTerm("");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Company":
        return <Building className="w-4 h-4 text-blue-600" />;
      case "Location":
        return <MapPin className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="hidden sm:block sm:relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Input
            placeholder="Search by Company, Location"
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 w-full min-w-0 search-input-chrome search-input-responsive search-input-macbook"
          />
        </div>

        {/* Display suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-3">
                  {getIcon(suggestion.type)}
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.value}</div>
                    {suggestion.type !== "No results" && (
                      <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sm:hidden block relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Explore salaries"
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        {/* Display suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-3">
                  {getIcon(suggestion.type)}
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.value}</div>
                    {suggestion.type !== "No results" && (
                      <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;