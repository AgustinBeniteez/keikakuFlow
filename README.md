# KeikakuFlow

Proyecto de Fin de Grado (TFG) - 2º DAW (Desarrollo de Aplicaciones Web)  
**Autor:** Agustín Benítez López  
**Curso:** 2026/2027  

---

## 📌 Descripción

**KeikakuFlow** es una plataforma web para la planificación, documentación y seguimiento de proyectos de desarrollo de software. Combina la agilidad de los canales temáticos con un entorno de notas enriquecidas en Markdown, canvas para diagramas interactivos y gestión de tareas.

---

## 🏗️ Estructura del Proyecto

El repositorio está organizado en una arquitectura monorepo:

* **`/backend`**: Servidor lógico y API REST desarrollado con **Java 17**, **Spring Boot 3** y **Maven**.
* **`/frontend`**: Aplicación cliente desarrollada con **Angular** y **Tailwind CSS**.
* **`/docker`**: Archivo `docker-compose.yml` para el despliegue del contenedor de base de datos **PostgreSQL**.

---

## 🚀 Puesta en Marcha

### Prerrequisitos

* Java JDK 17 o superior
* Maven 3.9+ (o usar `./mvnw`)
* Node.js 20+ y npm
* Docker / Docker Desktop

### 1. Base de Datos (PostgreSQL)

Levantar el contenedor de la base de datos:

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 2. Backend (Spring Boot)

Compilar y arrancar la API REST:

```bash
cd backend
./mvnw spring-boot:run
```

El servidor estará escuchando en `http://localhost:8081`.

### 3. Frontend (Angular)

Instalar dependencias y arrancar el servidor de desarrollo:

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`.
