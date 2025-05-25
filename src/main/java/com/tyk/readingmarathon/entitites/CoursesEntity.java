package com.tyk.readingmarathon.entitites;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "code")
public class CoursesEntity {
    private String code;
    private String displayText;
}
