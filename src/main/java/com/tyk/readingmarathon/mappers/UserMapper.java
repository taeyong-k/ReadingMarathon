package com.tyk.readingmarathon.mappers;

import com.tyk.readingmarathon.entities.UserEntity;
import com.tyk.readingmarathon.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    int insertUser(@Param(value = "user") UserEntity user);

    UserEntity selectByEmail(@Param(value = "email") String email);

    UserEntity selectByNickname(@Param(value = "nickname") String nickname);

    int selectCountByEmail(@Param(value = "email") String email);

    int selectCountByNickname(@Param(value = "nickname") String nickname);

    int selectCountActiveMarathonByEmail (@Param(value = "email") String email);

    int update(@Param(value = "user") UserEntity user);
}
