package com.kolge.chatbot.service;

import com.kolge.chatbot.model.Message;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WebSocketChatService {

    List<Message> messages = new ArrayList<>();

    public void addMessage(Message message){
        messages.add(message);
    }

    public List<Message> getAll(){
        return messages;
    }

}
