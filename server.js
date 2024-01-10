const express = require("express");
const path = require('path');
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const SECRET_KEY = "coso"
const mariadb = require('mariadb');
const { sendAuthenticatedRequest } = require('./js/auth')

// Configuración de la conexión a la base de datos MariaDB
const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database:"cart",
    connectionLimit: 5});

//configuración de archivos estáticos
app.use('/webfonts', express.static(path.join(__dirname, 'webfonts')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/json', express.static(path.join(__dirname, 'json')));
app.use(express.json());

// Ruta para enviar el archivo index.html al cliente
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
//metodo post para login.html y autenticación de usuario y generación de token JWT
app.post("/login.html", (req, res) => {
    const { email, password } = req.body;
    if (email.trim() !== "" && password.trim() !== "") {
        const token = jwt.sign({ email }, SECRET_KEY);
        res.status(200).json({ token });
        console.log(token);
    } else {
        res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
});

// Middleware para la autenticación
const authMiddleware = (req, res, next) => {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'Token no enviado' });
    }

    // Verifica el token aquí usando jwt.verify
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log(decoded);
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Token inválido' });
    }
  };

  // Ruta para acceder a cart.html con el token como parámetro en la URL
  app.get('/cart.html', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
  });




// Endpoint para agregar productos al carrito en la base de datos
app.post('/cart.html', async (req, res) => {
    let conn;
    try {

      conn = await pool.getConnection();
      const response = await conn.query(
    `INSERT INTO cart(name, unitCost, currency, count, images) VALUE (?, ?, ?, ?, ?)`,
    [req.body.name, req.body.unitCost, req.body.currency, req.body.count, req.body.images]
    );

    res.json({id: parseInt(response.insertId), ...req.body});
    } catch(error){
      res.status(500).json({message:"Algo se rompio"})
    } finally {
      if (conn) conn.release(); //release to pool
    }
});




//resto de rutas para el cliente
app.get('/categories.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'categories.html'));
});

app.get('/categories/:id', (req, res) => {
    const catID = req.params.id;
});

app.get('/my-profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-profile.html'));
});

app.get('/product-info.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'product-info.html'));
});

app.get('/product-info.html/:id', (req, res) => {
    const catID = req.params.id;
});

app.get('/products.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/sell.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sell.html'));
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
