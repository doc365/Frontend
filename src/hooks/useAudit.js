import { useState, useCallback } from "react";
import { apiFetch } from "../api/config";

export function useAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchAuditLogs = useCallback(async ({
    page = 1,
    pageSize = 10,
    search = "",
    // frontend-side filters
    category = "All",
    action = "All",
    dateRange = null,
    objectSearch = "",
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("Page", page);
      params.set("PageSize", pageSize);
      if (search) params.set("Search", search);

      const data = await apiFetch(`/v1/audits/fetch?${params.toString()}`);

      // Normalize API response to shape the UI expects
      let items = (data.items ?? []).map((log) => ({
        id: log.id,
        displayName: log.name ?? "",
        userId: log.userName ?? "",
        staffId: "",
        ipAddress: "",
        time: log.timestamp,
        category: log.category ?? "Account",
        action: log.action ?? "",
        object: log.objectAffected ?? "",
      }));

      // Frontend-side filtering
      if (category !== "All") {
        items = items.filter((r) => r.category === category);
      }

      if (action !== "All") {
        items = items.filter((r) => r.action === action);
      }

      if (objectSearch) {
        const q = objectSearch.toLowerCase();
        items = items.filter((r) => r.object.toLowerCase().includes(q));
      }

      if (dateRange && dateRange[0] && dateRange[1]) {
        const [from, to] = dateRange;
        items = items.filter((r) => {
          const t = new Date(r.time);
          return t >= from.toDate() && t <= to.toDate();
        });
      }

      setTotal(data.totalCount ?? items.length);
      setLogs(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { logs, loading, error, total, fetchAuditLogs };
}