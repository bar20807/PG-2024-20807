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

## 📞 Contacto

Si tienes dudas, sugerencias o comentarios, no dudes en ponerte en contacto:

- **Nombre**: José Rodrigo Barrera García  
- **Email**: [barrera1234garcia@gmail.com](mailto:barrera1234garcia@gmail.com)  
- **GitHub**: [bar20807](https://github.com/bar20807)

