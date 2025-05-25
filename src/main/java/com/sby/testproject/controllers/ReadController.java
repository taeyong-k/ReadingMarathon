package com.sby.testproject.controllers;


import com.sby.testproject.entities.MarathonsEntity;
import com.sby.testproject.entities.ReadBooksEntity;
import com.sby.testproject.entities.UserEntity;
import com.sby.testproject.results.marathon.MarathonResult;
import com.sby.testproject.services.MarathonService;
import com.sby.testproject.services.ReadBooksService;
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

    private final MarathonService marathonService;
    private final ReadBooksService readBooksService;

    @Autowired
    public ReadController(MarathonService marathonService, ReadBooksService readBooksService) {
        this.marathonService = marathonService;
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

    @RequestMapping(value = "/situation-books",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ReadBooksEntity[] getReadBooks(MarathonsEntity marathon)
    {
        return this.readBooksService.getReadBooks(marathon.getUserEmail());
    }




}
