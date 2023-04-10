/**
 * this is the testing file for Cypress, DO NOT TOUCH
 */

import rgbHex from "rgb-hex";

const DEFAULTLEN = 6;
const MAXTH = 8;

describe("testing the student's HTML page", () => {
  /**
   * need tests for:
   * CSS
   * - the <th>s should have classes and should be tested for their background-color
   * - the div should:
   *   - display: flex;
   *   - flex-direction: row;
   * HTML
   * - there should be a table
   *  - it should have three columns
   * - there should be three inputs & one button in a div
   *  - these should have ids
   * JS
   * - the button#submit should:
   *  - append a new tr to the tbody of the table with the data inputted
   *  - it should do NOTHING if one of the fields is empty
   */

  beforeEach("Reading the HTML file", () => {
    // stubbing the response
    cy.intercept("GET", "*/api/students/*", {
      fixture: "students.json",
    }).as("payload");

    // connecting to the file
    cy.visit("./index.html");

    // awaiting for load, sometimes it's finicky
    cy.wait("@payload");

    // setting a fetch error handler
    cy.on("uncaught:exception", (e) => {
      if (e.message.includes("NetworkError")) {
        // page made call to API but failed, ignoring
        return false;
      }
      if (e.message.includes("fetch")) {
        // page made call to API but failed, ignoring
        return false;
      }
    });
  });

  context("testing the HTML", () => {
    context("testing the functionality of lab 4", () => {
      it("testing the table headers", () => {
        // they should be in a certain order
        const ordering = ["name", "id", "gpa"];

        // they should have headers
        cy.get("table#chart > thead > tr > th").should(
          "have.length.gte",
          ordering.length
        );

        cy.get("table#chart > thead > tr > th").then((ths) => {
          for (let i = 0; i < ordering.length; ++i) {
            expect(ths[i].innerText.toLowerCase()).to.eq(ordering[i]);
          }
        });
      });

      context("asserting the IDs of tags", () => {
        /// mass testing
        ["input#name", "input#gpa", "input#id", "button#submit"].map((sel) => {
          return it(`${sel} should exist and be within div.row`, () => {
            cy.get("div.row").find(sel).should("exist");
          });
        });

        it("table#chart should exist", () => {
          cy.get("table#chart").should("exist");
        });
      });

      context("testing the attributes of the input tags", () => {
        return ["name", "gpa", "id"].map((id) => {
          return it(`input#${id} should have placeholder "${id}"`, () => {
            cy.get("div.row")
              .find(`input#${id}`)
              .should("have.attr", "placeholder")
              .then((text) => {
                expect(text.toLowerCase()).to.eq(id);
              });
          });
        });
      });
    });

    context("testing the functionality of lab 6", () => {
      context("testing the API buttons", () => {
        /// mass testing
        ["button#to_csv", "button#to_xml", "button#to_json"].map((sel) => {
          return it(`${sel} should exist and be within div.row`, () => {
            cy.get("div.row").find(sel).should("exist");
          });
        });
      });
    });

    context("testing the functionality of lab 7", () => {
      context("testing the new inputs", () => {
        /// mass testing
        [
          "input#assignment1",
          "input#assignment2",
          "input#labs",
          "input#midterm",
          "input#final",
        ].map((sel) => {
          return it(`${sel} should exist and be within div.row`, () => {
            cy.get("div.row").find(sel).should("exist");
          });
        });
      });

      it("testing the table headers", () => {
        // they should be in a certain order
        const ordering = [
          "name",
          "id",
          "gpa",
          "Assignment 1",
          "Assignment 2",
          "Labs",
          "Midterm",
          "Final",
        ];

        // they should have headers
        cy.get("table#chart > thead > tr > th").should(
          "have.length",
          ordering.length
        );

        cy.get("table#chart > thead > tr > th").then((ths) => {
          for (let i = 0; i < ordering.length; ++i) {
            expect(ths[i].innerText.toLowerCase()).to.eq(
              ordering[i].toLowerCase()
            );
          }
        });
      });
    });
  });

  context("testing the CSS", () => {
    context("testing the CSS from Lab 4", () => {
      context("testing table headers", () => {
        [
          { class: "green", column: "name", color: "00ff00" },
          { class: "blue", column: "gpa", color: "0000ff" },
          { class: "red", column: "id", color: "ff0000" },
        ].map((header) => {
          return it(`th.${header.column} should have background-color: #${header.color}`, () => {
            cy.get(`table#chart > thead > tr > th.${header.class}`)
              .should("have.text", header.column)
              .invoke("css", "background-color")
              .then((bgcolor) => {
                expect(rgbHex(bgcolor)).to.eq(header.color);
              });
          });
        });
      });

      it("testing `div.row`", () => {
        cy.get("div.row")
          .should("have.css", "display", "flex")
          .and("have.css", "flex-direction", "row");
      });
    });
  });

  context("testing the JS", () => {
    let add_row_works_check = false;

    context("Lab 8: testing the functionality of the new table", () => {
      /**
       * test that keys are unique
       * test that the clear_table function removes all rows from a table
       */
      it("button#grades_add (add_row()) should add a tr to the table", () => {
        // adding a row
        cy.get("button#grades_add").click();

        // asserting that there are now two rows (there should be one by default)
        cy.get("table#grades > tbody > tr").should("have.length", 2);

        add_row_works_check = true;
      });

      it("button#grades_add (add_row()) shouldn't accidentally truncate data", () => {
        // setting a mark
        const text = "marker";

        // entering some data
        cy.get("table#grades > tbody > tr:eq(0)")
          .invoke("attr", "key")
          // getting the unique key attr
          .then(($key) => {
            // typing into that tr's name input
            cy.get(`tr[key="${$key}"]`).find("input:eq(0)").type(text);

            // adding a row
            cy.get("button#grades_add").click();

            // that same tr should retain its input
            cy.get(`tr[key="${$key}"]`)
              .find("input:eq(0)")
              .should("have.value", text);
          });
      });

      it("remove_row() should remove the row (only one row)", () => {
        // finding and clicking the button
        cy.get("table#grades > tbody > tr:eq(0)")
          .find("button") // there should only be one button
          .click(); // this should've activated remove_row()

        // there shouldn't be any more rows
        cy.get("table#grades > tbody > tr").should("have.length", 0);
      });

      it("remove_row() should remove the row (multiple rows)", () => {
        if (!add_row_works_check) {
          throw new Error(
            "previous add_row() test did not pass, aborting dependant test"
          );
        }

        // adding 3 more rows
        for (let i = 0; i < 3; ++i) {
          cy.get("button#grades_add").click();
        }

        // asserting that there are 4 rows now
        cy.get("table#grades > tbody > tr").should("have.length", 4);

        // finding and clicking the button
        cy.get("table#grades > tbody > tr:eq(1)")
          .invoke("attr", "key")
          .then(($key) => {
            // removing the tr with that key
            cy.get(`tr[key="${$key}"]`).find("button").click();

            // the tr with that key should no longer exist
            cy.get(`tr[key="${$key}"]`).should("not.exist");
          });
      });

      it("the key attributes of each tr should be unique", () => {
        if (!add_row_works_check) {
          throw new Error(
            "previous add_row() test did not pass, aborting dependant test"
          );
        }

        // adding 3 more rows
        for (let i = 0; i < 3; ++i) {
          cy.get("button#grades_add").click();
        }

        // assert that the key of each tr should be unique
        cy.get("table#grades > tbody > tr:eq(1)").each(($el) => {
          cy.wrap($el)
            .invoke("attr", "key")
            .then(($key) => {
              // the tr with that key should no longer exist
              cy.get(`tr[key="${$key}"]`).should("have.length", 1);
            });
        });
      });

      it("the button#grades_clear (clear_table()) should remove all rows from a table", () => {
        if (!add_row_works_check) {
          throw new Error(
            "previous add_row() test did not pass, aborting dependant test"
          );
        }

        // adding 3 more rows
        for (let i = 0; i < 3; ++i) {
          cy.get("button#grades_add").click();
        }

        // invoking the clear_table() function
        cy.get("button#grades_clear").click();

        // asserting that the table has no rows
        cy.get("table#grades > tbody > tr").should("have.length", 0);
      });
    });

    context(
      "Lab 4 & 7: testing functionality of adding students for table#chart",
      () => {
        const mapping = [
          "input#name",
          "input#id",
          "input#gpa",
          "input#assignment1",
          "input#assignment2",
          "input#labs",
          "input#midterm",
          "input#final",
        ];
        const data = ["fort nite", "100000000", "4.3", "1", "2", "3", "4", "5"];

        it("function should append data properly in the correct spots", () => {
          // setting the values
          for (let i = 0; i < mapping.length; ++i) {
            cy.get(mapping[i]).type(data[i]);
          }

          // clicking the button
          cy.get("button#submit").click();

          // inspecting the table
          cy.get("#chart > tbody > tr")
            .should("have.length", DEFAULTLEN + 1) // TRs: default & inputted
            .last("tr")
            .find("td")
            .should("have.length", MAXTH)
            // the TDs should have data in specific indices
            .then(($tds) => {
              for (let i = 0; i < mapping.length; ++i) {
                cy.wrap($tds[i].innerText).should("be.eq", data[i]);
              }
            });
        });

        context("function should do nothing if any field is empty", () => {
          mapping.map((el) => {
            return it(`should do nothing if ${el} is empty`, () => {
              for (const index in mapping) {
                // skipping this index
                if (el === mapping[index]) continue;

                // typing into the inputs
                cy.get(mapping[index]).type(data[index]);
              }

              // the button shouldn't do anything
              cy.get("button#submit")
                .click()
                .get("table#chart > tbody")
                .children()
                .should("have.length", DEFAULTLEN);
            });
          });
        });
      }
    );
  });
});
