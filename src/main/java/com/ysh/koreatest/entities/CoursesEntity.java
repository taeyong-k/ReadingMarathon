package com.ysh.koreatest.entities;

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
