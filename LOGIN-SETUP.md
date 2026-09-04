# Working Login Credentials

The Java backend creates or repairs these development accounts every time it starts:

- Administrator: `admin` / `admin123`
- Student: `student` / `student123`

The login endpoint is:

```text
http://192.168.1.4:8080/api/auth/login
```

The frontend is:

```text
http://192.168.1.4:3000/login
```

Both credentials were verified against the running backend and returned HTTP 200. Do not use these development passwords in production.
