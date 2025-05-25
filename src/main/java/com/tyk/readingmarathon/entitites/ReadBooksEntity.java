package com.tyk.readingmarathon.entitites;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = {"marathonIndex", "isbn"})
public class ReadBooksEntity {
    private int marathonIndex;
    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private String thumbnail;
}
