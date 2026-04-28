import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFolios = () => {
    const [resolutions, setResolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResolutions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/pos/resolutions');
            setResolutions(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching resolutions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResolutions();
    }, []);

    return { resolutions, loading, error, refresh: fetchResolutions };
};
