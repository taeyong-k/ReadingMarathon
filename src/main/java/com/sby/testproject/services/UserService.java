package com.sby.testproject.services;

import com.sby.testproject.entitites.UserEntity;
import com.sby.testproject.mappers.UserMapper;
import com.sby.testproject.results.CommonResult;
import com.sby.testproject.results.Result;
import com.sby.testproject.results.user.LoginResult;
import com.sby.testproject.results.user.RegisterResult;
import com.sby.testproject.utils.CryptoUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
//@RequiredArgsConstructor // @Autowired와 생성자 DI 세트
public class UserService
{
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    // 이메일 형식
    public static boolean isEmailValid(String input) {
        return input != null && input.matches("^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$");
    }

    // 비밀번호 형식
    public static boolean isPasswordValid(String input) {
        return input != null && input.matches("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:'\",<.>/?]{8,50})$");
    }

    // 닉네임 형식
    public static boolean isNicknameValid(String input) {
        return input != null && input.matches("^([\\da-zA-Z가-힣]{2,10})$");
    }

    // 생년월일 형식 (미래 날짜는 선택 불가능)
    public static boolean isFutureBirthDate(LocalDate input) {
        return input.isAfter(LocalDate.now());
    }

    // 마라톤 참여 여부 확인
    public boolean hasActiveMarathon(String email) {
        return userMapper.selectCountActiveMarathonByEmail(email) > 0;
    }

    // 회원가입
    public Result register (UserEntity user) {
        if (user == null ||
                user.getEmail() == null ||
                user.getPassword() == null ||
                user.getNickname() == null ||
                user.getBirth() == null ||
                user.getGender() == null ||
                (!user.getGender().equals("M") && !user.getGender().equals("F")) ||
                !UserService.isEmailValid(user.getEmail()) ||
                !UserService.isPasswordValid(user.getPassword()) ||
                !UserService.isNicknameValid(user.getNickname()) ||
                isFutureBirthDate(user.getBirth())) {
            System.out.println("111111");
            return CommonResult.FAILURE;
        }

        if (this.userMapper.selectCountByEmail(user.getEmail()) > 0) {
            return RegisterResult.FAILURE_EMAIL_NOT_AVAILABLE;
        }

        if (this.userMapper.selectCountByNickname(user.getNickname()) > 0) {
            return RegisterResult.FAILURE_NICKNAME_NOT_AVAILABLE;
        }

        user.setPassword(CryptoUtils.hashSha512(user.getPassword()));

        user.setAdmin(false);
        user.setDeleted(false);

        user.setCreatedAt(LocalDateTime.now());
        user.setModifiedAt(LocalDateTime.now());

        System.out.println("22222222");
        return this.userMapper.insertUser(user) > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
    }

    // 이메일 중복 체크
    public Result checkEmail(String email) {
        if (!UserService.isEmailValid(email)) {
            return RegisterResult.FAILURE_EMAIL_NOT_AVAILABLE;
        }

        System.out.println("3333333333");
        System.out.println("db search" + this.userMapper.selectCountByEmail(email));
        return this.userMapper.selectCountByEmail(email) > 0 ? RegisterResult.FAILURE_EMAIL_NOT_AVAILABLE : CommonResult.SUCCESS;
    }

    // 닉네임 중복 체크
    public Result checkNickname(String nickname) {
        if (!UserService.isNicknameValid(nickname)) {
            return RegisterResult.FAILURE_NICKNAME_NOT_AVAILABLE;
        }

        System.out.println("4444444444444");
        return this.userMapper.selectCountByNickname(nickname) > 0 ? RegisterResult.FAILURE_NICKNAME_NOT_AVAILABLE : CommonResult.SUCCESS;
    }


    // 로그인
    public Result login(UserEntity user) {
        if (user == null || !UserService.isEmailValid(user.getEmail()) || !UserService.isPasswordValid(user.getPassword())) {
            System.out.println("555555555");
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.userMapper.selectByEmail(user.getEmail());
        if (dbUser == null) {
            System.out.println("666666666");
            return LoginResult.FAILURE_NO_ACCOUNT;
        }
        if (dbUser.isDeleted()) {
            System.out.println("7777777");
            return LoginResult.FAILURE_NO_ACCOUNT;
        }

        String hashedPassword = CryptoUtils.hashSha512(user.getPassword());
        if (!dbUser.getPassword().equals(hashedPassword)) {
            System.out.println("888888888");
            return CommonResult.FAILURE;
        }
        user.setPassword(dbUser.getPassword());
        user.setNickname(dbUser.getNickname());
        user.setBirth(dbUser.getBirth());
        user.setGender(dbUser.getGender());
        user.setAdmin(dbUser.isAdmin());
        user.setDeleted(dbUser.isDeleted());
        user.setCreatedAt(dbUser.getCreatedAt());
        user.setModifiedAt(dbUser.getModifiedAt());
        return CommonResult.SUCCESS;
    }
}
