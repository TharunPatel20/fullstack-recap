# Full Stack Recap: Spring Boot + React with Code Snippets

---

## ✨ React (Frontend)

### 🔄 useEffect() with Axios (GET Request)

```js
useEffect(() => {
  axios.get("/api/users")
    .then(response => setUsers(response.data))
    .catch(error => console.log(error));
}, []);
```

### ✍️ Form Handling with useState

```js
const [form, setForm] = useState({ name: "", email: "" });

const handleChange = (e) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
```

### ✉️ POST using fetch()

```js
const handleSubmit = async () => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) throw new Error();
  const data = await response.json();
};
```

---

## 🚀 Spring Boot (Backend)

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
  return "Hello " + user.getUsername();
}
```

---

## 📊 Spring Data JPA

### 🔐 Basic Setup

```java
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String name;

  @Column
  private String email;
}
```

### ⚖️ Relationship Mapping

```java
@Entity
public class Order {
  @Id
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;
}

@Entity
public class User {
  @Id
  private Long id;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<Order> orders;
}
```

### 🔍 Advanced Annotations

```java
@Embedded
@ElementCollection
@JsonIgnore
@JsonManagedReference
@JsonBackReference
```

---

## 🔐 Spring Security with JWT

### ⚖️ Required Interfaces/Classes

```
1. User
2. UserDetails (interface)
3. UserDetailsService (interface)
4. InMemoryUserDetailsManager (class)
5. SecurityFilterChain (bean method)
6. AuthenticationProvider (interface)
7. AuthenticationManager (interface)
8. DaoAuthenticationProvider (class)
9. PasswordEncoder
10. UsernamePasswordAuthenticationToken
11. JwtFilter implements OncePerRequestFilter
```

### 📌 JWT Utility

```java
@Component
public class JwtUtil {
  private String JWTSECRET = "secret";

  public String generateToken(String username) {
    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
      .signWith(SignatureAlgorithm.HS256, JWTSECRET)
      .compact();
  }

  public String extractUsername(String token) {
    return Jwts.parser()
      .setSigningKey(JWTSECRET)
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }

  public boolean isTokenExpired(String token) {
    Date expiration = Jwts.parser()
      .setSigningKey(JWTSECRET)
      .parseClaimsJws(token)
      .getBody()
      .getExpiration();
    return expiration.before(new Date());
  }

  public boolean validateToken(String token, UserDetails user) {
    return extractUsername(token).equals(user.getUsername()) && !isTokenExpired(token);
  }
}
```

### ⛓️ JWT Filter

```java
@Component
public class JwtFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserDetailsService userDetailsService;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
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
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
          userDetails, null, userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);
      }
    }
    filterChain.doFilter(request, response);
  }
}
```

### 🛡️ Security Configuration

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeHttpRequests()
        .requestMatchers("/api/auth/**").permitAll()
        .anyRequest().authenticated();
    return http.build();
  }
}
```

---

Let me know if you want this broken into frontend/backend folders or extended to include login flows, database init, or full-stack testing setup.
