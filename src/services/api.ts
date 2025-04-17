import { Project } from '../types/Project';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  // Add a new project
  addProject: async (project: Omit<Project, 'id' | 'subnet' | 'createdAt'>): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add project');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding project:', error);
      return null;
    }
  },

  // Update a project
  updateProject: async (id: string, project: Partial<Project>): Promise<Project | null> => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  },

  // Delete a project
  deleteProject: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },
}; 