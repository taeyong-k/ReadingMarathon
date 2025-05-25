package com.ysh.koreatest.controllers;

import com.ysh.koreatest.entities.UserEntity;
import com.ysh.koreatest.results.user.DeleteResult;
import com.ysh.koreatest.results.user.MypageResult;
import com.ysh.koreatest.services.MypageService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class MypageController {

    private final MypageService mypageService;

    @Autowired
    public MypageController(MypageService mypageService) {
        this.mypageService = mypageService;
    }

    @RequestMapping(value = "/mypage", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getMypage(HttpSession session,
                            Model model) {
        Object object = session.getAttribute("user");
        if (object == null) {
            return "redirect:/user/login";
        }
        UserEntity user = (UserEntity) object;
        model.addAttribute("user", user);

        return "user/mypage";
    }

    @RequestMapping(value = "/mypage", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public MypageResult patchMypage(HttpSession session,
                                    @RequestParam("email") String email,  // 넣어야함
                                    @RequestParam("currentPassword") String currentPw,
                                    @RequestParam("newPassword") String newPw,
                                    @RequestParam("nickname") String nickname,
                                    @RequestParam("birth") String birth) {    // js - formData
        Object object = session.getAttribute("user"); // 로그인한 유저의 정보 (Object 형으로 바인딩)
        if (object == null) { // 로그인 안했는데 유저 정보 수정하려고 함
            return null; // 오류 리턴해주세요
        }
        UserEntity entity = (UserEntity) object; // 실제 유저 객체로 변경
        return mypageService.updateUserInfo(entity, email, currentPw, newPw, nickname, birth);
    }

    @RequestMapping(value = "/nickname-check", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public boolean checkNickname(@RequestParam("nickname") String nickname) {
        return mypageService.isNicknameAvailable(nickname);
    }


    @RequestMapping(value = "/remove-account", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public DeleteResult withdraw(HttpSession session,
                                 @RequestParam("passwordCheck") String passwordCheck) {
        Object object = session.getAttribute("user");
        if (object == null) {
            return DeleteResult.FAILURE_SESSION_EXPIRED;
        }

        UserEntity entity = (UserEntity) object;
        return mypageService.deleteUser(entity, passwordCheck);
    }
}
