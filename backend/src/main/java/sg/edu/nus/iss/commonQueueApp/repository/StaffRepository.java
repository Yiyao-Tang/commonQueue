// StaffRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.Staff;
import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.entity.StaffRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmail(String email);

    List<Staff> findByBusinessAndIsActiveTrueOrderByNameAsc(Business business);

    List<Staff> findByBusinessIdAndIsActiveTrue(Long businessId);

    List<Staff> findByRoleAndIsActiveTrue(StaffRole role);

    @Query("SELECT s FROM Staff s WHERE s.business.id = :businessId AND s.role = :role AND s.isActive = true")
    List<Staff> findByBusinessIdAndRoleAndIsActiveTrue(@Param("businessId") Long businessId, @Param("role") StaffRole role);

    boolean existsByEmail(String email);

    @Query("SELECT COUNT(s) FROM Staff s WHERE s.business.id = :businessId AND s.isActive = true")
    Long countActiveStaffByBusinessId(@Param("businessId") Long businessId);
}