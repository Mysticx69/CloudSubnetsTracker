import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    Alert,
} from '@mui/material';
import { Project, ProjectStatus } from '../types/Project';
import ProviderIcon from './ProviderIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import LanIcon from '@mui/icons-material/Lan';
import WorkIcon from '@mui/icons-material/Work';
import CloudIcon from '@mui/icons-material/Cloud';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';

interface ProjectListProps {
    projects: Project[];
    onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
    onDeleteProject: (projectId: string) => void;
    onEditProject: (projectId: string, newName: string) => void;
}

const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case 'In Progress':
            return '#ffa726'; // Orange
        case 'Running':
            return '#66bb6a'; // Green
        case 'Decommissioned':
            return '#ef5350'; // Red
        default:
            return '#9e9e9e'; // Gray
    }
};

const ProjectList: React.FC<ProjectListProps> = ({ projects, onStatusChange, onDeleteProject, onEditProject }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<{ id: string; name: string } | null>(null);
    const [newProjectName, setNewProjectName] = useState('');
    const [editError, setEditError] = useState<string | null>(null);

    const handleDeleteClick = (projectId: string) => {
        setProjectToDelete(projectId);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (projectId: string, currentName: string) => {
        setProjectToEdit({ id: projectId, name: currentName });
        setNewProjectName(currentName);
        setEditDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            onDeleteProject(projectToDelete);
            setDeleteDialogOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleEditConfirm = () => {
        if (projectToEdit && newProjectName.trim()) {
            // Check if the new name already exists (excluding the current project)
            const nameExists = projects.some(
                project => 
                    project.id !== projectToEdit.id && 
                    project.name.toLowerCase() === newProjectName.trim().toLowerCase()
            );
            
            if (nameExists) {
                setEditError('A project with this name already exists');
                return;
            }
            
            setEditError(null);
            onEditProject(projectToEdit.id, newProjectName.trim());
            setEditDialogOpen(false);
            setProjectToEdit(null);
            setNewProjectName('');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
    };

    const handleEditCancel = () => {
        setEditDialogOpen(false);
        setProjectToEdit(null);
        setNewProjectName('');
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FolderIcon sx={{ color: '#2196f3' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Project Name
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LanIcon sx={{ color: '#4caf50' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Subnet
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <WorkIcon sx={{ color: '#ff9800' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Status
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CloudIcon sx={{ color: '#9c27b0' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Provider
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarMonthIcon sx={{ color: '#f44336' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Creation Date
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SettingsIcon sx={{ color: '#607d8b' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Actions
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.subnet}</TableCell>
                                <TableCell>
                                    <FormControl size="small">
                                        <Select
                                            value={project.status}
                                            onChange={(e) => onStatusChange(project.id, e.target.value as ProjectStatus)}
                                            sx={{ 
                                                minWidth: 120,
                                                backgroundColor: getStatusColor(project.status),
                                                color: 'white',
                                                '& .MuiSelect-icon': {
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            <MenuItem value="In Progress" sx={{ color: 'black' }}>In Progress</MenuItem>
                                            <MenuItem value="Running" sx={{ color: 'black' }}>Running</MenuItem>
                                            <MenuItem value="Decommissioned" sx={{ color: 'black' }}>Decommissioned</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ProviderIcon provider={project.provider} />
                                        {project.provider}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {project.createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => handleEditClick(project.id, project.name)}
                                        title="Edit Project"
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                            }
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleDeleteClick(project.id)}
                                        title="Delete Project"
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this project? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
            >
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    {editError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {editError}
                        </Alert>
                    )}
                    <DialogContentText>
                        {editError || 'Enter a new name for the project.'}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Name"
                        type="text"
                        fullWidth
                        value={newProjectName}
                        onChange={(e) => {
                            setNewProjectName(e.target.value);
                            setEditError(null);
                        }}
                        error={!!editError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEditConfirm} 
                        color="primary" 
                        autoFocus
                        disabled={!newProjectName.trim()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProjectList; 