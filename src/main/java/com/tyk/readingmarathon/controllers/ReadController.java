package com.tyk.readingmarathon.controllers;


import com.tyk.readingmarathon.entities.MarathonsEntity;
import com.tyk.readingmarathon.entities.ReadBooksEntity;
import com.tyk.readingmarathon.entities.UserEntity;
import com.tyk.readingmarathon.results.marathon.MarathonResult;
import com.tyk.readingmarathon.services.MarathonService;
import com.tyk.readingmarathon.services.ReadBooksService;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequestMapping(value = "/marathon")
public class ReadController {

    private final ReadBooksService readBooksService;

    @Autowired
    public ReadController(ReadBooksService readBooksService) {
        this.readBooksService = readBooksService;
    }

    @RequestMapping(value = "/situation", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getMarathon(Model model)
    {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
        String formatted = now.format(formatter);
        model.addAttribute("now", formatted); // thymeleaf로 넘겨줌
        return "/marathon/situation";
    }

    @RequestMapping(value = "/situation",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ReadBooksEntity[] getReadBooks(HttpSession session)
    {
        UserEntity user = (UserEntity) session.getAttribute("signedUser");
        if (user == null)
        {
            return null;
        }
        return this.readBooksService.getReadBooks(user.getEmail());
    }




}
