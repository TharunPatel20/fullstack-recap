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
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {


        // Print Authorization header

        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authHeader);

        String token =null;
        String username=null;

        if( authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            System.out.println("token : "+token);
            username= jwtUtil.extractUsername(token);
            System.out.println("username : "+username);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails =service.loadUserByUsername(username);
            if(jwtUtil.validateToken( token, userDetails)){
                System.out.println("valid token");
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities())
                );
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);


    }

}
