package com.ysh.koreatest.services;

import com.ysh.koreatest.entities.UserEntity;
import com.ysh.koreatest.mappers.MypageMapper;
import com.ysh.koreatest.results.user.DeleteResult;
import com.ysh.koreatest.results.user.MypageResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MypageService {

    private final MypageMapper mypageMapper;

    public boolean isNicknameAvailable(String nickname) {
        if (!isNicknameValid(nickname)) return false;
        return mypageMapper.selectCountByNickname(nickname) == 0;
    }

    public static boolean isPasswordValid(String input) {
        return input != null && input.matches("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{8,50})$");
    }

    public static boolean isNicknameValid(String input) {
        return input != null && input.matches("^[\\da-zA-Z가-힣]{2,10}$");
    }

    public static boolean isBirthValid(String input) {
        return input != null && input.matches("^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$");
    }

    public MypageResult updateUserInfo(UserEntity entity, String email, String currentPw, String newPw, String nickname, String birth) {
        UserEntity user = mypageMapper.selectByEmail(email);
        if (user == null) return MypageResult.FAILURE_SESSION_EXPIRED;

        if (!user.getPassword().equals(currentPw)) return MypageResult.FAILURE_PASSWORD_MISMATCH;


        if (!user.getNickname().equals(nickname)) {
            if (!isNicknameValid(nickname)) return MypageResult.FAILURE;
            int count = mypageMapper.selectCountByNickname(nickname);
            if (count > 0) return MypageResult.FAILURE_NICKNAME_NOT_AVAILABLE;
            user.setNickname(nickname);
            entity.setNickname(nickname);
        }

        if (newPw != null && !newPw.isBlank()) {
            if (!isPasswordValid(newPw)) return MypageResult.FAILURE;
            if (currentPw.equals(newPw)) return MypageResult.FAILURE_PASSWORD_SAME;
            user.setPassword(newPw);
            entity.setPassword(newPw);
        }

        if (!isBirthValid(birth)) return MypageResult.FAILURE;
        user.setBirth(LocalDate.parse(birth));
        entity.setBirth(LocalDate.parse(birth));

        user.setModifiedAt(LocalDateTime.now());
        entity.setModifiedAt(LocalDateTime.now());

        int result = mypageMapper.update(user);
        return result > 0 ? MypageResult.SUCCESS : MypageResult.FAILURE;
    }

    public DeleteResult deleteUser(UserEntity entity, String inputPassword) {
        if (!entity.getPassword().equals(inputPassword)) {
            return DeleteResult.FAILURE_PASSWORD_MISMATCH;
        }

        entity.setDeleted(true); // 탈퇴 처리
        entity.setModifiedAt(LocalDateTime.now());

        int result = mypageMapper.update(entity); // DB에 반영
        return result > 0 ? DeleteResult.SUCCESS : DeleteResult.FAILURE;
    }
}
