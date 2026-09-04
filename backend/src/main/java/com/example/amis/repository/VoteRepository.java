package com.example.amis.repository;

import com.example.amis.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByVoterIdAndPositionId(Long voterId, Long positionId);
    List<Vote> findByElectionId(Long electionId);
}
