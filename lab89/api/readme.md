# Lab 9 - Grade Calculator (Back End)

>It is recommended to complete [lab 8](../client) first then do this lab next.

In this lab, we'll use the JSON library known as Jackson in order to parse a raw JSON payload into Java objects.

## Lab Work

This is the Java portion of this two week lab, you're going to extend the functionality of your server.

>You'll need to download a library called Jackson which is a nice JSON parser for Java.  
>The package is already included in your `pom.xml` you'll need to download it via. maven.

Like in previous labs, here is the usual flow of operations.

1. receive payload - getting a request from the user
2. parse payload - parsing the JSON payload into objects which can be worked with
3. perform calculations - calculate the weighted grade
4. return payload - transforming the payload into a file and sending it back to the user

### Receiving the Payload

Here is sample code for the new endpoint which will deal with this new request:

```java
// APIFormatter.java

@POST
@Path("/grade")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public Response grade(String body) {
    List<Grade> grades;

    // rejecting if the data is empty
    if (body.isEmpty()) {
        return Response.status(400)
                .entity("No data passed in the body.")
                .build();
    }

    // parsing the body of the request
    try {
        grades = Grade.fromJSON(body);
    } catch (Exception e) {
        System.out.println(e);
        return Response.status(400).entity("Bad data passed to the API\n" +
                e).build();
    }

    // forming the final response
    String response;

    // performing calculations and creating the response
    try {
        response = FileFormatter.toJSON(grades); // note that this is now a static method, you'll need to refactor the class. See the last header.
    } catch (JsonProcessingException e) {
        System.out.println(e);
        return Response.status(500).entity("An error occurred whilst serializing the data").build();
    }

    // returning the response to the user
    return Response.status(200)
            .entity(response)
            .build();
}
```

Here is a prettified sample payload you can expect from the client.

```json
{
  "grades": [
    {
      "name": "midterm",
      "weight": "20",
      "grade": "82"
    },
    {
      "name": "final",
      "weight": "35",
      "grade": "90"
    },
  ]
}
```

>During data transfer, data is usually compressed and any non significant characters (usually whitespace, tabs and newlines) are removed.

### Parsing the Payload

You'll need to implement the following class that's given to you in `Grade.java`:

```java
// Grade.java
public class Grade {
    String name;
    double weight;
    double grade;

    Grade(String n, String w, String g) throws NumberFormatException {}
    public static List<Grade> fromJSON(String payload) throws JsonProcessingException, RuntimeException {}
    public static double weightedGrade(List<Grade> grades) {}
    public String toString() {}
    public boolean isEmpty() {}
    public boolean isValidWeight() {}
    public boolean isValidGrade() {}
}
```

>See javadoc comments in the file to see how to implement each function.

Within the constructor of the class, you'll need to parse the `double` from the `grade` and `weight` string arguments.
If there is no valid number throw a `NumberFormatException` and catch it within the endpoint function in `APIFormatter` and return a response with HTTP code `400`.

>The `Double` class should throw this error for you.

You'll also need to ensure that all the data parsed is valid so that the server can produce a valid response:

- `weight` and `grade` must be between 0 and 100 inclusive
- the sum of all `weight` properties must be 100

#### Working with Jackson

You'll need to grab the `grades` node, you can do so by this command:

```java
// grabbing the `grades` node
ObjectMapper mapper = new ObjectMapper();
JsonNode grades = mapper.readTree(payload).path("grades");
```

### Performing Calculations

A *weighted* grade calculation is done as follows: $grade=w_1\cdot g_2+w_2\cdot g_2+\ldots+w_n\cdot g_n$.
Using your `Grade` objects, you'll calculate the final grade.

You'll need to implement the `weightedGrade(List<Grade>)` function in your `Grade` class to do this.

Note that `weight` should be a percentage e.g., $[0,1]$ but here we are parsing it as a whole number e.g., $[0,100]$.
During the calculation, you'll need to divide each `weight` by 100 to turn it into a percentage.

### Returning the Data

Finally, you'll need to return this data back to the user.
Here's what this payload should look like:

```json
{
  "grade": 40
}
```

The class that's going to create this JSON payload is your `FileFormatter` class.
You are going to refactor the class to only use static methods, there also shouldn't be a constructor.

>The logic behind this is that the class itself only transforms data and doesn't need to be instantiated nor have any properties.
>This is functional programming, languages like Haskell are built upon this principle.

In the end, the following function call should be valid:

```java
public class FileFormatter {
    public static String toJSON(List<Grade> grades) {}
}
```
