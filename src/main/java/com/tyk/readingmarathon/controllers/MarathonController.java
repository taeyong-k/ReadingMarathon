package com.tyk.readingmarathon.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tyk.readingmarathon.entitites.ReadBooksEntity;
import com.tyk.readingmarathon.entitites.UserEntity;
import com.tyk.readingmarathon.results.marathon.MainResult;
import com.tyk.readingmarathon.services.MarathonService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequestMapping(value = "/marathon")
public class MarathonController {
    private final MarathonService marathonService;

    @Autowired
    public MarathonController(MarathonService marathonService) {
        this.marathonService = marathonService;
    }

    @RequestMapping(value = "/main", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getMain(HttpSession session,
                          Model model) {
//        UserEntity testUser = new UserEntity();     // 테스트용 로그인 유저 세팅(삭제 라인)
//        testUser.setEmail("test@sample.com");
//        testUser.setNickname("테스트유저");
//        session.setAttribute("signedUser", testUser);

        // 로그인 여부 판단 로직(필요함 Modal이랑 타임리프로 html표시)
        boolean isLogin = (session.getAttribute("signedUser") != null);
        model.addAttribute("loginCheck", isLogin);

        return "/marathon/main";
    }

    @RequestMapping(value = "/main", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postMain(@RequestParam(value = "isbn[]") List<String> isbns,
                           @RequestParam(value = "title[]") List<String> titles,
                           @RequestParam(value = "author[]") List<String> authors,
                           @RequestParam(value = "publisher[]") List<String> publishers,
                           @RequestParam(value = "thumbnail[]") List<String> thumbnails,
                           @SessionAttribute(value = "signedUser", required = false) UserEntity signedUser) {
        if (signedUser == null) {
            JSONObject error = new JSONObject();
            error.put("result", "error");
            return error.toString();
        }

        List<ReadBooksEntity> books = new ArrayList<>();
        for (int i = 0; i < titles.size(); i++) {
            ReadBooksEntity book = new ReadBooksEntity();
            book.setIsbn(isbns.get(i));
            book.setTitle(titles.get(i));
            book.setAuthor(authors.get(i));
            book.setPublisher(publishers.get(i));
            book.setThumbnail(thumbnails.get(i));
            books.add(book);
        }

        MainResult result = marathonService.startMarathon(signedUser, books);

        JSONObject response = new JSONObject();
        response.put("result", result.toString().toLowerCase());
        return response.toString();
    }

    // 마라톤 시작 성공시 -> 테스트용
    @RequestMapping(value = "/TEST", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getTEST() {
        return "/marathon/TEST";
    }



}