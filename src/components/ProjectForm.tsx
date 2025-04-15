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
    const [status, setStatus] = useState<ProjectStatus>('En cours');
    const [provider, setProvider] = useState<CloudProvider>('AWS');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Vérification si le projet existe déjà
        if (existingProjects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            setError('Un projet avec ce nom existe déjà');
            return;
        }

        onSubmit({
            name,
            status,
            provider,
        });

        // Réinitialisation du formulaire
        setName('');
        setStatus('En cours');
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
                label="Nom du projet"
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
                    <MenuItem value="En cours">En cours</MenuItem>
                    <MenuItem value="Production">Production</MenuItem>
                    <MenuItem value="Décomissioné">Décomissioné</MenuItem>
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
                Ajouter le projet
            </Button>
        </Box>
    );
};

export default ProjectForm; 