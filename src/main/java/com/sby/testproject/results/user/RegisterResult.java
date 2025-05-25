package com.sby.testproject.results.user;

import com.sby.testproject.results.Result;

public enum RegisterResult implements Result {
    FAILURE,                        // 이런저런 이유로 실패
    FAILURE_EMAIL_NOT_AVAILABLE,    // 이메일 중복
    FAILURE_NICKNAME_NOT_AVAILABLE, // 닉네임 중복
    SUCCESS                         // 성공
}
