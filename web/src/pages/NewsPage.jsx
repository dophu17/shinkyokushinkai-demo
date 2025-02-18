import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' or 'edit'
  const [selectedNews, setSelectedNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const bearerToken = localStorage.getItem('token');

  const fetchNews = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/news', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpen = (mode, news = null) => {
    setMode(mode);
    setSelectedNews(news);
    if (news) {
      setFormData({ title: news.title, content: news.content });
    } else {
      setFormData({ title: '', content: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNews(null);
    setFormData({ title: '', content: '' });
  };

  const handleSubmit = async () => {
    try {
      const url = mode === 'add' 
        ? 'http://127.0.0.1:8000/api/news'
        : `http://127.0.0.1:8000/api/news/${selectedNews.id}`;

      const method = mode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleClose();
        fetchNews();
      }
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/news/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          fetchNews();
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'content', headerName: 'Content', width: 400 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={() => handleOpen('edit', params.row)}
            startIcon={<EditIcon />}
          />
          <Button
            onClick={() => handleDelete(params.row.id)}
            startIcon={<DeleteIcon />}
            color="error"
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          News Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('add')}
        >
          Add News
        </Button>
      </Box>

      <DataGrid
        rows={news}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{mode === 'add' ? 'Add News' : 'Edit News'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{mode === 'add' ? 'Add' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 