package com.example.sep_moove_backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                     // Applies to all endpoints
                .allowedOrigins("http://localhost:3000")         // Allow frontend origin
                .allowedMethods("POST", "GET", "PUT", "DELETE")  // Specify allowed methods
                .allowedHeaders("*")                             // Allow all headers
                .allowCredentials(true);                         // Allow cookies, if necessary
    }
}
