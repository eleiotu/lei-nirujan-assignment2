/**
 * A student object
 * @typedef Student
 * @property {String} name the name of the student
 * @property {Number} id the id of the student 
 * @property {Number} gpa the student's gpa
 * @property {Number} assignment1 the mark for assignment 1
 * @property {Number} assignment2 the mark for assignment 2
 * @property {Number} labs the mark for the labs
 * @property {Number} midterm the mark for the midterm
 * @property {Number} final the mark for the final
 */

/// lab 6 work

function post_to_server(endpoint, contentType) {
  // setting the url
  const url = "http://localhost:8080/lab6-1.0/api/format/" + endpoint;

  // getting the payload
  const payload = document.getElementById("chart").innerHTML;

  /// creating a response to the server
  const request = new XMLHttpRequest();
  request.open("POST", url); // setting the method
  request.setRequestHeader("Content-Type", "text/html"); // setting the sending content-type
  request.setRequestHeader("Accept", contentType); // setting the receiving content-type

  // on response handler
  request.onload = () => {
    if (request.status !== 200) {
      console.error("Something went wrong went contacting the server");
      return;
    }
    console.log("Received from the server: ", request.responseText); // this contains the received payload

    /**
     * this is how to programmatically download something in javascript.
     * 1. create an invisible anchor tag
     * 2. set the href attribute (contains file data)
     * 3. set the download attribute (contains the file name)
     * 4. click it
     */
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${contentType};charset=utf-8,` +
        encodeURIComponent(request.responseText)
    );
    element.setAttribute("download", `students.${endpoint}`);
    element.click();
  };

  // sending the payload to the server
  request.send(payload);
}

/// lab 5 work

/**
 * this is a clean wrapper to add students to `table#chart > tbody`
 * @param {Student} student the student to add
 */
function from_student(student) {
  // adding it to the table
  add_record(student);
}

/**
 * this function gets a name, id and GPA from the user
 * and sends it to `add_record()` which adds the data to `table#chart > tbody`
 */
function from_inputs() {
  // the list of IDs of the inputs and also the keys of a JSON object
  const keys = [
    "name",
    "id",
    "gpa",
    "assignment1",
    "assignment2",
    "labs",
    "midterm",
    "final",
  ];

  /**
   * this is very functional and decently advanced for the students, they will most likely
   * have rudimentary lines where they manually create variables for each HTMLInputElement
   * on the page, then a variable for their values, etc.
   */
  const refs = keys.map((id) => {
    return document.getElementById(id);
  });

  // getting the values from the refs
  values = refs.map((el) => {
    // setting the value to null which works better with truthy operators
    return el.value === "" ? null : el.value;
  });

  // the function shouldn't add records if one of the values are `null`
  if (
    !values.every((value) => {
      return value !== null;
    })
  ) {
    return;
  }

  // making a JSON object from the keys in `keys` and the values in `refs`
  const student = {};
  keys.forEach((key, index) => {
    student[key] = values[index];
  });

  // appending the data to the table
  add_record(student);

  // clearing all of the inputs
  refs.forEach((el) => {
    el.value = "";
  });
}

/**
 * this function takes a name, id and GPA and transforms it into a `<tr>` which
 * gets appended to `table#chart > tbody`
 * @param {Student} student a student object
 */
function add_record(student) {
  /**
   * the smarter more inclined students might abstract the logic of `from_inputs()` into its own function
   * just like in this file, other than that
   * the students will have to modify their code to accept `Student` objects
   */

  // a poor man's way of assigning default values (this relies on the values being null not "")
  student.name = student.name ?? "John";
  student.id = student.id ?? 100000000;
  student.gpa = student.gpa ?? 0;
  student.assignment1 = student.assignment1 ?? 0;
  student.assignment2 = student.assignment2 ?? 0;
  student.labs = student.labs ?? 0;
  student.midterm = student.midterm ?? 0;
  student.final = student.final ?? 0;

  // the `wrap()` function is optional and most students aren't going to have it
  const data = Object.keys(student).map((key) => {
    return wrap("td", student[key]);
  });
  const row = wrap("tr", data.join(""));

  /**
   * the students need to append the new row to the tbody element,
   * not the table element
   */
  document.getElementById("chart").getElementsByTagName("tbody")[0].innerHTML +=
    row;
}

/**
 * an optional function which aids in HTML tag wrapping
 * @param {String} tag the HTML tag
 * @param {String} data something to wrap
 * @returns {String} `<tag>data</tag>`
 */
function wrap(tag, data) {
  return `<${tag}>${data}</${tag}>`;
}

const URL = "http://localhost:8080/lab6-1.0/api/students/json";

/**
 * anonymous function that executes on script load
 *
 * this is what the students are going to be tested on
 */
(function () {
  fetch(URL)
    .then((res) => res.json()) // `.json()` returns a promise, not data
    .then((data) => {
      console.log(`Loaded data from ${URL}: `, data);

      // using `in` will not work
      for (const student of data["students"]) {
        // just a wrapper around `add_record()`
        from_student(student);
      }
    })
    .catch((err) => {
      console.log("something went wrong: " + err);
    });
})();
