# Actividad formativa Semana 5 – Taller de plataformas Web

Servidor HTTPS en Node.js y Express con certificado SSL/TLS autofirmado para el proyecto Vigilo.cl.

---

## Descripción del proyecto

Este repositorio corresponde a la actividad formativa de la **Semana 5** de la asignatura **Taller de plataformas Web**.  
El proyecto extiende el backend desarrollado anteriormente para la agencia digital ficticia **Vigilo.cl**, incorporando ahora la configuración de un **servidor HTTPS** en Node.js con Express, utilizando un **certificado SSL/TLS autofirmado** generado mediante OpenSSL.

El objetivo principal es aplicar herramientas digitales de seguridad para comprender cómo se configuran certificados, protocolos y cifrado en un entorno de backend, preparando la base para escenarios reales de producción.

---

## Objetivos de la actividad

### Objetivo general

Implementar un servidor HTTPS en Node.js y Express utilizando un certificado SSL/TLS autofirmado, documentando el proceso técnico y colaborativo en GitHub.

### Objetivos específicos

- Crear una aplicación básica en **Node.js** con **Express**.
- Generar un **certificado SSL autofirmado** con **OpenSSL**, incluyendo clave privada y certificado.
- Configurar el servidor Express para funcionar bajo **HTTPS**, utilizando el módulo nativo `https` de Node.js y el módulo `fs` para leer los certificados.
- Probar el servidor en `https://localhost` (puerto 443 o 8080, según la configuración local) y describir el comportamiento del navegador frente al certificado autofirmado.
- Comentar el código fuente para facilitar la comprensión del servidor HTTPS y sus rutas.
- Registrar el trabajo colaborativo del equipo mediante ramas, commits y Pull Requests en GitHub, con un mínimo de 4 commits por integrante.
- Reflexionar sobre por qué el navegador marca el sitio como inseguro a pesar de usar HTTPS y cómo se soluciona este problema en un entorno productivo real (por ejemplo, usando Let’s Encrypt o proveedores comerciales).

---

## Tecnologías y herramientas utilizadas

- **Node.js** – Ejecución del servidor backend.
- **Express.js** – Creación de la aplicación y definición de rutas HTTP/HTTPS.
- **https (módulo nativo de Node.js)** – Creación del servidor HTTPS.
- **fs (File System)** – Lectura de la clave privada y el certificado autofirmado.
- **OpenSSL** – Generación de la clave privada y del certificado SSL/TLS autofirmado.
- **Git y GitHub** – Control de versiones, colaboración mediante ramas y Pull Requests.
- **Visual Studio Code** – Edición y desarrollo del código.
- **Navegador web** (Chrome, Edge, Firefox) – Pruebas del comportamiento del navegador frente al certificado autofirmado.
- **Postman** (opcional) – Pruebas adicionales de las rutas del servidor.

---

## Requisitos previos

Antes de ejecutar el proyecto, se recomienda contar con:

- Node.js (versión LTS recomendada)
- npm (incluido con Node.js)
- Git y Git Bash
- OpenSSL instalado en el sistema
- Editor de código (Visual Studio Code u otro)

---

## Instalación del proyecto

1. Clonar el repositorio de la actividad Semana 5:

   ```bash
   git clone <URL_DE_ESTE_REPOSITORIO> semana5-taller-plataformas-web
   cd semana5-taller-plataformas-web
   ```

2. Instalar las dependencias del proyecto:

   ```bash
   npm install
   ```

---

## Estructura general del proyecto

La estructura base del proyecto incluye:

- `server.js` – Archivo principal del servidor Express.
- `package.json` – Definición de dependencias y scripts de ejecución.
- `package-lock.json` – Registro de versiones exactas de las dependencias.
- `.gitignore` – Archivos y carpetas excluidos del repositorio (incluye certificados).
- `cert/` – Carpeta local para almacenar la clave privada y el certificado autofirmado (no se sube a GitHub).
- `README.md` – Documentación general del proyecto.
- Informe Word de la actividad Semana 5 (almacenado en el repositorio según la pauta).

