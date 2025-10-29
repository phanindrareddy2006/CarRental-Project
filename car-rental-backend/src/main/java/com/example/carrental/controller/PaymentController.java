package com.example.carrental.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // update if needed
@RestController
@RequestMapping("/api/payments/razorpay")
public class PaymentController {

    @Value("${razorpay.key_id}")
    private String razorKeyId;

    @Value("${razorpay.key_secret}")
    private String razorKeySecret;

    // 1) Create order - frontend sends { totalAmount, currency (optional), receipt (optional), carId, username ... }
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            // amount expected from frontend in major currency (e.g., 500.00)
            double totalAmount = Double.parseDouble(payload.get("totalAmount").toString());
            long amountInPaise = Math.round(totalAmount * 100); // Razorpay expects smallest currency unit

            RazorpayClient client = new RazorpayClient(razorKeyId, razorKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", payload.getOrDefault("currency", "INR"));
            orderRequest.put("receipt", payload.getOrDefault("receipt", "rcpt_" + System.currentTimeMillis()));
            orderRequest.put("payment_capture", 1); // auto-capture

            Order order = client.Orders.create(orderRequest);

            Map<String, Object> resp = new HashMap<>();
            resp.put("orderId", order.get("id"));
            resp.put("amount", order.get("amount"));
            resp.put("currency", order.get("currency"));
            resp.put("key", razorKeyId); // frontend needs key id
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Order creation failed", "message", e.getMessage()));
        }
    }

    // 2) Verify signature - frontend sends { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String orderId = payload.get("razorpay_order_id");
            String paymentId = payload.get("razorpay_payment_id");
            String signature = payload.get("razorpay_signature");

            // compute HMAC_SHA256(orderId + "|" + paymentId, secret)
            String data = orderId + "|" + paymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorKeySecret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            byte[] digest = sha256_HMAC.doFinal(data.getBytes());
            String generatedSignature = Hex.encodeHexString(digest);

            boolean verified = generatedSignature.equals(signature);
            if (verified) {
                return ResponseEntity.ok(Map.of("verified", true));
            } else {
                return ResponseEntity.status(400).body(Map.of("verified", false, "error", "Signature mismatch"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Verification error", "message", e.getMessage()));
        }
    }
}
