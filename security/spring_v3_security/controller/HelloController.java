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
    
    @GetMapping("/admin")
    public String admin() {
        return "Hello, Admin!";
    }
    
    @GetMapping("/user")
    public String user() {
        return "Hello, User!";
    }
}
