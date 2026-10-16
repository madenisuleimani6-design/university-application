# MySQL Workbench Setup

The Java backend now supports MySQL through the `mysql` Spring profile.

## 1. Create the database in MySQL Workbench

Connect to the local MySQL server as `root`, then run:

```sql
CREATE DATABASE IF NOT EXISTS amisdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

The application creates and updates the AMIS tables automatically with Hibernate.

## 2. Start the backend with your local password

PowerShell:

```powershell
$env:SPRING_PROFILES_ACTIVE = 'mysql'
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = '12345'
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-25'
cd backend
java -jar target\amis-backend-0.0.1-SNAPSHOT.jar
```

Or run from Maven after building:

```powershell
$env:SPRING_PROFILES_ACTIVE = 'mysql'
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = '12345'
..\backend\mvnw.cmd spring-boot:run
```

If your MySQL server uses another port, set `SPRING_DATASOURCE_URL`, for example:

```powershell
$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://localhost:3307/amisdb?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
```

## 3. Login accounts

The backend startup initializer creates or repairs these development accounts:

- Administrator: `admin` / `admin123`
- Student: `student` / `student123`

Do not commit database passwords. Use environment variables or a secret manager outside development.
