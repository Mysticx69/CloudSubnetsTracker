require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');
const S3_BUCKET = process.env.S3_BUCKET || 'cloud-subnets-tracker-backup';
const S3_KEY = 'data.json';

// Initialize S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'eu-west-3' });

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ projects: [] }, null, 2));
}

// Helper function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { projects: [] };
  }
};

// Function to backup data to S3
const backupToS3 = async (data) => {
  try {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: S3_KEY,
      Body: JSON.stringify(data, null, 2),
      ContentType: 'application/json'
    });
    await s3Client.send(command);
    console.log('Successfully backed up data to S3');
    return true;
  } catch (error) {
    console.error('Error backing up to S3:', error);
    return false;
  }
};

// Helper function to write data
const writeData = async (data) => {
  try {
    // Write to local file
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    // Backup to S3
    await backupToS3(data);
    
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// Helper function to get next subnet
const getNextSubnet = (projects) => {
  const BASE_SUBNET = '172.16';
  if (projects.length === 0) {
    return `${BASE_SUBNET}.1.0/24`;
  }

  const usedSubnets = projects.map(p => {
    const match = p.subnet?.match(/172\.16\.(\d+)\.0\/24/);
    return match ? parseInt(match[1]) : 0;
  });

  const maxSubnet = Math.max(...usedSubnets);
  return `${BASE_SUBNET}.${maxSubnet + 1}.0/24`;
};

// API Routes
app.get('/api/projects', (req, res) => {
  const data = readData();
  res.json(data.projects);
});

app.post('/api/projects', async (req, res) => {
  const data = readData();
  const newProject = {
    ...req.body,
    id: uuidv4(),
    subnet: getNextSubnet(data.projects),
    createdAt: new Date().toISOString()
  };
  
  // Add the new project
  data.projects.push(newProject);
  
  // Save the updated data
  if (await writeData(data)) {
    res.status(201).json(newProject);
  } else {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const data = readData();
  const { id } = req.params;
  const updatedProject = req.body;
  
  // Find and update the project
  const index = data.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    data.projects[index] = { 
      ...data.projects[index], 
      ...updatedProject,
      id: data.projects[index].id,
      subnet: data.projects[index].subnet,
      createdAt: data.projects[index].createdAt
    };
    
    // Save the updated data
    if (await writeData(data)) {
      res.json(data.projects[index]);
    } else {
      res.status(500).json({ error: 'Failed to update project' });
    }
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const data = readData();
  const { id } = req.params;
  
  // Find and remove the project
  const index = data.projects.findIndex(p => p.id === id);
  if (index !== -1) {
    data.projects.splice(index, 1);
    
    // Save the updated data
    if (await writeData(data)) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 