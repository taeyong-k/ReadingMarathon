package com.tyk.readingmarathon.controllers;


import com.tyk.readingmarathon.entities.UserEntity;
import com.tyk.readingmarathon.results.CommonResult;
import com.tyk.readingmarathon.results.Result;
import com.tyk.readingmarathon.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    // 회원가입

    @RequestMapping(value = "/register", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getRegister() {
        return "user/register";
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegister(UserEntity user) {
        Result result = this.userService.register(user);
        JSONObject response = new JSONObject();
        response.put("result", result.toStringLower());
        return response.toString();
    }

    
    // 이메일 중복 체크
    @RequestMapping(value = "/email-check", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postEmailCheck(@RequestParam(value = "email", required = false) String email) {
        Result result = this.userService.checkEmail(email);
        JSONObject response = new JSONObject();
        response.put("result", result.toStringLower());
        System.out.println("email check" + result.toStringLower());
        return response.toString();
    }

    // 닉네임 중복 체크
    @RequestMapping(value = "/nickname-check", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postNicknameCheck(@RequestParam(value = "nickname", required = false) String nickname) {
        Result result = this.userService.checkNickname(nickname);
        JSONObject response = new JSONObject();
        response.put("result", result.toStringLower());
        return response.toString();
    }
    // 회원가입


    // 로그인
    @RequestMapping(value = "/login", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getLogin(@SessionAttribute(value = "signedUser", required = false) UserEntity user) {
        if (user == null) {
            return "user/login";
        } else {
            boolean hasMarathon = userService.hasActiveMarathon(user.getEmail());
            return hasMarathon ? "redirect:/marathon/situation" : "redirect:/marathon/main"; // 진행 중인 마라톤이 있을 시 마라톤 페이지, 아닐 경우 검색 페이지로 이동
        }
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session, UserEntity user) {
        Result result = this.userService.login(user);

        JSONObject response = new JSONObject();
        response.put("result", result.toStringLower());

        if (result == CommonResult.SUCCESS) {
            session.setAttribute("signedUser", user);

            boolean hasMarathon = this.userService.hasActiveMarathon(user.getEmail());
            response.put("redirect", hasMarathon ? "/marathon/situation" : "/marathon/main");
        }

        return response.toString();
    }
}
