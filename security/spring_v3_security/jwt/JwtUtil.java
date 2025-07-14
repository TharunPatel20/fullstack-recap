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
