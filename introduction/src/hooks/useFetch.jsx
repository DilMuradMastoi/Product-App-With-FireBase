import axios from "axios";
import { useState , useEffect } from "react";

const useFetch = (url) => {
    const [data , setData] = useState(null);
    const [error , setError] = useState(false);
    const [loading , setLoading] = useState(true);

    useEffect = (() => {
        axios(url)
        .then(res => setData(res.data))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }, [])
}
export default useFetch