package com.example.spring_v3_security.controller;

import java.util.List;
import java.util.Map;

import com.example.spring_v3_security.jwt.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_v3_security.entity.User;
import com.example.spring_v3_security.repo.UserRepo;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;


    public AuthController(UserRepo userRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }
        var user = new User(request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                List.of("USER"));
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User created");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        if (userRepository.findByUsername(request.getUsername()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User does not exists");
        }
         Authentication authenticatedUser = authenticationManager
                 .authenticate(new UsernamePasswordAuthenticationToken(
                 request.getUsername(), request.getPassword()));

         String token = jwtUtil.generateToken((UserDetails) authenticatedUser.getPrincipal());

        return ResponseEntity.ok(Map.of("status", HttpStatus.OK, "token", token));
    }

}