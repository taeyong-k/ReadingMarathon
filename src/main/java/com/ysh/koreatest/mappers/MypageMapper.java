package com.ysh.koreatest.mappers;



import com.ysh.koreatest.entities.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface MypageMapper {
    int insertUser(@Param(value = "user") UserEntity mypage);

    UserEntity selectByEmail(@Param(value = "email") String email);

    UserEntity selectByNickname(@Param(value = "nickname") String nickname);

    int selectCountByEmail(@Param(value = "email") String email);

    int selectCountByNickname(@Param(value = "nickname") String nickname);

    int update(@Param(value = "user") UserEntity user);
}
