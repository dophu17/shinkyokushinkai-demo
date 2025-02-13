import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTM4YmMzY2FjZjcwODJkMzI5MTFiYjVjYzFmNTZlNzY4YjQ2YTBlMTIyYTRlNjZiZmRlMTRlNjA0MWQ4NDhlMzRiODg3YTU4ZjdiMjA0NWMiLCJpYXQiOjE3MzkzNDQ4ODAuMTE4MDE5LCJuYmYiOjE3MzkzNDQ4ODAuMTE4MDIsImV4cCI6MTc3MDg4MDg4MC4xMTUyMDcsInN1YiI6IjYiLCJzY29wZXMiOltdfQ.iQ3v0Iwm7nfhDGqbNs5PSum8pQJ3_7eShfXDh2q4Z4_YKa-ux7sT-sNAJ7Tv1uTJdkc2PGxunIlvG5U4IFKu-OelFhM7W9ptx-6G1nUrXpL53wgLb8nO4y5r0W_nwLsGWKn0EVPxFWrZ5f8ySOegb_lrF8h3gGDSUzIqt1kIVQXh_Ut7iO8JD1hJW0FIn7h7P8-sYcBy4b75b1Bj2X8e37d8LiO0jHwBJkBC3J-stNhK4Ef8Jk6LW8bIToQhBXj3csGBgqxwLQdULhi8AA11b1jhkXVaJtCx2zRCkezLhq0K-7P2k4ehd3_ClpP3-QEgupMsjQxLtiDolp_c5iedr6KGJzYwdGMuVlA4l0svFp4TI8sBD27K_3dgfec9pWS8jiXnb4YvQCOLs3MFR3p7ePRoYY_t2PEPa37uSFk1246_rz3_w3AWoujhPWQAZQ2jv06rh7JgHZNEdbbxfsn7I7jM4Zv4rhMgQl3FoGfYztnux6BxHDJhwRAzLBHBUT6ENYM7Qg3UXcQ5DzHjw9dgFXaSKYHGTpFgqz8Kv_TdJxSU6ycR1fZXIVTwWSdUAwQAEF4AsvZEyS_eV0racsMG0muPQGFjy1GiuQ-FQO0vMUrc8x8aH9TLNdZU64BE3dahCKF0xAzrviYFVY5ZpEd_4CKcJRyr9O_r-zfr8-KFHPI')
  const bearerToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/list', {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setUsers(data.success);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <Typography>
        Welcome to your user list page
      </Typography>
      <DataGrid
        rows={users}
        columns={[
          { field: 'id', headerName: 'ID', width: 90 },
          { field: 'name', headerName: 'Name', width: 130 },
          { field: 'email', headerName: 'Email', width: 200 },
        ]}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}