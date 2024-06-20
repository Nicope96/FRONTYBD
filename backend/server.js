const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());



client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to database');
  }
});

app.post('/api/login', async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      if (contrasena === user.password) {
        res.status(200).json({ success: true, token: 'your-token-here' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, nombre, documento, contrasena } = req.body;
  try {
    // Para la prueba sin encriptar, guardar la contraseña directamente
    const query = 'INSERT INTO users (email, nombre, documento, password) VALUES ($1, $2, $3, $4)';
    const values = [email, nombre, documento, contrasena];
    await client.query(query, values);
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/registros', async (req, res) => {
  try {
      const result = await pool.query('SELECT id, telefono, nombre, documento, email FROM pacientes'); // Cambiar por tu consulta SQL
      const registros = result.rows;
      res.json(registros);
  } catch (err) {
      console.error('Error al obtener registros', err);
      res.status(500).json({ error: 'Error al obtener registros' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
