# Proyecto de Graduación

Este repositorio contiene el código para el proyecto de graduación.

# 🎮 Platyfa Frontend

Frontend del proyecto **Platyfa**, un videojuego innovador que combina análisis estadístico, gestión de usuarios y un dashboard interactivo para visualizar el rendimiento del jugador.

## 🚀 Descripción del Proyecto

El frontend de Platyfa está construido con **React.js** y utiliza tecnologías modernas para ofrecer una experiencia fluida y atractiva para los usuarios. Incluye funcionalidades como:

- **Autenticación de usuarios**: registro, inicio de sesión y restauración de cuentas eliminadas.
- **Visualización de estadísticas de juego**: gráficos interactivos para analizar el rendimiento.
- **Gestión de perfil de usuario**: actualización de datos y carga de imágenes.
- **Diseño intuitivo y responsivo**: notificaciones interactivas y experiencia optimizada para dispositivos móviles.

## 🛠️ Tecnologías Utilizadas

- **React.js**: Framework principal para el desarrollo de la interfaz.
- **TailwindCSS**: Diseño moderno y estilizado.
- **Recharts**: Biblioteca de gráficos para estadísticas interactivas.
- **React Router**: Navegación de páginas y manejo de rutas.
- **Firebase**: Gestión de almacenamiento de imágenes.
- **JWT**: Autenticación segura basada en tokens.

## 🔧 Instalación y Uso

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/platyfa-backend.git
cd platyfa-backend
```

### 2️⃣ Instalar Dependencias

Asegúrate de tener **Node.js** instalado en tu sistema. Luego, ejecuta el siguiente comando en la raíz del proyecto para instalar todas las dependencias necesarias:

```bash
npm install
```

## 3️⃣ Ejecutar el Proyecto

Una vez configurado, puedes ejecutar el proyecto con el siguiente comando:

```bash
npm start
```

Si se quiere ejecutar en modo desarrollo utiliza el siguiente comando:

```bash
npm run dev
```

## 📂 Estructura del Proyecto

```plaintext
src/
├── assets/            # Archivos estáticos como imágenes, íconos, etc.
├── components/        # Componentes reutilizables de la interfaz
├── pages/             # Páginas principales del frontend (Login, Register, Dashboard, etc.)
├── routes/            # Configuración de rutas para la navegación
├── styles/            # Archivos de estilos globales y personalizados
├── App.jsx            # Componente principal de la aplicación
├── main.jsx           # Punto de entrada para renderizar la aplicación
├── firebaseConfig.js  # Configuración de Firebase
```

## 🖼️ Funcionalidades Principales

### 🔑 Autenticación de Usuarios

- Registro e inicio de sesión.
- Restauración de cuentas eliminadas.
- Notificaciones interactivas para informar al usuario de errores o éxitos.

### 📊 Dashboard de Estadísticas

- Gráficos dinámicos que incluyen:
  - **Gráfico de barras**: Promedio de kills y duración de juego.
  - **Gráfico de radar**: Análisis de frecuencias e impactos.
  - **Gráfico de área**: Observación de tendencias a lo largo del tiempo.
  - **Gráfico de pastel**: Proporción de resultados (ganados vs. perdidos).
- Diseño intuitivo y limpio para mejorar la experiencia del usuario.

### 👤 Gestión de Perfil

- Actualización de datos del usuario (nombre, email, contraseña, etc.).
- Carga de imágenes con integración en Firebase Storage.

## 📚 Contribución

Si deseas contribuir a este proyecto, sigue los pasos a continuación:

1. Haz un **fork** del repositorio.
2. Crea una nueva rama para tu funcionalidad:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza los cambios necesarios y haz un commit:
   ```bash
   git commit -m "Descripción de la funcionalidad"
   ```
4. Sube tu rama al repositorio remoto:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un pull request describiendo tus cambios en detalle.

# 🎮 Platyfa Backend

Backend del proyecto **Platyfa**, que soporta las funcionalidades de un videojuego innovador con análisis estadístico, gestión de usuarios y manejo de sesiones de juego.

## 🚀 Descripción del Proyecto

El backend de Platyfa está desarrollado con **Node.js** y **Express.js**, implementando una API RESTful para la comunicación entre el cliente y el servidor. Ofrece funcionalidades como:

- **Gestión de usuarios**:
  - Registro.
  - Inicio de sesión.
  - Restauración de cuentas eliminadas.
  - Edición de perfil.
- **Análisis estadístico**:

  - Manejo de sesiones de juego.
  - Generación de estadísticas.

- **Manejo seguro**:

  - Autenticación basada en tokens **JWT**.

- **Persistencia de datos**:
  - Utilización de **PostgreSQL** como base de datos relacional.

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para el desarrollo del backend.
- **Express.js**: Framework para construir la API RESTful.
- **PostgreSQL**: Base de datos relacional para la persistencia de datos.
- **JWT**: Autenticación segura basada en tokens.
- **pg**: Biblioteca para la interacción con PostgreSQL.
- **dotenv**: Gestión de variables de entorno.
- **Resend**: Servicio para la integración de envío de correos electrónicos.
- **Vercel**: Plataforma utilizada para hosting de la API
- **Namecheap**: Gestión de dominio personalizado para el proyecto.

## 🔧 Instalación y Uso

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/bar20807/megaproyecto-backend-services.git
cd platyfa-frontend
```

### 2️⃣ Instalar Dependencias

Asegúrate de tener **Node.js** instalado en tu sistema. Luego, ejecuta el siguiente comando en la raíz del proyecto para instalar todas las dependencias necesarias:

```bash
npm install
```

