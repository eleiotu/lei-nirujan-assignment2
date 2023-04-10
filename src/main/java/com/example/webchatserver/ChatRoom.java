package com.example.webchatserver;


import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


/**
 * This class represents a web socket server, a new connection is created, and it receives a roomID as a parameter
 * **/
@ServerEndpoint(value="/ws/{roomID}")
public class ChatServer {

    // contains a static List of ChatRoom used to control the existing rooms and their users
    private Map<String, String> usernames = new HashMap<String, String>();
    private static Map<String, String> roomList = new HashMap<String, String>();



    //Handles when server is opened
    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) throws IOException, EncodeException {
        roomList.put(session.getId(), roomID);
        System.out.println("Room joined ");

        session.getBasicRemote().sendText("First sample message to the client");
//        accessing the roomID parameter
        System.out.println(roomID);
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\" \\n Welcome to the chat room. Please state your name\"}");

    }

    //handles when server is closed
    @OnClose
    public void close(Session session) throws IOException, EncodeException {

        String userId = session.getId();
        if(usernames.containsKey(userId))
        {
            String username = usernames.get(userId);
            String roomID = roomList.get(userId);
            usernames.remove(userId);
            roomList.remove(roomID);
            for( Session peer: session.getOpenSessions())
            {
                peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\" (Server): " + username + " left the chat room.\"}");
            }
        }
    }
    //handles when message is sent
    @OnMessage
    public void handleMessage(String comm, Session session, @PathParam("room") String room) throws IOException, EncodeException {
//        example getting unique userID that sent this message

        String userID = session.getId();
        String roomID = roomList.get(userID); // my room
        JSONObject jsonmsg = new JSONObject(comm);
        String type = (String) jsonmsg.get("type");
        String message = (String) jsonmsg.get("message");

        //Check if user is part of users

        if(usernames.containsKey(userID)){
            String username = usernames.get(userID);

            System.out.println(username);
            //This is not their first message
            for(Session peer: session.getOpenSessions()) {
                if(roomList.get(peer.getId()).equals(roomID)) {
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(" + username + "): " + message + "\"}");
                }
            }

        } else { //first message is their username
            usernames.put(userID, message);

            for(Session peer: session.getOpenSessions()){
                //message to self
                if(!peer.getId().equals(userID)){
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\" (Server): " + message + " joined the chat room.\"}");

                }else {
                    //broadcast to others
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\" (Server): Welcome, " + message + "\"}");
                }

            }
        }

    }


}
