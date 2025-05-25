package com.tyk.readingmarathon.entitites;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "index")
public class MarathonsEntity {
    private int index;
    private String userEmail;
    private String courseCode;
    private int readCount;
    private boolean isDone;
    private LocalDateTime createdAt;
    private LocalDateTime finishedAt;
    private boolean isDeleted;
}
