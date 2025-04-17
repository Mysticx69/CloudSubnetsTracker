import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Paper,
    Card,
    CardHeader,
    Avatar,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Button,
} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import AddIcon from '@mui/icons-material/Add';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import { Project, ProjectStatus } from './types/Project';
import { v4 as uuidv4 } from 'uuid';
import { api } from './services/api';

const BASE_SUBNET = '172.16';

type FilterStatus = ProjectStatus | 'All';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      return parsedProjects.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt)
      }));
    }
    return [];
  });
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const getNextSubnet = () => {
    if (projects.length === 0) {
      return `${BASE_SUBNET}.1.0/24`;
    }

    const usedSubnets = projects.map(p => {
      const match = p.subnet.match(/172\.16\.(\d+)\.0\/24/);
      return match ? parseInt(match[1]) : 0;
    });

    const maxSubnet = Math.max(...usedSubnets);
    return `${BASE_SUBNET}.${maxSubnet + 1}.0/24`;
  };

  const handleAddProject = (projectData: Omit<Project, 'id' | 'subnet' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: uuidv4(),
      subnet: getNextSubnet(),
      createdAt: new Date(),
    };

    setProjects([...projects, newProject]);
    setShowForm(false);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status: newStatus }
          : project
      )
    );
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.filter(project => project.id !== projectId)
    );
  };

  const handleEditProject = async (projectId: string, newName: string) => {
    try {
      const updatedProject = await api.updateProject(projectId, { name: newName });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, name: newName }
            : project
        )
      );
    } catch (error) {
      console.error('Failed to update project:', error);
      setError(error instanceof Error ? error.message : 'Failed to update project');
    }
  };

  const getStats = () => {
    return {
      total: projects.length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      production: projects.filter(p => p.status === 'Production').length,
      decommissioned: projects.filter(p => p.status === 'Decommissioned').length,
    };
  };

  const handleFilterClick = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const filteredProjects = filterStatus === 'All'
    ? projects
    : projects.filter(project => project.status === filterStatus);

  const stats = getStats();

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'In Progress':
        return '#ff9800';
      case 'Decommissioned':
        return '#f44336';
      case 'Production':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <CloudIcon />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                Cloud Subnets Tracker
              </Typography>
            </Box>
            <Tooltip title="Add a new project">
              <IconButton 
                color="primary" 
                onClick={() => setShowForm(true)}
                sx={{ 
                  bgcolor: 'primary.light',
                  '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 3,
            mb: 4
          }}>
            <Card 
              sx={{ 
                bgcolor: 'primary.light', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => handleFilterClick('All')}
            >
              <CardHeader
                title="Total"
                subheader="Projects"
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{stats.total}</Avatar>}
              />
            </Card>
            <Card 
              sx={{ 
                bgcolor: 'warning.light', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => handleFilterClick('In Progress')}
            >
              <CardHeader
                title="In Progress"
                subheader="Projects"
                avatar={<Avatar sx={{ bgcolor: 'warning.main' }}>{stats.inProgress}</Avatar>}
              />
            </Card>
            <Card 
              sx={{ 
                bgcolor: 'success.light', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => handleFilterClick('Production')}
            >
              <CardHeader
                title="Production"
                subheader="Projects"
                avatar={<Avatar sx={{ bgcolor: 'success.main' }}>{stats.production}</Avatar>}
              />
            </Card>
            <Card 
              sx={{ 
                bgcolor: 'error.light', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
              onClick={() => handleFilterClick('Decommissioned')}
            >
              <CardHeader
                title="Decommissioned"
                subheader="Projects"
                avatar={<Avatar sx={{ bgcolor: 'error.main' }}>{stats.decommissioned}</Avatar>}
              />
            </Card>
          </Box>

          {showForm && (
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <ProjectForm onSubmit={handleAddProject} existingProjects={projects} />
            </Paper>
          )}
          
          <Paper elevation={2} sx={{ borderRadius: 2 }}>
            <ProjectList 
              projects={filteredProjects} 
              onStatusChange={handleStatusChange}
              onDeleteProject={handleDeleteProject}
              onEditProject={handleEditProject}
            />
          </Paper>
        </Paper>
      </Container>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
