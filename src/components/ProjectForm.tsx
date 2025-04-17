import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from '@mui/material';
import { Project, ProjectStatus, CloudProvider } from '../types/Project';

interface ProjectFormProps {
    onSubmit: (project: Omit<Project, 'id' | 'subnet' | 'createdAt'>) => void;
    existingProjects: Project[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, existingProjects }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<ProjectStatus>('In Progress');
    const [provider, setProvider] = useState<CloudProvider>('AWS');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if project already exists
        if (existingProjects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            setError('A project with this name already exists');
            return;
        }

        onSubmit({
            name,
            status,
            provider,
        });

        // Reset form
        setName('');
        setStatus('In Progress');
        setProvider('AWS');
        setError(null);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '20px auto' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <TextField
                fullWidth
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                >
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Production">Production</MenuItem>
                    <MenuItem value="Decommissioned">Decommissioned</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Provider</InputLabel>
                <Select
                    value={provider}
                    label="Provider"
                    onChange={(e) => setProvider(e.target.value as CloudProvider)}
                >
                    <MenuItem value="AWS">AWS</MenuItem>
                    <MenuItem value="OVH">OVH</MenuItem>
                    <MenuItem value="CloudAvenue">CloudAvenue</MenuItem>
                </Select>
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                fullWidth
            >
                Add Project
            </Button>
        </Box>
    );
};

export default ProjectForm; 