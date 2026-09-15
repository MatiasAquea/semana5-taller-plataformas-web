const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;

const getPort = (value, defaultPort, variableName) => {
    const port = value === undefined || value === '' ? defaultPort : Number(value);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        console.error(`Error: ${variableName} debe ser un puerto entero entre 1 y 65535.`);
        process.exit(1);
    }

    return port;
};

const PORT = getPort(process.env.PORT, 3010, 'PORT');
const HTTPS_PORT = getPort(process.env.HTTPS_PORT, 443, 'HTTPS_PORT');
const CERT_DIRECTORY = path.join(__dirname, 'cert');
const PRIVATE_KEY_PATH = path.join(CERT_DIRECTORY, 'privatekey.pem');
const CERTIFICATE_PATH = path.join(CERT_DIRECTORY, 'certificate.pem');

if (!JWT_SECRET) {
    console.error('Error: falta definir JWT_SECRET en las variables de entorno.');
    process.exit(1);
}


// Configuración de seguridad utilizada por el servidor
const TOKEN_EXPIRATION = '1h';
const TOKEN_MAX_AGE = 60 * 60 * 1000;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict'
};

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Cabeceras globales para reducir la exposición HTTP del backend.
app.use((req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Cross-Origin-Resource-Policy': 'same-origin'
    });
    next();
});

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

    const usuario = usuarios.find(u => u.username === username);

    if (!usuario || usuario.password !== password) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar token JWT y entregarlo solamente mediante cookie httpOnly.
    const token = jwt.sign({ username: usuario.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    res.cookie('token', token, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGE });

    return res.json({ message: 'Login exitoso.' });
});

// Middleware para proteger rutas
const verificarToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado.' });
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Acceso no autorizado.' });
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
    res.clearCookie('token', COOKIE_OPTIONS);
    res.json({ message: 'Sesión cerrada exitosamente. Cookie eliminada.' });
});

const loadHttpsOptions = () => {
    const certificateFiles = [
        { path: PRIVATE_KEY_PATH, name: 'privatekey.pem' },
        { path: CERTIFICATE_PATH, name: 'certificate.pem' }
    ];

    for (const certificateFile of certificateFiles) {
        if (!fs.existsSync(certificateFile.path)) {
            console.error(`Error: falta el archivo de certificado requerido: ${certificateFile.name}.`);
            process.exit(1);
        }
    }

    try {
        return {
            key: fs.readFileSync(PRIVATE_KEY_PATH),
            cert: fs.readFileSync(CERTIFICATE_PATH)
        };
    } catch (error) {
        console.error('Error: no se pudieron leer los certificados HTTPS.');
        process.exit(1);
    }
};

const httpsOptions = loadHttpsOptions();

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en puerto ${PORT}`);
});

httpServer.on('error', (error) => {
  console.error(`Error al iniciar servidor HTTP en puerto ${PORT}: ${error.code || 'desconocido'}.`);
  process.exit(1);
});

const httpsServer = https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
  console.log(`Servidor HTTPS escuchando en puerto ${HTTPS_PORT}`);
});

httpsServer.on('error', (error) => {
  console.error(`Error al iniciar servidor HTTPS en puerto ${HTTPS_PORT}: ${error.code || 'desconocido'}.`);
  process.exit(1);
});
