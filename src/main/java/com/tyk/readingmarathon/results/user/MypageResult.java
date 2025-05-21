package com.tyk.readingmarathon.results.user;

public enum MypageResult {
    FAILURE,
    FAILURE_NICKNAME_NOT_AVAILABLE, // 닉네임 중복
    FAILURE_PASSWORD_MISMATCH,      // 비번 틀림
    FAILURE_PASSWORD_SAME,          // 현재, 신규 비번이 같음
    FAILURE_SESSION_EXPIRED,        // 세션이 만료됨
    SUCCESS
}
