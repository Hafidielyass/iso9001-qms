import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import PageHeader from '../components/PageHeader';

function DocumentsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery(['documents'], async () => {
    const response = await axios.get('http://localhost:5000/api/documents');
    return response.data;
  });

  const createMutation = useMutation(
    async (formData) => {
      const response = await axios.post('http://localhost:5000/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents']);
        setOpenDialog(false);
      },
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }) => {
      const response = await axios.put(`http://localhost:5000/api/documents/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents']);
        setOpenDialog(false);
        setSelectedDocument(null);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (selectedDocument) {
      updateMutation.mutate({
        id: selectedDocument.id,
        data: Object.fromEntries(formData),
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/documents/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.pdf'); // Nom par défaut
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const columns = [
    { field: 'titre', headerName: 'Titre', flex: 1 },
    { field: 'reference', headerName: 'Référence', flex: 1 },
    { field: 'version', headerName: 'Version', width: 100 },
    {
      field: 'date_creation',
      headerName: 'Date de création',
      width: 180,
      valueFormatter: (params) =>
        format(new Date(params.value), 'dd MMMM yyyy', { locale: fr }),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Télécharger">
            <IconButton onClick={() => handleDownload(params.row.id)} size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton
              onClick={() => {
                setSelectedDocument(params.row);
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
        title="Documents"
        onAdd={() => {
          setSelectedDocument(null);
          setOpenDialog(true);
        }}
        buttonLabel="Nouveau document"
      />

      <DataTable
        rows={documents || []}
        columns={columns}
        loading={isLoading}
      />

      <FormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedDocument(null);
        }}
        title={selectedDocument ? 'Modifier le document' : 'Nouveau document'}
        onSubmit={handleSubmit}
      >
        <TextField
          autoFocus
          margin="dense"
          name="titre"
          label="Titre"
          type="text"
          fullWidth
          required
          defaultValue={selectedDocument?.titre}
        />
        <TextField
          margin="dense"
          name="reference"
          label="Référence"
          type="text"
          fullWidth
          required
          defaultValue={selectedDocument?.reference}
        />
        <TextField
          margin="dense"
          name="version"
          label="Version"
          type="text"
          fullWidth
          defaultValue={selectedDocument?.version || '1.0'}
        />
        {!selectedDocument && (
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sélectionner un fichier
            <input
              type="file"
              name="file"
              hidden
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </Button>
        )}
      </FormDialog>
    </Box>
  );
}

export default DocumentsPage;
