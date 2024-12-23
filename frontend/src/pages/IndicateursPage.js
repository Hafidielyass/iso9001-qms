import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import axios from 'axios';

import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import PageHeader from '../components/PageHeader';

const FREQUENCES = [
  'Quotidienne',
  'Hebdomadaire',
  'Mensuelle',
  'Trimestrielle',
  'Annuelle',
];

function IndicateurCard({ indicateur }) {
  const progression = (indicateur.resultat_obtenu / indicateur.objectif) * 100;
  const isPositive = progression >= 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {indicateur.nom}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {indicateur.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(progression, 100)}
              color={isPositive ? 'success' : 'warning'}
            />
          </Box>
          <Box sx={{ ml: 2 }}>
            {isPositive ? (
              <TrendingUpIcon color="success" />
            ) : (
              <TrendingDownIcon color="warning" />
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {indicateur.resultat_obtenu} / {indicateur.objectif}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Fréquence: {indicateur.frequence_calcul}
        </Typography>
      </CardContent>
    </Card>
  );
}

function IndicateursPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndicateur, setSelectedIndicateur] = useState(null);
  const queryClient = useQueryClient();

  const { data: indicateurs, isLoading } = useQuery(['indicateurs'], async () => {
    const response = await axios.get('http://localhost:5000/api/indicateurs');
    return response.data;
  });

  const createMutation = useMutation(
    async (data) => {
      const response = await axios.post('http://localhost:5000/api/indicateurs', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['indicateurs']);
        setOpenDialog(false);
      },
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await axios.put(`http://localhost:5000/api/indicateurs/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['indicateurs']);
        setOpenDialog(false);
        setSelectedIndicateur(null);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      nom: formData.get('nom'),
      description: formData.get('description'),
      objectif: parseFloat(formData.get('objectif')),
      frequence_calcul: formData.get('frequence_calcul'),
      resultat_obtenu: parseFloat(formData.get('resultat_obtenu') || 0),
    };

    if (selectedIndicateur) {
      updateMutation.mutate({ id: selectedIndicateur.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { field: 'nom', headerName: 'Nom', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'objectif',
      headerName: 'Objectif',
      width: 120,
      type: 'number',
    },
    {
      field: 'resultat_obtenu',
      headerName: 'Résultat',
      width: 120,
      type: 'number',
    },
    {
      field: 'frequence_calcul',
      headerName: 'Fréquence',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Modifier">
            <IconButton
              onClick={() => {
                setSelectedIndicateur(params.row);
                setOpenDialog(true);
              }}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Indicateurs de performance"
        onAdd={() => {
          setSelectedIndicateur(null);
          setOpenDialog(true);
        }}
        buttonLabel="Nouvel indicateur"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {indicateurs?.map((indicateur) => (
          <Grid item xs={12} sm={6} md={4} key={indicateur.id}>
            <IndicateurCard indicateur={indicateur} />
          </Grid>
        ))}
      </Grid>

      <DataTable
        rows={indicateurs || []}
        columns={columns}
        loading={isLoading}
      />

      <FormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedIndicateur(null);
        }}
        title={selectedIndicateur ? 'Modifier l\'indicateur' : 'Nouvel indicateur'}
        onSubmit={handleSubmit}
      >
        <TextField
          autoFocus
          margin="dense"
          name="nom"
          label="Nom"
          type="text"
          fullWidth
          required
          defaultValue={selectedIndicateur?.nom}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={2}
          defaultValue={selectedIndicateur?.description}
        />
        <TextField
          margin="dense"
          name="objectif"
          label="Objectif"
          type="number"
          fullWidth
          required
          defaultValue={selectedIndicateur?.objectif}
        />
        <TextField
          margin="dense"
          name="resultat_obtenu"
          label="Résultat obtenu"
          type="number"
          fullWidth
          defaultValue={selectedIndicateur?.resultat_obtenu}
        />
        <TextField
          margin="dense"
          name="frequence_calcul"
          label="Fréquence de calcul"
          select
          fullWidth
          required
          defaultValue={selectedIndicateur?.frequence_calcul || 'Mensuelle'}
          SelectProps={{
            native: true,
          }}
        >
          {FREQUENCES.map((frequence) => (
            <option key={frequence} value={frequence}>
              {frequence}
            </option>
          ))}
        </TextField>
      </FormDialog>
    </Box>
  );
}

export default IndicateursPage;