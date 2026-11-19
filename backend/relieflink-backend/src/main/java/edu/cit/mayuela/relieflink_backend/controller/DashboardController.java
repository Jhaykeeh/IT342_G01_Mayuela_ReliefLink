package edu.cit.mayuela.relieflink_backend.controller;

import edu.cit.mayuela.relieflink_backend.model.Role;
import edu.cit.mayuela.relieflink_backend.repository.UserRepository;
import edu.cit.mayuela.relieflink_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {
    private final AuthService authService;
    private final UserRepository userRepository;

    @GetMapping("/requester/dashboard")
    public Map<String, Object> requester(Authentication auth) { return base(auth, "Requester Dashboard"); }

    @GetMapping("/donor/dashboard")
    public Map<String, Object> donor(Authentication auth) { return base(auth, "Donor Dashboard"); }

    @GetMapping("/admin/dashboard")
    public Map<String, Object> admin(Authentication auth) {
        Map<String, Object> data = base(auth, "Administrator Dashboard");
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("requesters", userRepository.countByRole(Role.REQUESTER));
        stats.put("donors", userRepository.countByRole(Role.DONOR));
        stats.put("administrators", userRepository.countByRole(Role.ADMIN));
        data.put("stats", stats);
        return data;
    }

    private Map<String, Object> base(Authentication auth, String title) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("title", title);
        data.put("user", authService.getByEmail(auth.getName()));
        return data;
    }
}