'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';


const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
        try{
            const response = await fetch('http://localhost:8000/all-companies');
            if(!response.ok){
                throw new Error("Failed to fetch companies");
            }
            const data = await response.json();
            setCompanies(data);

        }catch(error){
            console.error("Error fetching companies: ", error);
        }finally {
            // setLoading(false);
        }

    }

    fetchCompanies();

  }, []);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter suggestions based on input
    if (value) {
      const filteredSuggestions = companies.filter((company) =>
        company.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : [value]);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]); // Clear suggestions after selection
    alert(`You selected: ${suggestion}`); // Replace with your desired action
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      alert(`You searched for: ${searchTerm}`); // Replace with your desired action
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      {/* Display loading state */}
      {/* {loading && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg px-4 py-2">
          Loading...
        </div>
      )} */}

      {/* Display suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;