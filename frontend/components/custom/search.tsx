'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

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

    // setSuggestions([{type: "Company", value: "Google"}, {type: "Company", value: "Amazon"}, {type: "Company", value: "RBC"}])
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
          ? combinedSuggestions
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
      // alert(suggestion.type)
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

  return (
    <>
      <div className="hidden sm:block sm:relative">
        <Input
          placeholder="Search by Company, Location"
          value={searchTerm}
          onChange={handleInputChange}
        />
        

        {/* Display suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.value}
                <p className="text-sm text-gray-400">
                  {suggestion.type === "No results" ? "" : suggestion.type}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sm:hidden block relative">
        <Input
          placeholder="Explore Salaries"
          value={searchTerm}
          onChange={handleInputChange}
        />
        

        {/* Display suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.value}
                <p className="text-sm text-gray-400">
                  {suggestion.type === "No results" ? "" : suggestion.type}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Search;