import { useEffect, useState } from "react";
import { productApi } from "../api/product.api";
import groupByCategory from "../utils/groupByCategory";

export const useProducts = () => {

    const [ sections, setSections ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await productApi.getAll();
            setSections(groupByCategory(res.data.data));
        }
        catch(err)
        {
            setError(err.response?.data?.message || "Failes to fetch prpducts")
        }
        finally
        {
            setLoading(false);
        }
    }
    useEffect(() => { load();}, []);

    return { sections, loading, error, reload: load };
};

