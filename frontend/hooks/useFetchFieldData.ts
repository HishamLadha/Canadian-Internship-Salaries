import {useState, useEffect} from "react";

const useFetchFieldData = (endpoint: string) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try{
                setLoading(true);
                const response = await fetch(`${BACKEND_URL}/${endpoint}`);

                if (!response.ok){
                    throw new Error(`Failed to fetch ${endpoint}`);
                }

                const result = await response.json()
                setData(result)
            }
            catch(e){
                setError(e as Error)
            }
            finally{
                setLoading(false)
            }

        };
        fetchData()

    }, [endpoint]);

    return {data, loading, error};

}

export default useFetchFieldData;