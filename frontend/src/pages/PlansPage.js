import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Box,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';

import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import PageHeader from '../components/PageHeader';

const STATUTS = [
  { value: 'En attente', color: 'default' },
  { value: 'En cours', color: 'primary' },
  { value: 'Terminé', color: 'success' },
  { value: 'En retard', color: 'error' },
];

const PRIORITES = [
  { value: 'Basse', color: 'info' },
  { value: 'Normale', color: 'warning' },
  { value: 'Haute', color: 'error' },
];

function PlansPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery(['plans'], async () => {
    const response = await axios.get('http://localhost:5000/api/plans');
    return response.data;
  });

  const { data: users } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    return response.data;
  });

  const createMutation = useMutation(
    async (data) => {
      const response = await axios.post('http://localhost:5000/api/plans', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['plans']);
        setOpenDialog(false);
      },
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await axios.put(`http://localhost:5000/api/plans/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['plans']);
        setOpenDialog(false);
        setSelectedPlan(null);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      description: formData.get('description'),
      date_debut: formData.get('date_debut'),
      date_fin: formData.get('date_fin'),
      statut: formData.get('statut'),
      priorite: formData.get('priorite'),
      responsable_id: parseInt(formData.get('responsable_id')),
    };

    if (selectedPlan) {
      updateMutation.mutate({ id: selectedPlan.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'date_debut',
      headerName: 'Date de début',
      width: 180,
      valueFormatter: (params) =>
        params.value ? format(new Date(params.value), 'dd MMMM yyyy', { locale: fr }) : '-',
    },
    {
      field: 'date_fin',
      headerName: 'Date de fin',
      width: 180,
      valueFormatter: (params) =>
        params.value ? format(new Date(params.value), 'dd MMMM yyyy', { locale: fr }) : '-',
    },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 130,
      renderCell: (params) => {
        const statut = STATUTS.find((s) => s.value === params.value);
        return (
          <Chip
            label={params.value}
            color={statut?.color || 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'priorite',
      headerName: 'Priorité',
      width: 130,
      renderCell: (params) => {
        const priorite = PRIORITES.find((p) => p.value === params.value);
        return (
          <Chip
            label={params.value}
            color={priorite?.color || 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'responsable',
      headerName: 'Responsable',
      width: 150,
      valueGetter: (params) => params.row.responsable?.nom || '-',
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
                setSelectedPlan(params.row);
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
        title="Plans d'action"
        onAdd={() => {
          setSelectedPlan(null);
          setOpenDialog(true);
        }}
        buttonLabel="Nouveau plan"
      />

      <DataTable
        rows={plans || []}
        columns={columns}
        loading={isLoading}
      />

      <FormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedPlan(null);
        }}
        title={selectedPlan ? 'Modifier le plan' : 'Nouveau plan'}
        onSubmit={handleSubmit}
      >
        <TextField
          autoFocus
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          required
          multiline
          rows={3}
          defaultValue={selectedPlan?.description}
        />
        <TextField
          margin="dense"
          name="date_debut"
          label="Date de début"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          defaultValue={selectedPlan?.date_debut?.split('T')[0]}
        />
        <TextField
          margin="dense"
          name="date_fin"
          label="Date de fin"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          defaultValue={selectedPlan?.date_fin?.split('T')[0]}
        />
        <TextField
          margin="dense"
          name="statut"
          label="Statut"
          select
          fullWidth
          required
          defaultValue={selectedPlan?.statut || 'En attente'}
        >
          {STATUTS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          name="priorite"
          label="Priorité"
          select
          fullWidth
          required
          defaultValue={selectedPlan?.priorite || 'Normale'}
        >
          {PRIORITES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          name="responsable_id"
          label="Responsable"
          select
          fullWidth
          required
          defaultValue={selectedPlan?.responsable_id}
        >
          {users?.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.nom}
            </MenuItem>
          ))}
        </TextField>
      </FormDialog>
    </Box>
  );
}

export default PlansPage;
