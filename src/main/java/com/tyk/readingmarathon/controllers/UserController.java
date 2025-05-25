package com.tyk.readingmarathon.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/user")
// 로그인 페이지 이동을 위한 테스트 로직 (삭제 라인)
public class UserController {
    @RequestMapping(value = "/login", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getLogin() {
        return "/user/login";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public String postLogout(HttpSession session) {
        session.invalidate();  // 세션 완전 삭제 (로그아웃)
        return "redirect:/user/login";  // 로그인 페이지로 이동
    }

    @RequestMapping(value = "/mypage", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getMypage () {
        return "/user/mypage";
    }
}
