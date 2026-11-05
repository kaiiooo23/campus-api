const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API endpoint to get all mahasiswa
app.get('/api/mahasiswa', async (req, res) => {
    const { data, error } = await supabase.from('mahasiswa').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});

// API endpoint to add a new mahasiswa
app.post('/api/mahasiswa', async (req, res) => {
    const {nim, nama_lengkap, program_studi} = req.body;
    const {data, error} = await supabase.from('mahasiswa').insert([{ nim, nama_lengkap, program_studi }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({message: 'Mahasiswa added successfully', data});
});

// API endpoint to update a mahasiswa
app.put('/api/mahasiswa/:id', async (req, res) => {
    const { id } = req.params; // Pastikan mengambil dari req.params
    const { nim, nama_lengkap, program_studi } = req.body;
    if (!id || id === 'undefined') {
        return res.status(400).json({ error: 'ID tidak valid' });}
    const { data, error } = await supabase.from('mahasiswa').update({ nim, nama_lengkap, program_studi }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Data berhasil diupdate', data });
});

// API endpoint to delete a mahasiswa
app.delete('/api/mahasiswa/:id', async (req, res) => {
    const { id } = req.params; // Pastikan mengambil dari req.params
    if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'ID tidak valid' });}
    const { data, error } = await supabase.from('mahasiswa').delete().eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Data berhasil dihapus', data });
});

module.exports = app;
