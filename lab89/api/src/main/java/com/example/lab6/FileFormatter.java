package com.example.lab6;

import java.util.ArrayList;
import java.util.List;


public class FileFormatter {

    // storing the students in an array
    private Student[] students;

    public FileFormatter(Student[] students) {
        this.students = students;
    }

    /**
     * using the `students` property, indexes into their grade property and
     * calculates the average
     * 
     * @param gradeIndex the index to calculate the average from
     * @return the average grade of this assignment
     */
    public double findAverage(int gradeIndex) {
        double sum = 0;
        for (Student student : students) {
            sum += student.grades[gradeIndex];
        }
        return sum / students.length;
    }

    /**
     * this wraps some data in HTML tag format <tag>data</tag>\n
     * 
     * @param tag  the tag
     * @param data some data
     * @return the formatted data
     */
    private String twrap(String tag, String data) {
        return twrap(tag, data, true);
    }

    /**
     * this wraps some data in HTML tag format <tag>data</tag>
     * 
     * @param tag  the tag
     * @param data some data
     * @param nl   newline if wanted
     * @return the formatted data
     */
    private String twrap(String tag, String data, boolean nl) {
        // formatting the data
        String ret = "<" + tag + ">" + data + "</" + tag + ">";

        // adding a newline if set
        if (nl) {
            ret += "\n";
        }

        return ret;
    }

    /**
     * turns `this.students` into CSV format
     * 
     * @param delimiter the character that separates each field
     * @return a formatted CSV file
     */
    public String toCSV(String delimiter) {
        // starting file
        String file = "name,id,gpa,assignment1,assignment2,labs,midterm,final,avg_assignment1,avg_assignment2,avg_labs,avg_midterm,avg_final\n";

        // calculating
        double[] averages = new double[Student.NUMASMT];
        for (int i = 0; i < Student.NUMASMT; ++i) {
            averages[i] = findAverage(i);
        }

        // appending students
        List<String> points = new ArrayList<String>();
        for (Student student : this.students) {
            // pushing base elements
            points.add(student.name);
            points.add(String.valueOf(student.id));
            points.add(String.valueOf(student.gpa));

            // adding the grades
            for (int index : new int[] { 0, 1, 2, 3, 4 }) {
                points.add(String.valueOf(student.grades[index]));
            }

            // adding the averages
            for (int index : new int[] { 0, 1, 2, 3, 4 }) {
                points.add(String.valueOf(averages[index]));
            }

            file += String.join(delimiter, points) + "\n";

            // clearing the array
            points.clear();
        }

        // returning the file
        return file;
    }

    /**
     * turns `this.students` into XML format
     * 
     * @return a formatted XML file
     */
    public String toXML() {
        // starting file
        String file = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";

        /// adding the averages

        // calculating
        double[] averages = new double[Student.NUMASMT];
        for (int i = 0; i < Student.NUMASMT; ++i) {
            averages[i] = findAverage(i);
        }

        // appending
        String faverages = "";
        for (int i = 0; i < Student.NUMASMT; ++i) {
            faverages += twrap(Student.assignmentFromIndex(i), String.valueOf(averages[i]));
        }
        faverages = twrap("averages", faverages);

        /// adding the students

        // wrapping each Student object in XML tags
        String rstudent = "";
        for (Student student : this.students) {
            // wrapping each Student object in XML tags
            String fstudent = "";

            // appending base information
            fstudent += twrap("name", student.name);
            fstudent += twrap("id", String.valueOf(student.id));
            fstudent += twrap("gpa", String.valueOf(student.gpa));

            // appending grades
            for (int i = 0; i < Student.NUMASMT; ++i) {
                fstudent += twrap(Student.assignmentFromIndex(i), String.valueOf(student.grades[i]));
            }

            // wrapping the data
            rstudent += twrap("student", fstudent);
        }

        // returning the file
        return file + twrap("students", faverages + rstudent);
    }

    /**
     * wraps a string in JSON notation { "field": "data" }
     * 
     * @param field the tag
     * @param data  the piece of data
     * @return the formatted JSON object
     */
    private String jwrap(String field, String data) {
        return "\"" + field + "\": \"" + data + "\",\n";
    }

    /**
     * wraps a double in JSON notation { "field": data }
     * 
     * @param field the tag
     * @param data  the piece of data
     * @return the formatted JSON object
     */
    private String jwrap(String field, double data) {
        return "\"" + field + "\": " + String.valueOf(data) + ",\n";
    }

    /**
     * wraps a int in JSON notation { "field": data }
     * 
     * @param field the tag
     * @param data  the piece of data
     * @return the formatted JSON object
     */
    private String jwrap(String field, int data) {
        return "\"" + field + "\": " + String.valueOf(data) + ",\n";
    }

    /**
     * wraps a string in JSON notation { data }
     * 
     * @param text the tag
     * @return the formatted JSON object
     */
    private String jroot(String text) {
        return "{\n" + text + "\n},";
    }

    /**
     * wraps a string in JSON notation { "field": { text } }
     * 
     * @param field the tag
     * @param text  the piece of data
     * @return the formatted JSON object
     */
    private String jobject(String field, String text) {
        String inner = text;
        if (inner.charAt(inner.length() - 1) == ',') {
            inner = text.substring(0, inner.length() - 1);
        }
        return "\"" + field + "\": {\n" + inner + "\n},\n";
    }

    /**
     * wraps a string in JSON notation { "field": [ text ] }
     * 
     * @param field the tag
     * @param text  the piece of data
     * @return the formatted JSON object
     */
    private String jarr(String field, String text) {
        String inner = text;
        if (inner.charAt(inner.length() - 1) == ',') {
            inner = text.substring(0, inner.length() - 1);
        }
        return "\"" + field + "\": [\n" + inner + "\n],\n";
    }

    /**
     * turns `this.students` into JSON format
     * 
     * @return a formatted JSON file
     */
    public String toJSON(List<Grade> grades) {
        /// adding the averages

        // calculating
        double[] averages = new double[Student.NUMASMT];
        for (int i = 0; i < Student.NUMASMT; ++i) {
            averages[i] = findAverage(i);
        }

        // appending
        String faverages = "";
        for (int i = 0; i < Student.NUMASMT; ++i) {
            faverages += jwrap(Student.assignmentFromIndex(i), String.valueOf(averages[i]));
        }
        faverages = jobject("averages", faverages);

        /// adding the students
        String rstudent = "";

        // wrapping each Student object in XML tags
        for (Student student : this.students) {
            String fstudent = "";

            // appending base information
            fstudent += jwrap("name", student.name);
            fstudent += jwrap("id", student.id);
            fstudent += jwrap("gpa", student.gpa);

            // appending grades
            for (int i = 0; i < Student.NUMASMT; ++i) {
                fstudent += jwrap(Student.assignmentFromIndex(i), String.valueOf(student.grades[i]));
            }

            // wrapping the data
            rstudent += jroot(fstudent);
        }

        // turning the rstudent into a json array
        rstudent = jarr("students", rstudent);

        return "{\n" + faverages + rstudent + "\n}";
    }
  

}
