// CustomerRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhone(String phone);

    Optional<Customer> findByEmailOrPhone(String email, String phone);

    List<Customer> findByIsActiveTrueOrderByNameAsc();

    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c.isActive = true")
    List<Customer> findByNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);

    @Query("SELECT c FROM Customer c WHERE c.lastLogin > :since")
    List<Customer> findRecentlyActiveCustomers(@Param("since") LocalDateTime since);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}