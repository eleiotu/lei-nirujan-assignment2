package com.example.lab6;

import java.util.Arrays;

public class Student {

    public String name;    // the student's name
    public int id;         // the student's id
    public double gpa;     // the student's gpa
    public double[] grades;   // the student's grades

    // the indices to index grades
    public final static int ASMT1 = 0;
    public final static int ASMT2 = 1;
    public final static int LABS = 2;
    public final static int MIDTERM = 3;
    public final static int FINAL = 4;
    public final static int NUMASMT = 5;

    /**
     * the default constructor for the class
     * @param name      the student's name
     * @param id        the student's id
     * @param gpa       the student's gpa
     * @param grades    the student's grades
     */
    public Student(String name, int id, double gpa, double[] grades) {
        this.name = name;
        this.id = id;
        this.gpa = gpa;
        this.grades = grades;
    }

    // assigning an index to a string, not required but helpful
    public static String assignmentFromIndex(int index) throws IndexOutOfBoundsException {
        switch(index) {
            case Student.ASMT1:
                return "assignment1";
            case Student.ASMT2:
                return "assignment2";
            case Student.LABS:
                return "labs";
            case Student.MIDTERM:
                return "midterm";
            case Student.FINAL:
                return "final";
            default:
                throw new IndexOutOfBoundsException("Invalid index: " + String.valueOf(index));
        }
    }

    /**
     * takes some HTML and parses a `Student` from each `<tr>`
     * @param payload           the html payload
     * @return a `Student[]`
     * @throws RuntimeException throws if a student object returns true from `isEmpty()`
     */
    public static Student[] fromHTML(String payload) throws RuntimeException {
        Student[] arr;

        // getting the tbody
        String tbody = payload.substring(payload.indexOf("<tbody>"));

        // getting the <tr>
        String tr = tbody.substring(tbody.indexOf("<tr>"), tbody.lastIndexOf("</tr>"));
        String[] trs = (String[]) Arrays.stream(tr.split("</tr>")).map(row -> {
            return row.substring(row.indexOf("<td>"));
        }).toArray(String[]::new);

        // transforming to student array
        arr = (Student[]) Arrays.stream(trs).map(row -> {
            // getting the raw data
            String[] raw = (String[]) Arrays.stream(row.split("</td>")).map(untrimmed -> {
                return untrimmed.replace("<td>", "");
            }).toArray(String[]::new);

            // parsing grades in a poor fashion
            double[] grades = new double[] {
                    Double.parseDouble(raw[3]),
                    Double.parseDouble(raw[4]),
                    Double.parseDouble(raw[5]),
                    Double.parseDouble(raw[6]),
                    Double.parseDouble(raw[7])
            };

            // mapping the data into a student object
            return new Student(raw[0], Integer.parseInt(raw[1]), Double.parseDouble(raw[2]), grades);
        }).toArray(Student[]::new);

        // iterating through the data to ensure that the data is valid
        for(Student s : arr) {
            if (s.isEmpty()) {
                throw new RuntimeException("Student: " + s + " is invalid");
            }
        }

        return arr;
    }

    /**
     * this turns the object into string format: [Student name:name, id:id, gpa:gpa]
     * @return the object cast into string format
     */
    public String toString() {
        return "[Student {name:" + this.name + ", id:" + this.id + ", gpa:" + this.gpa + "}]";
    }

    /**
     * returns true if:
     * - the name is not empty
     * - isValidId() is true
     * - isValidGPA() is true
     * @see #isValidId()
     * @see #isValidGPA()
     * @return true if all fields are empty
     */
    public boolean isEmpty() {
        return !name.isEmpty() && !this.isValidId() && !this.isValidGPA();
    }

    /**
     * tests if the student's id is valid or not
     * @return true if the id is != to -1 and greater than 100,000,000
     */
    public boolean isValidId() {
        return id != -1 && id >= 100000000;
    }

    /**
     * tests if the student's gpa is valid or not
     * @return true if the gpa is between 0 and 4.3
     */
    public boolean isValidGPA() {
        return gpa >= 0 && gpa <= 4.3;
    }
}
