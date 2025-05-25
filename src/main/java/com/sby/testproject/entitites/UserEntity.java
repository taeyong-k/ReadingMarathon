package com.sby.testproject.entitites;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 열 이름 > 카멜 케이스
// DATE > LocalDate
// DATETIME > LocalDateTime
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "email")
public class UserEntity {
    private String email;
    private String password;
    private String nickname;
    private LocalDate birth;
    private String gender;
    private boolean isAdmin;
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
