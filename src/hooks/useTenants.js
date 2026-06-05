import { useState, useCallback } from "react";
import { useNotifications } from "../context/NotificationContext";
import { dataSource, apiFetch } from "../api/config";
import { MOCK_TENANTS } from "../mock/data";

export function useTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addNotification } = useNotifications();

  // ── Fetch Tenant Names ───────────────────────────────
  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dataSource(
        async () => {
          await new Promise((r) => setTimeout(r, 300));
          setTenants(MOCK_TENANTS);
        },
        async () => {
          const data = await apiFetch("/v1/tenants/names", 
            { method: "GET" });
          const normalized = (data ?? []).map((t) => ({
            id: t.id,
            name: t.name,
          }));

          setTenants(normalized);
        },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Get Single Tenant ───────────────────────────────
  const getTenant = useCallback(async (id) => {
    return dataSource(
      async () => MOCK_TENANTS.find((t) => String(t.id) === String(id)) ?? null,

      async () => {
        const data = await apiFetch(`/v1/tenants/${id}`, {
          method: "GET",
        });

        return {
          id: data.id
        };
      },
    );
  }, []);

  // ── Create Tenant ───────────────────────────────────
  const addTenant = useCallback(
    async (tenantData) => {
      setLoading(true);

      try {
        return await dataSource(
          async () => {
            await new Promise((r) => setTimeout(r, 300));

            const tenant = {
              id: crypto.randomUUID(),
              name: tenantData.name,
              slug: tenantData.slug,
            };

            MOCK_TENANTS.push(tenant);

            addNotification({
              type: "success",
              title: "Tenant created",
              message: `${tenant.name} created successfully`,
            });

            return tenant;
          },

          async () => {
            const data = await apiFetch("/v1/tenants", {
              method: "POST",
              body: JSON.stringify({
                name: tenantData.name,
                slug: tenantData.slug,
              }),
            });

            addNotification({
              type: "success",
              title: "Tenant created",
              message: `${tenantData.name} created successfully`,
            });

            return data;
          },
        );
      } finally {
        setLoading(false);
      }
    },
    [addNotification],
  );

  return {
    tenants,
    loading,
    error,

    fetchTenants,
    getTenant,
    addTenant,
  };
}