---

## Generación del certificado SSL/TLS autofirmado

Los certificados se generan mediante **OpenSSL** y se guardan en la carpeta `cert/`.  
Un flujo típico de comandos es el siguiente (ejemplo):

1. Generar la clave privada:

   ```bash
   openssl genrsa -out cert/privatekey.pem 2048
   ```

2. Generar la CSR (Certificate Signing Request):

   ```bash
   openssl req -new -key cert/privatekey.pem -out cert/request.csr
   ```

3. Generar el certificado autofirmado (válido por 365 días):

   ```bash
   openssl x509 -req -days 365 -in cert/request.csr -signkey cert/privatekey.pem -out cert/certificate.pem
   ```

La carpeta `cert/` se agrega al archivo `.gitignore` para evitar subir la clave privada y el certificado al repositorio, siguiendo buenas prácticas de seguridad.

---

## Configuración del servidor HTTPS en Express

El servidor HTTPS se configura utilizando los módulos `https` y `fs` de Node.js.  
De forma general, el flujo es:

1. Importar las dependencias necesarias (`express`, `https`, `fs`).
2. Crear la aplicación Express (`const app = express()`).
3. Leer la clave privada y el certificado desde la carpeta `cert/` utilizando `fs.readFileSync`.
4. Crear el servidor HTTPS con `https.createServer({ key, cert }, app)`.
5. Escuchar en el puerto 443 o 8080 y registrar un mensaje en consola indicando que el servidor HTTPS se encuentra activo.

Las rutas existentes del backend (por ejemplo, login, ruta privada y logout) continúan funcionando, ahora protegidas por HTTPS.

---

## Ejecución del servidor

Para iniciar el servidor:

```bash
node server.js
# o, si existe script en package.json:
npm start
```

Luego, acceder desde el navegador a:

```text
[https://localhost:443](https://localhost:443)
```

o al puerto configurado para el servidor HTTPS.

Durante las pruebas, el navegador mostrará una advertencia indicando que el certificado no es de confianza (sitio no seguro) debido a que se trata de un certificado autofirmado. Esta conducta se documenta en el informe, junto con las capturas de pantalla y la reflexión sobre el uso de certificados emitidos por Autoridades Certificadoras reales.

---

## Trabajo colaborativo y control de versiones

El proyecto se desarrolla de forma **grupal**, con tres integrantes, utilizando Git y GitHub:

- Cada integrante trabaja en una rama independiente asociada a sus tareas principales.
- Las funcionalidades se integran mediante **Pull Requests**, siguiendo la pauta de la asignatura.
- Se registra un mínimo de **4 commits por integrante**, con mensajes claros y descriptivos.

### Roles del equipo (Resumen)

| Integrante       | Rol principal                                              |
|------------------|------------------------------------------------------------|
| Matías Aquea     | Documentación, pruebas y configuración de servidor HTTPS  |
| Yilber Yáñez     | Validación de rutas y pruebas de funcionamiento            |
| Víctor Aizpurua  | Backend y seguridad (configuración de Express y middleware)|

En el informe Word se detalla la participación de cada integrante, la matriz de responsabilidades y las evidencias de commits y Pull Requests.

---

## Informe técnico de la actividad

Además del código fuente, el proyecto incluye un **informe técnico grupal** en formato Word, que documenta:

- Comandos utilizados para la generación del certificado SSL/TLS con OpenSSL.
- Explicación de la configuración HTTPS en Express.
- Evidencias de pruebas realizadas en el navegador (capturas de advertencias y funcionamiento).
- Fragmentos de código fuente comentados.
- Roles del equipo y evidencias de trabajo colaborativo en GitHub.
- Un párrafo reflexivo que responde por qué el navegador marca el sitio como inseguro a pesar de usar HTTPS y cómo se soluciona en un entorno productivo real (uso de Let’s Encrypt, Certbot u otras Autoridades Certificadoras comerciales).

Este informe se sube junto con el código al repositorio GitHub grupal y a la plataforma virtual de la asignatura, según las indicaciones del docente.