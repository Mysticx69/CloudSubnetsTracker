const API_URL = 'http://localhost:3001/api';

export interface IProject {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  subnets: ISubnet[];
}

export interface ISubnet {
  id: string;
  cidr: string;
  region: string;
  environment: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  // Projects
  getAllProjects: async (): Promise<IProject[]> => {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  getProject: async (id: string): Promise<IProject> => {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  createProject: async (project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> => {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  },

  updateProject: async (id: string, project: Partial<IProject>): Promise<IProject> => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project');
    }
    return response.json();
  },

  // Subnets
  addSubnet: async (projectId: string, subnet: Omit<ISubnet, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<ISubnet> => {
    const response = await fetch(`${API_URL}/projects/${projectId}/subnets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subnet),
    });
    if (!response.ok) throw new Error('Failed to add subnet');
    return response.json();
  },
}; 