package sg.edu.nus.iss.commonQueueApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.repository.BusinessRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class BusinessUserDetailsService implements UserDetailsService {

    @Autowired
    private BusinessRepository businessRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Business business = businessRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Business not found with email: " + email));

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_BUSINESS"));

        return User.builder()
                .username(business.getEmail())
                .password(business.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(!business.getIsActive())
                .credentialsExpired(false)
                .disabled(!business.getIsActive())
                .build();
    }
}