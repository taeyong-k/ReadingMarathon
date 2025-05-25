package com.sby.testproject.mappers;

import com.sby.testproject.entities.ReadBooksEntity;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

@Mapper
public interface ReadBooksMapper {

    int insertBook(@Param(value = "book") ReadBooksEntity book);

    ReadBooksEntity[] selectAllByIndex(@Param(value = "index") int index);

    int update(@Param(value = "readBooks")ReadBooksEntity readBooks);

    ReadBooksEntity selectByIndex(int index);
}
