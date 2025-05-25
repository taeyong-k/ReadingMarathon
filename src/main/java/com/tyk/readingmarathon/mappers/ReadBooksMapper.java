package com.tyk.readingmarathon.mappers;

import com.tyk.readingmarathon.entitites.ReadBooksEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReadBooksMapper {
    int insertBook(@Param(value = "book") ReadBooksEntity book);
}
