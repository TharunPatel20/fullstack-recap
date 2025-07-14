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