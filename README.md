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

  // Getters and setters
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
@Component
public class JwtUtil {
  private final String JWT_SECRET = "secret";

  public String generateToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
        .signWith(SignatureAlgorithm.HS256, JWT_SECRET)
        .compact();
  }

  public String extractUsername(String token) {
    return Jwts.parser()
        .setSigningKey(JWT_SECRET)
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean isTokenExpired(String token) {
    return Jwts.parser()
        .setSigningKey(JWT_SECRET)
        .parseClaimsJws(token)
        .getBody()
        .getExpiration()
        .before(new Date());
  }

  public boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }
}
```

### ⛓️ JWT Filter

Reads token, extracts username, and authenticates.

```java
@Component
public class JwtFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    String token = null;
    String username = null;

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      username = jwtUtil.extractUsername(token);
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);

      if (jwtUtil.validateToken(token, userDetails)) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
            userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
      }
    }
    filterChain.doFilter(request, response);
  }
}
```

### 🛡️ Security Configuration

Defines access control rules and beans.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize
public class SecurityConfig {
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeHttpRequests()
        .requestMatchers("/api/auth/**").permitAll()
        .anyRequest().authenticated()
        .and()
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    return http.build();
  }
}
```

### 🔐 Sample Auth Controller with @PreAuthorize

This controller shows how to protect endpoints using roles:

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @GetMapping("/public")
  public String publicEndpoint() {
    return "This is a public endpoint";
  }

  @PreAuthorize("hasRole('USER')")
  @GetMapping("/user")
  public String userEndpoint() {
    return "This endpoint is accessible by USER role";
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/admin")
  public String adminEndpoint() {
    return "This endpoint is accessible by ADMIN role";
  }
}
```

---