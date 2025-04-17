export type CloudProvider = 'AWS' | 'OVH' | 'CloudAvenue';

export type ProjectStatus = 'In Progress' | 'Decommissioned' | 'Production';

export interface Project {
    id: string;
    name: string;
    subnet: string;
    status: ProjectStatus;
    provider: CloudProvider;
    createdAt: Date;
} 