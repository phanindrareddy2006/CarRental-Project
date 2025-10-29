package com.example.carrental.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dg0hk6sqj",          // ✅ your cloud name
                "api_key", "261122647887614",       // ✅ your API key
                "api_secret", "mmGG1JAsOZNXy0YitS6C1Vpnqa0", // ✅ your API secret
                "secure", true
        ));
    }
}
