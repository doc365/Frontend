import { useState, useCallback } from "react";
import { MOCK_PROJECTS } from "../mock/data";

export function useProducts() {
  const [projects] = useState(MOCK_PROJECTS);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("mos_favorites");
    return stored ? JSON.parse(stored) : [1, 2];
  });

  const toggleFavorite = useCallback((projectId) => {
    setFavorites((prev) => {
      const next = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      localStorage.setItem("mos_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  return { projects, favorites, toggleFavorite };
}
