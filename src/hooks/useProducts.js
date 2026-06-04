import { useState, useCallback } from "react";
import { MOCK_PROJECTS } from "../mock/data";
import { useNotifications } from "../context/NotificationContext";
import { dataSource, apiFetch } from "../api/config";

export function useProducts() {
  const [projects] = useState(MOCK_PROJECTS);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("mos_favorites");
    return stored ? JSON.parse(stored) : [1, 2];
  });

  const fetchProjects = useCallback(async () => {
    try {
      const response = await apiFetch(`${dataSource}/projects`);
      // Assuming the response is an array of projects
      // setProjects(response);
    } catch (error) {
      useNotifications().addNotification("Failed to fetch projects", "error");
    }
  }, []);

  const unfavorite = useCallback((projectId) => {
    setFavorites((prev) => {
      const next = prev.filter((id) => id !== projectId);
      localStorage.setItem("mos_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((projectId) => {
    setFavorites((prev) => {
      const next = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      localStorage.setItem("mos_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  return { projects, favorites, toggleFavorite, unfavorite, fetchProjects };
}
