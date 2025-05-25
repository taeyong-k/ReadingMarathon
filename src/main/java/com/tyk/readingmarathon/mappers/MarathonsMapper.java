package com.tyk.readingmarathon.mappers;

import com.tyk.readingmarathon.entitites.MarathonsEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MarathonsMapper {
    // 새 마라톤 생성 후 자동 생성된 PK를 반환
    int insertMarathon(@Param(value = "marathon")MarathonsEntity marathon);

    // 진행중인 마라톤 인덱스 조회
    Integer selectActiveMarathonIndexByUserEmail(String userEmail);
}
