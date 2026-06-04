import { useState, useCallback } from "react";
import { MOCK_PROJECTS } from "../mock/data";
import { useNotifications } from "../context/NotificationContext";
import { dataSource, apiFetch } from "../api/config";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotifications();

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("mos_favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      await dataSource(
        async () => {
          setProducts(MOCK_PROJECTS);
        },

        async () => {
          const data = await apiFetch("/products");

          // adjust if API returns { items: [] }
          setProducts(Array.isArray(data) ? data : data.items ?? []);
        }
      );
    } catch (err) {
      addNotification({
        type: "error",
        title: "Products",
        message: "Failed to fetch products",
      });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Favorite Product
  const toggleFavorite = useCallback(
    async (productId) => {
      try {
        const isFavorite = favorites.includes(productId);

        await dataSource(
          async () => {
            const next = isFavorite
              ? favorites.filter((id) => id !== productId)
              : [...favorites, productId];

            setFavorites(next);
            localStorage.setItem(
              "mos_favorites",
              JSON.stringify(next)
            );
          },

          async () => {
            if (isFavorite) {
              await apiFetch(`/products/favorites/${productId}`, {
                method: "DELETE",
              });
            } else {
              await apiFetch(`/products/favorites/${productId}`, {
                method: "POST",
              });
            }

            setFavorites((prev) =>
              isFavorite
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
            );
          }
        );
      } catch (err) {
        addNotification({
          type: "error",
          title: "Favorites",
          message: "Failed to update favorite",
        });
      }
    },
    [favorites, addNotification]
  );

  const unfavorite = useCallback(
    async (productId) => {
      if (!favorites.includes(productId)) return;

      await toggleFavorite(productId);
    },
    [favorites, toggleFavorite]
  );

  return {
    products,
    favorites,
    loading,
    fetchProducts,
    toggleFavorite,
    unfavorite,
  };
}