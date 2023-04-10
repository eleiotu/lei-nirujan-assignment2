package com.example.lab6;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.IOException;
import java.nio.file.Files;

@Path("/students")
public class StudentResource {

    /**
     * This function retrieves a file using Java's built-in reflection functions.
     * This is because Java doesn't look in the directory you think it does on start up, this
     * is a way of guaranteeing it will return the absolute path of the file you're trying to read from.
     * @param filename the name of the file
     * @return the file's contents
     */
    private String readFileContents(String filename) {

        String fp = StudentResource.class.getResource(filename).toString();
        fp = fp.substring(fp.indexOf('/') + 1);

        try {
            java.nio.file.Path file = java.nio.file.Path.of(fp);
            return Files.readString(file);
        } catch (IOException e) {
            // something went wrong
            return "Did you forget to create the file?\n" +
                    "Is the file in the right location?\n" + e;
        }
    }

    @GET
    @Path("/json")
    @Produces(MediaType.APPLICATION_JSON)
    public Response json() {
        String content = this.readFileContents("/students.json");

        return Response.status(200)
                .entity(content)
                .build();
    }

    @GET
    @Path("/csv")
    @Produces("text/csv")
    public Response csv() {
        String content = this.readFileContents("/students.csv");

        return Response.status(200)
                .entity(content)
                .build();
    }

    @GET
    @Path("/xml")
    @Produces(MediaType.APPLICATION_XML)
    public Response xml() {
        String content = this.readFileContents("/students.xml");

        return Response.status(200)
                .entity(content)
                .build();
    }
}
