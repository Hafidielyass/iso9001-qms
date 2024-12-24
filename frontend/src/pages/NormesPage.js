import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';

import DataTable from '../components/DataTable';
import FormDialog from '../components/FormDialog';
import PageHeader from '../components/PageHeader';

function NormesPage() {
  const [openNormeDialog, setOpenNormeDialog] = useState(false);
  const [openExigenceDialog, setOpenExigenceDialog] = useState(false);
  const [openConformiteDialog, setOpenConformiteDialog] = useState(false);
  const [selectedNorme, setSelectedNorme] = useState(null);
  const [selectedExigence, setSelectedExigence] = useState(null);
  const queryClient = useQueryClient();

  const { data: normes, isLoading } = useQuery(['normes'], async () => {
    const response = await axios.get('http://localhost:5000/api/normes');
    return response.data;
  });

  const createNormeMutation = useMutation(
    async (data) => {
      const response = await axios.post('http://localhost:5000/api/normes', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['normes']);
        setOpenNormeDialog(false);
      },
    }
  );

  const createExigenceMutation = useMutation(
    async (data) => {
      const response = await axios.post(`http://localhost:5000/api/normes/${selectedNorme.id}/exigences`, data);
      // console.log()
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['normes']);
        setOpenExigenceDialog(false);
      },
    }
  );

  const createConformiteMutation = useMutation(
    async (data) => {
      const response = await axios.post(`http://localhost:5000/api/exigences/${selectedExigence.id}/conformites`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['normes']);
        setOpenConformiteDialog(false);
      },
    }
  );

  const handleNormeSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      nom: formData.get('nom'),
      description: formData.get('description'),
      sous_chapitre: formData.get('sous_chapitre'),
    };

    createNormeMutation.mutate(data);
  };

  const handleExigenceSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      description: formData.get('description'),
      chapitre_applicable: formData.get('chapitre_applicable'),
    };

    createExigenceMutation.mutate(data);
  };

  const handleConformiteSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      description: formData.get('description'),
      statut: formData.get('statut'),
    };

    createConformiteMutation.mutate(data);
  };

  return (
    <Box>
      <PageHeader
        title="Norme ISO 9001"
        onAdd={() => {
          setSelectedNorme(null);
          setOpenNormeDialog(true);
        }}
        buttonLabel="Nouvelle sous-chapitre"
      />

      {normes?.map((norme) => (
        <Accordion key={norme.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
              {norme.nom}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {norme.sous_chapitre}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" paragraph>
              {norme.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Exigences</Typography>
              <Tooltip title="Ajouter une exigence">
                <IconButton
                  onClick={() => {
                    setSelectedNorme(norme);
                    setOpenExigenceDialog(true);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <List>
              {norme.exigences?.map((exigence) => (
                <ListItem key={exigence.id}>
                  <ListItemText
                    primary={exigence.description}
                    secondary={`Chapitre: ${exigence.chapitre_applicable}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Ajouter une conformité">
                      <IconButton
                        edge="end"
                        onClick={() => {
                          setSelectedExigence(exigence);
                          setOpenConformiteDialog(true);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <FormDialog
        open={openNormeDialog}
        onClose={() => setOpenNormeDialog(false)}
        title="Nouvelle norme"
        onSubmit={handleNormeSubmit}
      >
        <TextField
          autoFocus
          margin="dense"
          name="nom"
          label="Nom"
          type="text"
          fullWidth
          required
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          margin="dense"
          name="sous_chapitre"
          label="Sous-chapitre"
          type="text"
          fullWidth
        />
      </FormDialog>

      <FormDialog
        open={openExigenceDialog}
        onClose={() => {
          setOpenExigenceDialog(false);
          setSelectedNorme(null);
        }}
        title="Nouvelle exigence"
        onSubmit={handleExigenceSubmit}
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
        />
        <TextField
          margin="dense"
          name="chapitre_applicable"
          label="Chapitre applicable"
          type="text"
          fullWidth
          required
        />
      </FormDialog>

      <FormDialog
        open={openConformiteDialog}
        onClose={() => {
          setOpenConformiteDialog(false);
          setSelectedExigence(null);
        }}
        title="Nouvelle conformité"
        onSubmit={handleConformiteSubmit}
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
        />
        <TextField
          margin="dense"
          name="statut"
          label="Statut"
          select
          fullWidth
          required
          defaultValue="En cours"
          SelectProps={{
            native: true,
          }}
        >
          <option value="En cours">En cours</option>
          <option value="Conforme">Conforme</option>
          <option value="Non conforme">Non conforme</option>
        </TextField>
      </FormDialog>
    </Box>
  );
}

export default NormesPage;
