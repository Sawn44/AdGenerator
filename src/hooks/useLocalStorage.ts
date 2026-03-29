import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types/template';

const STORAGE_KEY = 'pmax_projects';

export function useLocalStorage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved projects:', e);
      }
    }
  }, []);

  const saveProject = useCallback((project: Project) => {
    setProjects(prev => {
      const existing = prev.findIndex(p => p.id === project.id);
      const updated = existing >= 0
        ? prev.map(p => p.id === project.id ? project : p)
        : [...prev, project];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getProject = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  return { projects, saveProject, deleteProject, getProject };
}
