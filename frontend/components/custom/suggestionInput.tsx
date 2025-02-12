import React, {useState, useRef, useEffect} from 'react';
import { Input } from '../ui/input';

interface SuggestionInputProps{
    suggestions: string[],
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
}

const SuggestionInput = ({suggestions, value, onChange, placeholder, type="text"}: SuggestionInputProps) => {
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Function to handle clicks outside the component
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        // Filter suggestions
        if (inputValue){
            const filtered = suggestions.filter(suggestion => suggestion.toLowerCase().startsWith(inputValue.toLowerCase()));
            setFilteredSuggestions(filtered.length > 0 ? filtered : [`No search results for : ${inputValue}`]);
            setShowSuggestions(true);
        }else{
            setFilteredSuggestions([]);
        }
    }  
    
    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    }

    return (
        <div className="relative" ref={containerRef}>
        <Input
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
                <li
                    key={index}
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    onClick={() => handleSuggestionClick(suggestion)}
                >
                    {suggestion}
                </li>
            ))}
          </ul>
        )}
      </div>
    )
}

export default SuggestionInput;