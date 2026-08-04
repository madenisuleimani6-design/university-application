# AMIS - Troubleshooting Guide

## ⚠️ Common Issues & Solutions

### **Issue: "The build file has been changed and may need reload to make it effective"**

This is an informational message from the IDE, not an error. It means the pom.xml configuration has changed and Maven may need to reload.

**Solution:**

#### **For VS Code:**

1. Close the `backend` folder in VS Code
2. Reopen it by clicking File → Open Folder
3. Wait for Java/Maven extensions to re-index

#### **Or try these commands:**

```bash
cd backend

# If Maven is installed globally:
mvn clean install

# If Maven is NOT installed, use Maven Wrapper:
mvnw.cmd clean install   # Windows
./mvnw clean install      # Linux/Mac
```

---

### **Issue: Maven Command Not Found**

If you get "mvn is not recognized", Maven is not installed globally.

**Solution 1: Use Maven Wrapper (Recommended)**

```bash
cd backend

# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

**Solution 2: Install Maven**

1. Download: https://maven.apache.org/download.cgi
2. Extract to a folder (e.g., C:\maven)
3. Add to PATH environment variable
4. Restart your terminal/IDE

---

### **Issue: Build Fails with Dependency Errors**

**Solution:**

```bash
cd backend

# Clear Maven cache and rebuild
mvn clean install -DskipTests

# Then start the application
mvn spring-boot:run
```

---

### **Issue: Frontend Not Loading at localhost:3000**

**Solution:**

```bash
cd frontend

# Clear node_modules and reinstall
rm -r node_modules package-lock.json   # Linux/Mac
rmdir /s node_modules                  # Windows
npm install

# Start development server
npm run dev
```

---

### **Issue: "Port 3000 or 8080 Already in Use"**

**Solution 1: Kill the process using the port**

Windows:

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Linux/Mac:

```bash
lsof -ti:3000 | xargs kill -9
```

**Solution 2: Use different ports**

Frontend (.env or vite.config.ts):

```bash
npm run dev -- --port 5000
```

Backend (src/main/resources/application.properties):

```properties
server.port=9090
```

---

### **Issue: Database Connection Errors**

**For H2 (Default):**

- No setup needed, uses in-memory database

**For PostgreSQL:**

1. Ensure PostgreSQL is running on port 5432
2. Create database: `CREATE DATABASE amisdb;`
3. Create user: `CREATE USER amis WITH PASSWORD 'amis123';`
4. Grant privileges: `GRANT ALL ON DATABASE amisdb TO amis;`

---

## ✅ Verification Checklist

- [ ] Java 21+ installed: `java -version`
- [ ] Node.js 18+ installed: `node -v`
- [ ] npm installed: `npm -v`
- [ ] Frontend builds: `npm run build --prefix frontend`
- [ ] Backend pom.xml valid: `mvn validate` (in backend folder)
- [ ] Ports 3000 and 8080 available

---

## 🚀 Quick Build & Run

Use provided scripts:

**Windows:**

```bash
build.bat           # Builds backend
```

**Linux/Mac:**

```bash
./build.sh          # Builds backend
```

---

## 📞 Still Having Issues?

1. Check the error message carefully
2. Verify all prerequisites are installed
3. Try clearing caches (node_modules, Maven cache)
4. Restart VS Code or your IDE
5. Run `npm install` and `mvn clean install` again

The AMIS is designed to work out-of-the-box with minimal setup!
