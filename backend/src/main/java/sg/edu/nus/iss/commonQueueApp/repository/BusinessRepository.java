
// BusinessRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.entity.BusinessType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {

    Optional<Business> findByEmail(String email);

    List<Business> findByBusinessTypeAndIsActiveTrue(BusinessType businessType);

    List<Business> findByIsActiveTrueOrderByBusinessNameAsc();

    @Query("SELECT b FROM Business b WHERE b.isActive = true AND b.isVerified = true")
    List<Business> findActiveAndVerifiedBusinesses();

    @Query("SELECT b FROM Business b WHERE LOWER(b.businessName) LIKE LOWER(CONCAT('%', :name, '%')) AND b.isActive = true")
    List<Business> findByBusinessNameContainingIgnoreCaseAndIsActiveTrue(@Param("name") String name);

    @Query("SELECT b FROM Business b WHERE b.address LIKE %:location% AND b.isActive = true")
    List<Business> findByLocationAndIsActiveTrue(@Param("location") String location);

    boolean existsByEmail(String email);
}
