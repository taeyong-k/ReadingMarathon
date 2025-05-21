package com.tyk.readingmarathon.controllers;

import com.tyk.readingmarathon.entities.MarathonsEntity;
import com.tyk.readingmarathon.entities.ReadBooksEntity;
import com.tyk.readingmarathon.entities.UserEntity;
import com.tyk.readingmarathon.results.marathon.MainResult;
import com.tyk.readingmarathon.results.marathon.MarathonResult;
import com.tyk.readingmarathon.services.MarathonService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
                           @SessionAttribute(value = "signedUser", required = false ) UserEntity signedUser) {

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

    @RequestMapping(value = "/situation", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postMarathon(MarathonsEntity marathon, HttpServletRequest request)
    {
        MarathonResult result = this.marathonService.saveMarathons(marathon);

        HttpSession session = request.getSession(false);  // 기존 세션 가져오기
        if (session != null) {
            session.invalidate();  // 세션 종료
        }
        JSONObject response = new JSONObject();
        response.put("result", result.toString().toLowerCase());

        return response.toString();
    }

    @RequestMapping(value = "/situation/giveUp", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String giveUpMarathon(MarathonsEntity marathon)
    {
        MarathonResult result = this.marathonService.deleteMarathons(marathon);
        JSONObject response = new JSONObject();
        response.put("result", result.toString().toLowerCase());
        return response.toString();
    }
}
