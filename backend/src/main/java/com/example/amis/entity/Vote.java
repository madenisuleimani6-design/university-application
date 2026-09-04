package com.example.amis.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "election_votes", uniqueConstraints = @UniqueConstraint(name = "uk_vote_voter_position", columnNames = {"voter_id", "position_id"}))
@Data
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "voter_id")
    private User voter;

    @ManyToOne(optional = false)
    @JoinColumn(name = "election_id")
    private Election election;

    @ManyToOne(optional = false)
    @JoinColumn(name = "position_id")
    private ElectionPosition position;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @Column(nullable = false)
    private LocalDateTime votedAt;
}
