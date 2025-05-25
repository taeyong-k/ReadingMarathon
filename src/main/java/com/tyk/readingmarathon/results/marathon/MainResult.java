package com.tyk.readingmarathon.results.marathon;

public enum MainResult {
    FAILURE,                    // 정규화 실패
    FAILURE_SESSION_EXPIRED,    // 로그아웃, 권한 없음, 세션 만료
    FAILURE_INSUFFICIENT_BOOKS, // 책 권수 부족 (3권 미만)
    FAILURE_INVALID_BOOK_DATA,  // 책 데이터 불완전 (ISBN, 제목 등 누락)
    SUCCESS,                    // 정상 처리 완료
    FAILURE_ALREADY_ACTIVE      // 진행 중인 마라톤 존재 (중복 생성 방지)
}