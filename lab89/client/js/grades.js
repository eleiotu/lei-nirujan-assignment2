/**
 * A grade object
 * @typedef Grade
 * @property {String} name the name of the node
 * @property {Number} weight the weight of the node
 * @property {Number} grade the grade achieved
 */

/**
 * this function finds each `<input key>` element and grabs its value along with its placeholder
 * text and forms an array of JSON objects to be sent to the server
 *
 * this function also makes a call to `post_to_server()`
 */
function scrape_grades() {
    /** @type {Grade[]} */
    const grades = [];
  
    // getting a reference to the tbody
    const tbody = document
      .getElementById("grades")
      .getElementsByTagName("tbody")[0];
  
    // iterating through the <tr>s of the table
    tbody.querySelectorAll("tr[key]").forEach((row) => {
      /**
       * making a new Grade object
       * @type {Grade}
       */
      const obj = {};
  
      // iterating over each input and adding a KV pair to the obj var
      row.querySelectorAll("input").forEach((input) => {
        obj[input.getAttribute("placeholder")] = input.value;
      });
  
      // adding the obj to the main grades var
      grades.push(obj);
    });
  
    /// making a post request to the server
  
    // turning the JSON object into string format to be sent to the server
    const payload = JSON.stringify({ grades: grades });
  
    // setting the url of the server
    const url = "http://localhost:8080/lab6-1.0/api/format/grade";
  
    // setting the headers
    const headers = [
      ["Content-Type", "application/json"], // setting the sending content-type
      ["Accept", "application/json"], // setting the receiving content-type
    ];
  
    // you need to modify your own post_to_server function
    post_to_server(
      payload, // transforming grades into string like format
      headers, // the headers
      url
    );
  }
  function add_row(id) {
    // getting a reference to the tbody
    const tbody = document.getElementById(id).querySelector('tbody');
  
    // getting the last value of the key attribute
    let last_key = 0;
    const rows = tbody.querySelectorAll('tr[key]');
    if (rows.length > 0) {
      last_key = parseInt(rows[rows.length - 1].getAttribute('key'));
    }
  
    // creating a new key value
    const new_key = last_key + 1;
  
    // creating the new HTML element
    const new_row = `
      <tr key="${new_key}">
        <td><input type="text" placeholder="name"></td>
        <td><input type="number" placeholder="weight"></td>
        <td><input type="number" placeholder="grade"></td>
        <td><button onclick="remove_row(${new_key})">Remove</button></td>
      </tr>
    `;
  
    // adding the new element to the tbody
    tbody.insertAdjacentHTML('beforeend', new_row);
  }
  
  function remove_row(value) {
    // getting a reference to the element with the corresponding key
    const element = document.querySelector(`tr[key="${value}"]`);
  
    // removing the element if it exists
    if (element) {
      element.parentNode.removeChild(element);
    }
  }
  
  function clear_table(id) {
    // getting a reference to the tbody
    const tbody = document.getElementById(id).querySelector('tbody');
  
    // removing all children elements of the tbody
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }
  