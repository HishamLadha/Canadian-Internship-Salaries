import { useState, useEffect } from "react";

// interface Company {
//     id: number;
//     name: string;
//     // Add other fields as necessary
// }

const useFetchCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/all-companies');
                if (!response.ok) {
                    throw new Error("Failed to fetch companies");
                }
                // const data: Company[] = await response.json();
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    return { companies, loading, error };
};

export default useFetchCompanies;