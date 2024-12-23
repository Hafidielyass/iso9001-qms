import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Description,
  Assignment,
  Assessment,
  BarChart,
  Warning,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 40, mr: 2 } })}
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ textAlign: 'center' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

function DashboardPage() {
  const { data: documents } = useQuery(['documents'], async () => {
    const response = await axios.get('http://localhost:5000/api/documents');
    return response.data;
  });

  const { data: plans } = useQuery(['plans'], async () => {
    const response = await axios.get('http://localhost:5000/api/plans');
    return response.data;
  });

  const { data: audits } = useQuery(['audits'], async () => {
    const response = await axios.get('http://localhost:5000/api/audits');
    return response.data;
  });

  const { data: indicateurs } = useQuery(['indicateurs'], async () => {
    const response = await axios.get('http://localhost:5000/api/indicateurs');
    return response.data;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Tableau de bord
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Documents"
            value={documents?.length || 0}
            icon={<Description />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Plans d'action"
            value={plans?.length || 0}
            icon={<Assignment />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Audits"
            value={audits?.length || 0}
            icon={<Assessment />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Indicateurs"
            value={indicateurs?.length || 0}
            icon={<BarChart />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Non-conformités"
            value={plans?.filter(p => p.type === 'non-conformite')?.length || 0}
            icon={<Warning />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Graphiques et tableaux à ajouter ici */}
    </Box>
  );
}

export default DashboardPage;
