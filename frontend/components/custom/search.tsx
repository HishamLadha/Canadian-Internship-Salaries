'use client';

import React, { useState } from 'react';
import { Input } from '../ui/input';

// Mock data for autocomplete suggestions
const companies = [
  'Apple',
  'Microsoft',
  'Google',
  'Amazon',
  'Tesla',
    'Twitter',
    "TikTok",
    "Snapchat",
    "Pinterest",
  'Facebook',
  'Netflix',
  'Adobe',
  'Intel',
  'IBM',
];

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

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