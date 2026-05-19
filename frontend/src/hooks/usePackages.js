// hooks/usePackages.js
import { useState, useEffect } from "react";
import { packageApi } from "../api/package.api";

export const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    packageApi.getAll()
      .then((res) => setPackages(res.data.data))
      .catch((err) => setError(err.response?.data?.message))
      .finally(() => setLoading(false));
  }, []);

  return { packages, loading, error };
};

export const usePackageDetail = (slug) => {
  const [packageTypes, setPackageTypes] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!slug) return;
    packageApi.getTypesBySlug(slug)
      .then((res) => setPackageTypes(res.data.data))
      .catch((err) => setError(err.response?.data?.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { packageTypes, loading, error };
};