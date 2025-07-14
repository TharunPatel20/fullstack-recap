# Full Stack Recap: Spring Boot + React with Code Snippets

---

## ✨ React (Frontend)

This section covers React fundamentals including state management, form handling, lifecycle hooks, and HTTP requests using both `fetch()` and `axios`.

### 🔄 useEffect() with Axios (GET Request)

`useEffect()` is a lifecycle hook used to run side effects like API calls. Here's how to fetch data using `axios`:

```js
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users")
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      {users.map(user => <p key={user.id}>{user.name}</p>)}
    </div>
  );
}
```

### ✍️ Form Handling with useState

To capture form inputs in React, use `useState()` with controlled components:

```js
import { useState } from "react";

function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}
```

### ✉️ POST using fetch()

To submit data to a backend API with `fetch`, use the following pattern:

```js
const handleSubmit = async () => {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ name: "John", email: "john@example.com" })
    });

    if (!response.ok) throw new Error("Failed to submit form");

    const data = await response.json();
    console.log("Submitted:", data);
  } catch (err) {
    console.error("Error submitting:", err);
  }
};
```

---

## 🚀 Spring Boot (Backend)

Spring Boot simplifies backend development using annotations, dependency injection, and integrations like JPA and Spring Security.

### ⚙️ Core Annotations

```java
@SpringBootApplication // Combines @ComponentScan + @Configuration + @EnableAutoConfiguration

@RestController         // Combines @Controller + @ResponseBody
@RequestMapping("/api/users")
@GetMapping
@PostMapping
@PutMapping
@DeleteMapping

@Repository
@Service
@Controller
@Configuration
```

### 📃 Data Retrieval in Controller

Examples of getting data using @PathVariable, @RequestParam, and @RequestBody:

```java
@GetMapping("/hello/{username}")
public String greetUser(@PathVariable String username) {
  return "Hello " + username;
}

@GetMapping("/hello")
public String greetUser(@RequestParam String name) {
  return "Hello " + name;
}

@PostMapping("/hello")
public String greetUser(@RequestBody User user) {
  return "Hello " + user.getName();
}
```

---

## 📊 Spring Data JPA

Spring Data JPA handles ORM (Object Relational Mapping) through simple annotations.

### 🔐 Basic Setup

```java 
@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(unique = true, nullable = false)
  private String email;

  @ElementCollection
  @CollectionTable(name = "user_phone_numbers", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name = "phone_number")
  private List<String> phone_numbers;

  // Constructors
  public User() {}

  public User(String name, String email, List<String> phone_numbers) {
    this.name = name;
    this.email = email;
    this.phone_numbers = phone_numbers;
  }

  // Getters and Setters
  // ...
}

```

### ⚖️ Relationship Mapping

Defines how entities relate to each other:

```java
@Entity
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;
}

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<Order> orders = new ArrayList<>();

  // Getters and setters
}
```

### 🔍 Advanced JPA Annotations

```java
@Embedded               // For value object embedding
@ElementCollection      // For list of simple types
@JsonIgnore             // To avoid infinite loops
@JsonManagedReference   // Used on parent side of bidirectional relation
@JsonBackReference      // Used on child side
```

---

## 🔐 Spring Security with JWT

This section covers JWT-based stateless authentication.

### 📌 JWT Utility

Generates and validates JWT tokens.

```java 
package com.example.spring_v3_security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
private static final String SECRET ="jwtSecretjwtSecretjwtSecretjwtSecretjwtSecretjwtSecretjwtSecret";

    public String generateToken(UserDetails userDetails){

        return Jwts
                .builder()
                .claim("roles", userDetails.getAuthorities())
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date((System.currentTimeMillis() + 60*60*1000)))
                .signWith(SignatureAlgorithm.HS256,SECRET)
                .compact();
    }


    public boolean isTokenExpired(String token){
        Date expiration = Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }


    public String extractUsername(String token){
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }



    public boolean validateToken(String token, UserDetails userDetails){
        return extractUsername(token).equalsIgnoreCase(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
```

### ⛓️ JWT Filter

Reads token, extracts username, and authenticates.

```java 
package com.example.spring_v3_security.jwt;

import com.example.spring_v3_security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService service;
    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService service) {
        this.jwtUtil = jwtUtil;
        this.service = service;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,FilterChain filterChain)throws ServletException, IOException {

        // Print Authorization header
        String authHeader = request.getHeader("Authorization");

        String token =null;
        String username=null;

        if( authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            username= jwtUtil.extractUsername(token);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails =service.loadUserByUsername(username);
            if(jwtUtil.validateToken( token, userDetails)){
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities())
                );
            }
        }
        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
```

### 🛡️ Security Configuration

Defines access control rules and beans.

