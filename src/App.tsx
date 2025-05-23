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
    CircularProgress,
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.getProjects();
        setProjects(data.map(project => ({
          ...project,
          createdAt: new Date(project.createdAt)
        })));
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

  const handleAddProject = async (projectData: Omit<Project, 'id' | 'subnet' | 'createdAt'>) => {
    try {
      const savedProject = await api.addProject(projectData);
      
      if (savedProject) {
        setProjects(prev => [...prev, {
          ...savedProject,
          createdAt: new Date(savedProject.createdAt)
        }]);
        setShowForm(false);
      } else {
        setError('Failed to add project. Please try again.');
      }
    } catch (err) {
      setError('Failed to add project. Please try again.');
      console.error(err);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const updatedProject = await api.updateProject(projectId, { status: newStatus });
      
      if (updatedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === projectId
              ? { ...project, status: newStatus }
              : project
          )
        );
      } else {
        setError('Failed to update project status. Please try again.');
      }
    } catch (err) {
      setError('Failed to update project status. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const success = await api.deleteProject(projectId);
      
      if (success) {
        setProjects(prevProjects =>
          prevProjects.filter(project => project.id !== projectId)
        );
      } else {
        setError('Failed to delete project. Please try again.');
      }
    } catch (err) {
      setError('Failed to delete project. Please try again.');
      console.error(err);
    }
  };

  const handleEditProject = async (projectId: string, newName: string) => {
    try {
      const updatedProject = await api.updateProject(projectId, { name: newName });
      
      if (updatedProject) {
        setProjects(prevProjects =>
          prevProjects.map(project =>
            project.id === projectId
              ? { ...project, name: newName }
              : project
          )
        );
      } else {
        setError('Failed to update project name. Please try again.');
      }
    } catch (err) {
      setError('Failed to update project name. Please try again.');
      console.error(err);
    }
  };

  const getStats = () => {
    return {
      total: projects.length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      running: projects.filter(p => p.status === 'Running').length,
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
      case 'Running':
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
              onClick={() => handleFilterClick('Running')}
            >
              <CardHeader
                title="Running"
                subheader="Projects"
                avatar={<Avatar sx={{ bgcolor: 'success.main' }}>{stats.running}</Avatar>}
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ProjectList 
                projects={filteredProjects} 
                onStatusChange={handleStatusChange}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleEditProject}
              />
            )}
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
