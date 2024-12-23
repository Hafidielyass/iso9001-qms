import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import axios from 'axios';

import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import PageHeader from '../components/PageHeader';

function AuditsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const queryClient = useQueryClient();

  const { data: audits, isLoading } = useQuery(['audits'], async () => {
    const response = await axios.get('http://localhost:5000/api/audits');
    return response.data;
  });

  const createMutation = useMutation(
    async (data) => {
      const response = await axios.post('http://localhost:5000/api/audits', data);
      console.log(response.data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['audits']);
        setOpenDialog(false);
      },
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await axios.put(`http://localhost:5000/api/audits/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['audits']);
        setOpenDialog(false);
        setSelectedAudit(null);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      date: formData.get('date'),
      description: formData.get('description'),
      resultat: formData.get('resultat'),
    };

    if (selectedAudit) {
      updateMutation.mutate({ id: selectedAudit.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      width: 180,
      valueFormatter: (params) =>
        format(new Date(params.value), 'dd MMMM yyyy', { locale: fr }),
    },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'auditeur',
      headerName: 'Auditeur',
      width: 150,
      valueGetter: (params) => params.row.auditeur?.nom || '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Voir les résultats">
            <IconButton
              onClick={() => {
                setSelectedAudit(params.row);
                setOpenViewDialog(true);
              }}
              size="small"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton
              onClick={() => {
                setSelectedAudit(params.row);
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
        title="Audits"
        onAdd={() => {
          setSelectedAudit(null);
          setOpenDialog(true);
        }}
        buttonLabel="Nouvel audit"
      />

      <DataTable
        rows={audits || []}
        columns={columns}
        loading={isLoading}
      />

      <FormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedAudit(null);
        }}
        title={selectedAudit ? 'Modifier l\'audit' : 'Nouvel audit'}
        onSubmit={handleSubmit}
      >
        <TextField
          margin="dense"
          name="date"
          label="Date"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          defaultValue={selectedAudit?.date?.split('T')[0]}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          required
          multiline
          rows={3}
          defaultValue={selectedAudit?.description}
        />
        <TextField
          margin="dense"
          name="resultat"
          label="Résultats"
          type="text"
          fullWidth
          multiline
          rows={4}
          defaultValue={selectedAudit?.resultat}
        />
      </FormDialog>

      <FormDialog
        open={openViewDialog}
        onClose={() => {
          setOpenViewDialog(false);
          setSelectedAudit(null);
        }}
        title="Résultats de l'audit"
      >
        <Typography variant="subtitle1" gutterBottom>
          Date: {selectedAudit?.date && format(new Date(selectedAudit.date), 'dd MMMM yyyy', { locale: fr })}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Auditeur: {selectedAudit?.auditeur?.nom || '-'}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Description:
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedAudit?.description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Résultats:
        </Typography>
        <Typography variant="body1" paragraph>
          {selectedAudit?.resultat || 'Aucun résultat enregistré'}
        </Typography>
      </FormDialog>
    </Box>
  );
}

export default AuditsPage;
