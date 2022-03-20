package com.kolge.chatbot.controller;

import com.kolge.chatbot.model.Message;
import com.kolge.chatbot.service.WebSocketChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MessageController {

    @Autowired
    private WebSocketChatService webSocketChatService;

    @GetMapping("/api/messages")
    public List<Message> findAll() {
        return webSocketChatService.getAll();
    }

}