```java
package com.example.spring_v3_security.config;

import java.net.PasswordAuthentication;
import java.security.AuthProvider;

import com.example.spring_v3_security.jwt.JwtFilter;
import com.example.spring_v3_security.jwt.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.spring_v3_security.service.CustomUserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, CustomUserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf().disable() // Disable CSRF protection for simplicity
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/hello", "/auth/register", "/auth/login", "/h2-console", "/h2-console/*").permitAll() // Allow public access to /hello
                        .requestMatchers("/admin").hasRole("ADMIN") // Only ADMIN can access /admin
                        .requestMatchers("/user").hasRole("USER") // Only USER can access /user
                        .anyRequest().authenticated()) // All other requests require authentication
                .headers(headers -> headers.frameOptions(
                        frameOptions -> frameOptions.disable()))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class )
                .httpBasic(Customizer.withDefaults()); // Use HTTP Basic authentication

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // @Bean
    // public InMemoryUserDetailsManager userDetails(){
    // UserDetails user1 =
    // User.withUsername("user1").password(passwordEncoder().encode("pass1234")).roles("USER").build();
    // UserDetails admin =
    // User.withUsername("admin").password(passwordEncoder().encode("pass1234")).roles("ADMIN").build();
    // return new InMemoryUserDetailsManager(user1, admin);
    // }


    @Bean
    public AuthenticationProvider daoAuthProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setUserDetailsService(userDetailsService);
        return authProvider;
    }

    @Bean
    public AuthenticationManager manager(HttpSecurity http) throws Exception {
        return http
                .getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(daoAuthProvider()).build();
    }
}
```

### 🔐 Sample Auth Controller with @PreAuthorize

This controller shows how to protect endpoints using roles:

```java 
package com.example.spring_v3_security.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }
     @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String admin() {
        return "Hello, Admin!";
    }
     @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    public String user() {
        return "Hello, User!";
    }
}
```

# 📘 SQL Full Recap: Commands + Use Cases (Quick Reference)

Use this guide as a one-stop SQL reference for quick recaps. Covers every essential SQL topic with examples.

---

## 📁 1. Data Definition Language (DDL)

Used to define and modify database schema.

```sql
-- Create table
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

-- Modify table
ALTER TABLE users ADD age INT;

-- Delete table
DROP TABLE users;

-- Delete all rows (reset auto-increment)
TRUNCATE TABLE users;
```

---

## 📊 2. Data Manipulation Language (DML)

Used to manipulate records.

```sql
-- Insert
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- Update
UPDATE users SET name = 'Bob' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;
```

---

## 🔍 3. Data Query Language (DQL)

Used to fetch records.

```sql
-- Basic select
SELECT * FROM users;
SELECT name, email FROM users;

-- With filters
SELECT * FROM users WHERE age > 25;

-- Sorting
SELECT * FROM users ORDER BY name ASC;

-- Limit
SELECT * FROM users LIMIT 10;
```

---

## 🛡️ 4. Data Control Language (DCL)

Used to manage permissions.

```sql
-- Grant access
GRANT SELECT, INSERT ON users TO 'readonly_user';

-- Revoke access
REVOKE INSERT ON users FROM 'readonly_user';
```

---

## 🔐 5. Transaction Control Language (TCL)

Ensure atomic operations.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- or
ROLLBACK;
```

---

## 📦 6. Aggregate Functions

Useful for summaries.

```sql
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT MAX(age), MIN(age) FROM users;
SELECT SUM(age) FROM users;
```

---

## 🔗 7. Joins

Combine multiple tables.

```sql
-- INNER JOIN
SELECT u.name, o.amount FROM users u
JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN
SELECT u.name, o.amount FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- RIGHT JOIN
SELECT u.name, o.amount FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- FULL OUTER JOIN (PostgreSQL/Oracle)
SELECT u.name, o.amount FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

---

## 🧠 8. Grouping and Filtering

Aggregate + group logic.

```sql
-- GROUP BY
SELECT department, COUNT(*) FROM employees
GROUP BY department;

-- HAVING
SELECT department, COUNT(*) FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
```

---

## 🔎 9. Subqueries & Views

Nested logic and virtual tables.

```sql
-- Subquery
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders);

-- View
CREATE VIEW active_users AS
SELECT * FROM users WHERE active = 1;

SELECT * FROM active_users;
```

---

## 📏 10. Constraints

Ensure data integrity.

```sql
CREATE TABLE employees (
  id INT PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  age INT CHECK (age >= 18),
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);
```

---

## 🧱 11. Indexing

Improve performance on searches.

```sql
CREATE INDEX idx_email ON users(email);
DROP INDEX idx_email ON users; -- MySQL
```

---

## 🧪 12. Set Operations

Combine results of multiple queries.

```sql
-- UNION
SELECT name FROM students
UNION
SELECT name FROM alumni;

-- INTERSECT (PostgreSQL)
SELECT name FROM students
INTERSECT
SELECT name FROM alumni;

-- EXCEPT (PostgreSQL)
SELECT name FROM students
EXCEPT
SELECT name FROM alumni;
```

---

## 🧩 13. Useful Clauses & Keywords

```sql
-- DISTINCT
SELECT DISTINCT department FROM employees;

-- BETWEEN
SELECT * FROM users WHERE age BETWEEN 20 AND 30;

-- IN
SELECT * FROM users WHERE age IN (18, 21, 25);

-- LIKE
SELECT * FROM users WHERE name LIKE 'A%';

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;
```

---

## 📌 Summary Table

| Category    | Key Commands                    |
| ----------- | ------------------------------- |
| DDL         | CREATE, ALTER, DROP, TRUNCATE   |
| DML         | INSERT, UPDATE, DELETE          |
| DQL         | SELECT                          |
| DCL         | GRANT, REVOKE                   |
| TCL         | BEGIN, COMMIT, ROLLBACK         |
| Aggregates  | COUNT, SUM, AVG, MAX, MIN       |
| Join Ops    | INNER, LEFT, RIGHT, FULL OUTER  |
| Views       | CREATE VIEW, SELECT FROM view   |
| Constraints | PRIMARY, UNIQUE, CHECK, FOREIGN |
| Set Ops     | UNION, INTERSECT, EXCEPT        |

