const https = require('https');
const fs = require('fs');

require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3010; // Puerto HTTP
const HTTPS_PORT = 443; // Puerto HTTPS
const SECRET_KEY = process.env.JWT_SECRET; // Clave para firmar el token definida en variables de entorno

console.log('Valor de JWT_SECRET:', process.env.JWT_SECRET);

if (!SECRET_KEY) {
    console.error('Error: falta definir JWT_SECRET en las variables de entorno.');
    process.exit(1);
}


// Configuración de seguridad utilizada por el servidor
const TOKEN_EXPIRATION = '1h';

app.use(express.json());
app.use(cookieParser());

// 1. Arreglo con dos usuarios ficticios
const usuarios = [
    { username: 'yilber', password: 'aiep2026' },
    { username: 'matias', password: 'aiep2026' }
];

// 2. Ruta de Login
app.post('/login', (req, res) => {
    const { username, password } = req.body || {};

    // Validar que los datos sean cadenas de texto
if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.trim() === '' ||
    password.trim() === ''
) {
    return res.status(400).json({
        message: 'Usuario y contraseña son obligatorios y deben ser válidos.'
    });
}

    const usuarioValido = usuarios.find(u => u.username === username && u.password === password);

    if (usuarioValido) {
        // Generar token JWT
        const token = jwt.sign({ username: usuarioValido.username }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

        if (!usuarioValido) {
    return res.status(404).json({
        message: 'El usuario no existe.'
    });
}

        // Enviar token como cookie httpOnly
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 
        });

        res.json({ message: 'Login exitoso', token });
    } else {
        // Credenciales incorrectas: Error 401
        res.status(401).json({ message: "Credenciales incorrectas. No autorizado." });
    }
});

// Middleware para proteger rutas
// Middleware para proteger rutas
const verificarToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token || typeof token !== 'string') {
        return res.status(401).json({
            message: 'Acceso denegado. Debe iniciar sesión para acceder a esta ruta.'
        });
    }

    try {
        const verificado = jwt.verify(token, SECRET_KEY);

        req.usuario = verificado;

        next();

    } catch (error) {
        console.error("Error al validar el token:", error.message);

        return res.status(401).json({
            message: "Token inválido o expirado. Debe iniciar sesión nuevamente."
        });
    }
};

// 3. Ruta Privada protegida por el middleware
app.get('/privada', verificarToken, (req, res) => {

    res.status(200).json({
        message: 'Acceso autorizado a la ruta privada.',
        usuario: {
            username: req.usuario.username
        },
        autenticado: true
    });

});

// 4. Ruta de Cierre de sesión (Logout)
app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Sesión cerrada exitosamente. Cookie eliminada.' });
});
const httpsOptions = {
//  key: fs.readFileSync('./cert/privatekey.pem'),
 // cert: fs.readFileSync('./cert/certificate.pem'),

};

app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en puerto ${PORT}`);
});

https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`Servidor HTTPS escuchando en puerto ${HTTPS_PORT}`);
});