## 3️⃣ Ejecutar el Proyecto

Una vez configurado, puedes ejecutar el proyecto con el siguiente comando:

```bash
npm start
```

Si se quiere ejecutar en modo desarrollo utiliza el siguiente comando:

```bash
npm run dev
```

## 4️⃣ Generar la Base de Datos

Sigue los pasos a continuación para diseñar la base de datos en PostgreSQL. Este esquema asegura una estructura robusta para soportar las funcionalidades del backend.

### Tabla `players`

1. **Descripción**: Tabla principal que almacena la información de los usuarios.
2. **Campos**:
   - **id**: Identificador único para cada jugador.
   - **username**: Nombre de usuario, obligatorio y único.
   - **email**: Correo electrónico único, obligatorio.
   - **password**: Contraseña del jugador, almacenada de manera segura.
   - **is_verified**: Indica si el correo electrónico del jugador está verificado (valor por defecto: FALSE).
   - **is_deleted**: Indica si la cuenta del jugador está eliminada (valor por defecto: FALSE).
   - **reset_token** y **reset_token_expiration**: Campos para gestionar la funcionalidad de recuperación de contraseñas.

### Tabla `game_sessions`

1. **Descripción**: Tabla que almacena estadísticas detalladas de cada sesión de juego.
2. **Campos**:
   - **id_player**: Hace referencia al ID del jugador en la tabla `players`.
   - **date**: Fecha de la sesión de juego.
   - **level**: Nivel jugado en la sesión.
   - **duration_level**: Duración del nivel en minutos.
   - **game_result**: Resultado del juego (e.g., "win" o "lose").
   - **kills**: Número de enemigos eliminados.
   - **jumps**: Número de saltos realizados.
   - **damage_received**: Cantidad de daño recibido.
   - **frequency\_**: Frecuencia de uso de ciertos ítems, como `frequency_barringtonia`.
   - **impact\_**: Impacto de los ítems utilizados, como `impact_spaggetti`.

### Tabla `news`

1. **Descripción**: Tabla para almacenar noticias relacionadas con el juego.
2. **Campos**:
   - **id**: Hace referencia al ID del jugador en la tabla `players`.
   - **title**: Título de la noticia, obligatorio.
   - **author**: Usuario autor de la noticia, obligatorio.
   - **date**: Fecha de publicación, obligatorio.
   - **time**: Hora de publicación, obligatorio.
   - **content**: Contenido de la noticia, obligatorio.
   - **image**: URL o contenido de la imagen asociada (opcional).

### Resumen del Diseño de la Base de Datos

- **`players`**: Almacena la información de los usuarios.
- **`game_sessions`**: Contiene estadísticas detalladas de cada sesión de juego.
- **`news`**: Administra noticias relacionadas con el juego.

## 📂 Estructura del Proyecto

```plaintext
config/
├── config.js          # Configuración de variables globales.
controllers/
├── admins.js          # Controladores relacionados con funcionalidades de administrador.
├── players.js         # Controladores para manejar usuarios y sesiones.
middlewares/
├── player.js          # Middlewares para autenticación y validación de permisos.
models/
├── player.js          # Modelos para interactuar con la base de datos.
utils/
├── config.js          # Funciones auxiliares de configuración.
├── email.js           # Funciones para manejar el envío de correos electrónicos.
├── logger.js          # Configuración de logs para errores e información.
.env                   # Variables de entorno.
app.js                 # Configuración y estructura principal de Express.
index.js               # Archivo principal para iniciar el servidor.
package.json           # Información y dependencias del proyecto.
README.md              # Documentación del proyecto.
vercel.json            # Configuración para despliegue en Vercel.
```

## 🔑 Endpoints Principales

### 🔒 Autenticación

- **POST `/api/players/register`**: Permite el registro de un nuevo usuario proporcionando los datos necesarios.
- **POST `/api/players/login`**: Realiza el inicio de sesión para usuarios existentes y devuelve un token de autenticación.
- **POST `/api/players/restore_account`**: Restaura una cuenta de usuario previamente eliminada.

### 📊 Estadísticas

- **GET `/api/players/game_statistics`**: Recupera estadísticas detalladas del jugador, como rendimiento y datos acumulados de sus sesiones de juego.
- **POST `/api/players/game_sessions`**: Guarda los datos de una sesión de juego específica en la base de datos.

### 📰 Noticias

- **GET `/api/news`**: Recupera todas las noticias disponibles relacionadas con el juego.
- **POST `/api/news`**: Permite la creación de una nueva noticia; este endpoint está restringido únicamente para usuarios con permisos de administrador.

## 📌 Notas Adicionales

- **Resend**: Asegúrate de configurar correctamente el servicio de correo electrónico en el archivo `.env`. Incluye las claves y parámetros necesarios para el envío de correos electrónicos, como:

  - Credenciales de la API de Resend.
  - Dirección de correo remitente.
  - Configuración del entorno (producción o desarrollo).

- **Namecheap**: El dominio personalizado está configurado para redirigir tanto al frontend como al backend. Verifica que:
  - Los registros DNS en Namecheap estén correctamente configurados para apuntar a las respectivas direcciones del servidor frontend y backend.
  - Los subdominios (si se utilizan) estén configurados para servicios específicos, como `api.tu-dominio.com` para el backend.

## 📞 Contacto

Si tienes dudas, sugerencias o comentarios, no dudes en ponerte en contacto:

- **Nombre**: José Rodrigo Barrera García
- **Email**: [barrera1234garcia@gmail.com](mailto:barrera1234garcia@gmail.com)
- **GitHub**: [bar20807](https://github.com/bar20807)
