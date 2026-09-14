# 🔐 Actividad Formativa Semana 5
## Taller de Plataformas Web — Servidor HTTPS con Node.js y Express

> Configuración de un servidor HTTPS para el proyecto **Vigilo.cl**, utilizando Node.js, Express y un certificado SSL/TLS autofirmado generado con OpenSSL.

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Framework-000000?logo=express&logoColor=white)
![HTTPS](https://img.shields.io/badge/HTTPS-SSL%2FTLS-2E8B57?logo=letsencrypt&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Control%20de%20versiones-181717?logo=github&logoColor=white)

---

## 📌 Descripción

Este repositorio corresponde a la actividad formativa de la **Semana 5** de la asignatura **Taller de Plataformas Web**.

El proyecto extiende el backend desarrollado para la agencia digital ficticia **Vigilo.cl**, incorporando la configuración de un servidor **HTTPS** en Node.js con Express. La comunicación segura se implementa mediante un certificado **SSL/TLS autofirmado**, generado localmente con OpenSSL.

El objetivo de esta actividad es comprender cómo funcionan los certificados digitales, el cifrado de las comunicaciones y la configuración de HTTPS en un entorno backend.

---

## 🧭 Índice

- [Objetivos](#-objetivos)
- [Tecnologías y herramientas](#-tecnologías-y-herramientas)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación-del-proyecto)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Generación del certificado](#-generación-del-certificado-ssltls-autofirmado)
- [Configuración HTTPS](#-configuración-del-servidor-https-en-express)
- [Ejecución](#-ejecución-del-servidor)
- [Trabajo colaborativo](#-trabajo-colaborativo-y-control-de-versiones)
- [Informe técnico](#-informe-técnico-de-la-actividad)
- [Nota de seguridad](#-nota-de-seguridad)

---

## 🎯 Objetivos

### Objetivo general

Implementar un servidor HTTPS en Node.js y Express utilizando un certificado SSL/TLS autofirmado, documentando el proceso técnico y colaborativo mediante GitHub.

### Objetivos específicos

- Crear una aplicación backend con **Node.js** y **Express**.
- Generar una clave privada y un certificado SSL/TLS autofirmado mediante **OpenSSL**.
- Configurar Express para atender solicitudes bajo el protocolo **HTTPS**.
- Utilizar los módulos nativos `https` y `fs` de Node.js para crear el servidor y leer los certificados.
- Probar la ejecución local del servidor desde `https://localhost`.
- Documentar el comportamiento del navegador ante un certificado autofirmado.
- Mantener el código y la documentación organizados para facilitar su comprensión.
- Registrar el trabajo del equipo mediante Git, GitHub y mensajes de commit descriptivos.
- Explicar la diferencia entre un certificado autofirmado y un certificado válido para producción.

---

## 🛠 Tecnologías y herramientas

| Tecnología / herramienta | Uso en el proyecto |
|---|---|
| Node.js | Entorno de ejecución del servidor backend |
| Express.js | Creación de la aplicación web y definición de rutas |
| `https` | Módulo nativo para crear el servidor HTTPS |
| `fs` | Lectura de la clave privada y el certificado |
| OpenSSL | Generación del certificado SSL/TLS autofirmado |
| Git y GitHub | Control de versiones y trabajo colaborativo |
| Visual Studio Code | Desarrollo y edición del código |
| Navegador web | Pruebas de HTTPS y visualización de advertencias |
| Postman | Pruebas opcionales de rutas y endpoints |

---

## ✅ Requisitos previos

Antes de ejecutar el proyecto, verifica que tengas instalado:

- Node.js en una versión LTS.
- npm, incluido con Node.js.
- Git y Git Bash.
- OpenSSL.
- Un editor de código, como Visual Studio Code.
- Un navegador web actualizado.

Puedes comprobar algunas instalaciones con los siguientes comandos:

```bash
node -v
npm -v
git --version
openssl version
```

---

## 📥 Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Vigilalo/semana-4-taller-de-plataformas-web.git semana-5-taller-plataformas-web
cd semana5-taller-plataformas-web
```

### 2. Instalar dependencias

```bash
npm install
```

---

## 📁 Estructura del proyecto

```text
semana5-taller-plataformas-web/
│
├── cert/                  # Certificados locales; no se suben a GitHub
│   ├── privatekey.pem     # Clave privada
│   ├── request.csr        # Solicitud de firma de certificado
│   └── certificate.pem    # Certificado SSL/TLS autofirmado
│
├── server.js              # Servidor Express configurado con HTTPS
├── package.json           # Dependencias y scripts del proyecto
├── package-lock.json      # Registro de versiones de dependencias
├── .gitignore             # Archivos y carpetas excluidos del repositorio
└── README.md              # Documentación general del proyecto
```

> ⚠️ La carpeta `cert/` está incluida en `.gitignore`. Las claves privadas y los certificados locales no deben subirse a un repositorio público.

---

## 🔏 Generación del certificado SSL/TLS autofirmado

Los certificados se generan localmente mediante **OpenSSL** y se guardan en la carpeta `cert/`.

### 1. Crear la carpeta de certificados

```bash
mkdir cert
```

### 2. Generar la clave privada

```bash
openssl genrsa -out cert/privatekey.pem 2048
```

### 3. Generar una solicitud de firma de certificado

```bash
openssl req -new -key cert/privatekey.pem -out cert/request.csr
```

Durante este proceso, OpenSSL solicitará información del certificado. Para pruebas locales, se puede utilizar `localhost` como nombre común.

### 4. Generar el certificado autofirmado

```bash
openssl x509 -req -days 365 -in cert/request.csr -signkey cert/privatekey.pem -out cert/certificate.pem
```

El certificado generado tiene una duración de **365 días**.

> ⚠️ El certificado autofirmado permite cifrar la comunicación entre el navegador y el servidor, pero no cuenta con la validación de una Autoridad Certificadora reconocida. Por este motivo, el navegador mostrará una advertencia de seguridad.

---

## ⚙️ Configuración del servidor HTTPS en Express

El servidor HTTPS utiliza los siguientes módulos:

- `express` para crear la aplicación y administrar rutas.
- `fs` para leer la clave privada y el certificado.
- `https` para crear el servidor seguro.

El flujo general de configuración consiste en:

1. Importar las dependencias necesarias.
2. Crear la aplicación Express.
3. Leer la clave privada y el certificado almacenados en `cert/`.
4. Crear el servidor HTTPS con las credenciales cargadas.
5. Escuchar en el puerto definido en `server.js`.

Ejemplo de configuración:

```js
const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

const httpsOptions = {
  key: fs.readFileSync("./cert/privatekey.pem"),
  cert: fs.readFileSync("./cert/certificate.pem"),
};

https.createServer(httpsOptions, app).listen(443, () => {
  console.log("Servidor HTTPS activo en [https://localhost](https://localhost)");
});
```

> ℹ️ El puerto del ejemplo puede variar según la configuración real del archivo `server.js`. Verifica el puerto configurado antes de ejecutar el proyecto.

---

## ▶️ Ejecución del servidor

Instala las dependencias y ejecuta el archivo principal:

```bash
npm install
node server.js
```

Si el proyecto incluye un script `start` en `package.json`, también puede ejecutarse mediante:

```bash
npm start
```

Luego, ingresa desde el navegador a la dirección correspondiente al puerto definido en `server.js`.

Ejemplos:

```text
[https://localhost](https://localhost)
```

```text
[https://localhost:8080](https://localhost:8080)
```

### Advertencia esperada del navegador

Debido a que el certificado es autofirmado, el navegador puede mostrar mensajes como:

> “Tu conexión no es privada”  
> “El certificado de este sitio no es de confianza”

La advertencia no significa necesariamente que la conexión no esté cifrada. Indica que el navegador no puede verificar la identidad del emisor del certificado mediante una entidad de confianza.

En un entorno productivo, esta situación se resuelve utilizando certificados válidos emitidos por una Autoridad Certificadora, por ejemplo, **Let's Encrypt**, mediante herramientas como **Certbot**, o certificados entregados por proveedores comerciales.

---

## 👥 Trabajo colaborativo y control de versiones

El proyecto se desarrolla de forma grupal utilizando **Git** y **GitHub** para registrar el avance técnico y documental.

- Cada integrante participa en tareas asociadas a su rol.
- Los cambios se registran mediante commits descriptivos.
- Se mantiene un historial de versiones para evidenciar el trabajo realizado.
- La actividad considera un mínimo de **4 commits por integrante**.

### Roles del equipo

| Integrante | Rol principal |
|---|---|
| Matías Aquea | Documentación, pruebas y configuración de servidor HTTPS |
| Yilber Yáñez | Validación de rutas y pruebas de funcionamiento |
| Víctor Aizpurua | Backend y seguridad: configuración de Express y middleware |

### Aportes destacados de Matías Aquea

- Actualización de la documentación de la actividad Semana 5.
- Configuración del servidor HTTPS con Node.js y Express.
- Generación y gestión local del certificado SSL/TLS autofirmado.
- Exclusión de la carpeta `cert/` mediante `.gitignore`.
- Pruebas de acceso y funcionamiento local del servidor HTTPS.

---

## 📄 Informe técnico de la actividad

El proyecto incluye un informe técnico grupal en formato Word que documenta:

- Los comandos utilizados para generar el certificado SSL/TLS con OpenSSL.
- La configuración HTTPS implementada en el servidor Express.
- Fragmentos de código fuente comentados.
- Evidencias de ejecución y pruebas realizadas desde el navegador.
- La advertencia generada por el certificado autofirmado.
- La diferencia entre certificados autofirmados y certificados válidos para producción.
- Roles de los integrantes y evidencias de trabajo colaborativo.
- Capturas de commits, ramas y otros registros del repositorio.

---

## 🔒 Nota de seguridad

Este proyecto utiliza certificados **autofirmados** exclusivamente con fines académicos y de desarrollo local.

No se recomienda usar certificados autofirmados en un sitio web público o en producción. En esos casos, se debe utilizar un certificado válido emitido por una Autoridad Certificadora confiable.

También se recomienda:

- Mantener las claves privadas fuera del repositorio.
- Utilizar `.gitignore` para excluir certificados y archivos sensibles.
- Gestionar secretos mediante variables de entorno.
- Renovar los certificados antes de su vencimiento.
- Redirigir las solicitudes HTTP hacia HTTPS en ambientes productivos.

---

## ✍️ Autores

Proyecto desarrollado para la actividad formativa de la **Semana 5** de la asignatura **Taller de Plataformas Web**.

| Integrante | Participación |
|---|---|
| Matías Aquea | Documentación, pruebas y configuración HTTPS |
| Yilber Yáñez | Validación de rutas y pruebas funcionales |
| Víctor Aizpurua | Backend, Express y middleware de seguridad |