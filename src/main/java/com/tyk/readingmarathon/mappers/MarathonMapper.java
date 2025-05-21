package com.tyk.readingmarathon.mappers;

import com.tyk.readingmarathon.entities.MarathonsEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MarathonMapper {
    // 새 마라톤 생성 후 자동 생성된 PK를 반환
    int insertMarathon(@Param(value = "marathon")MarathonsEntity marathon);

    MarathonsEntity selectByUserEmail(@Param(value = "email")String email);

    // 진행중인 마라톤 인덱스 조회
    Integer selectActiveMarathonIndexByUserEmail(String userEmail);

    int update(@Param(value = "marathons") MarathonsEntity marathons);
}
