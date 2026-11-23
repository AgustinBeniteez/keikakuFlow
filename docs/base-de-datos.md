# Conexión y Configuración de Base de Datos — Backend KeikakuFlow

Guía práctica sobre cómo está conectada la base de datos **PostgreSQL** con **Spring Boot 3 + Spring Data JPA (Hibernate)** y cómo levantarla tanto en local (pgAdmin 4) como con Docker.

---

## 1. Dependencias principales (`backend/pom.xml`)

- `spring-boot-starter-data-jpa`: capa ORM con Hibernate 6 y repositorios automáticos (`JpaRepository`).
- `org.postgresql:postgresql`: driver JDBC para conectarse a PostgreSQL.
- `com.h2database:h2` (`scope=test`): base de datos en memoria compatible con PostgreSQL usada únicamente al ejecutar `mvnw test`.

---

## 2. Configuración de conexión (`backend/src/main/resources/application.properties`)

```properties
# Puerto del servidor backend
server.port=8081

# Conexión a PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/keikakuflow_db
spring.datasource.username=agustin
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# Creación y actualización automática de tablas con Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.format_sql=true
```

### ¿Qué hace cada propiedad clave?
- **`spring.datasource.url`**: apunta al servidor PostgreSQL local en el puerto `5432` y a la base de datos `keikakuflow_db`.
- **`spring.jpa.hibernate.ddl-auto=update`**: al arrancar Spring Boot, Hibernate lee todas las clases `@Entity` de `com.agustin.keikakuflow.entity` y **crea o actualiza automáticamente las 18 tablas**, claves foráneas, restricciones `UNIQUE`, índices y la columna `JSONB` de `canvases`.
- **`spring.jpa.show-sql=true`**: imprime por consola las consultas SQL ejecutadas por Hibernate.
- **`spring.jpa.open-in-view=false`**: evita consultas perezosas ocultas fuera de los servicios (las relaciones se cargan de forma controlada con `@EntityGraph` y se devuelven mediante DTOs).

---

## 3. Cómo preparar PostgreSQL (dos opciones)

### Opción A · PostgreSQL instalado en local (con pgAdmin 4)

1. Abre **pgAdmin 4** y conéctate a tu servidor PostgreSQL local.
2. **Crea el usuario `agustin`**:
   - Clic derecho en **`Login/Group Roles`** → **Create** → **Login/Group Role...**
   - **General → Name**: `agustin`
   - **Definition → Password**: `postgres`
   - **Privileges**: activa **Can login?** (`Yes`) y **Superuser?** (`Yes`)
   - Pulsa **Save**.
3. **Crea la base de datos `keikakuflow_db`**:
   - Clic derecho en **`Databases`** → **Create** → **Database...**
   - **Database**: `keikakuflow_db`
   - **Owner**: `agustin`
   - Pulsa **Save**.

> Si prefieres usar directamente el usuario por defecto `postgres`, basta con crear la base `keikakuflow_db` y cambiar `spring.datasource.username` y `spring.datasource.password` en `backend/src/main/resources/application.properties`.

### Opción B · PostgreSQL con Docker Compose

Desde la raíz del proyecto (con Docker Desktop en ejecución):

```powershell
docker compose -f docker/docker-compose.yml up -d
```

El contenedor `keikakuflow_postgres` crea automáticamente la base `keikakuflow_db` y el usuario `agustin` / `postgres` en el puerto `5432`, persistiendo los datos en el volumen `postgres_data`.

---

## 4. Arrancar el backend y comprobar las 18 tablas

Desde la carpeta `backend`:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Si todo está bien configurado, verás el arranque en el puerto **`8081`** y las sentencias `create table ...` de Hibernate.

Para comprobarlo en **pgAdmin 4**:
1. Despliega **`keikakuflow_db` → `Schemas` → `public` → `Tables`**.
2. Haz clic derecho sobre **`Tables`** → **Refresh**.

### Tablas generadas automáticamente (18)

| Módulo | Tablas |
| :--- | :--- |
| **Usuarios y Seguridad** | `users` |
| **Empresas / Organizaciones** | `companies`, `company_members` |
| **Proyectos, Roles e Invitaciones** | `projects`, `roles`, `project_members`, `invitations` |
| **Estructura del Workspace** | `categories`, `channels`, `channel_permissions` |
| **Documentación Markdown** | `notes`, `note_comments` |
| **Pizarras Excalidraw (`JSONB`)** | `canvases` |
| **Tareas y Etiquetas** | `tasks`, `tags`, `task_tags` |
| **Chat Rápido** | `messages` |
| **Suscripciones / Panel Admin** | `subscriptions` |

---

## 5. Usuario administrador inicial

Al arrancar la aplicación, el `@Bean` de `DataInitializer` comprueba si existe el administrador por defecto y, si no existe, lo inserta automáticamente en la tabla `users` con contraseña cifrada en **BCrypt**:

- **Usuario:** `AgustinBenitez`
- **Email:** `agustin@keikakuflow.dev`
- **Contraseña:** `admin1234`
- **Rol:** `ROLE_ADMIN`

### Prueba rápida de conexión y JWT

```powershell
# 1. Login para obtener el accessToken JWT
Invoke-RestMethod -Method Post -Uri "http://localhost:8081/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"username":"AgustinBenitez","password":"admin1234"}'
```

Con el `accessToken` devuelto puedes consultar endpoints protegidos enviando la cabecera:
```text
Authorization: Bearer <accessToken>
```

---

## 6. Ejecutar los tests sin tocar PostgreSQL

Los tests automáticos usan el perfil `test` (`backend/src/test/resources/application-test.properties`) con **H2 en memoria** para validar que Hibernate genera las 18 tablas y que los endpoints con JWT responden correctamente:

```powershell
cd backend
.\mvnw.cmd test
```

---

## 7. Problemas frecuentes

| Error al arrancar | Causa | Solución |
| :--- | :--- | :--- |
| `Unable to determine Dialect without JDBC metadata` | PostgreSQL está apagado o no escucha en `localhost:5432`. | Arranca el servicio de PostgreSQL en Windows (o `docker compose up -d`). |
| `password authentication failed for user "agustin"` | El usuario/contraseña en PostgreSQL no coincide con `application.properties`. | Verifica el rol `agustin` en pgAdmin 4 o actualiza las credenciales en `application.properties`. |
| `database "keikakuflow_db" does not exist` | Falta crear la base de datos vacía en PostgreSQL. | Crea `keikakuflow_db` en pgAdmin 4 (Hibernate crea las tablas, no la base de datos). |
| `Port 8081 was already in use` | Ya hay otra instancia del backend u otro proceso usando ese puerto. | Detén la instancia previa o cambia `server.port` en `application.properties`. |
