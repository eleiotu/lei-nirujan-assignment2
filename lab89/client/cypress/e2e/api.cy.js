/**
 * this is the testing file for Cypress, DO NOT TOUCH
 */

describe("testing the API portion of the website", () => {
  /**
   * need to test how the student's website handles API information
   * - stubbing any request to http://localhost with students.json
   *
   * tests
   * - if there is no error, then there should be 6 <tr>s in the table
   * - existing functionality should still work too
   *   - adding a <tr> should still work (there will be 7)
   */

  beforeEach("setting HTTP request failure exception", () => {
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

  beforeEach("prepping the page", () => {
    // stubbing the response
    cy.intercept("GET", "*/api/students/*", {
      fixture: "students.json",
    }).as("payload");

    // stubbing the response
    cy.intercept("POST", "*/api/format/*").as("request");

    // loading the page
    cy.visit("../../index.html");

    // awaiting HTTP request
    cy.wait("@payload");
  });

  context("testing the functionality of lab 5", () => {
    it("the table should render the data from the API", () => {
      /// HTML page requested data, processing it

      // examing the table to test for records
      cy.get("table#chart > tbody > tr")
        // the student should have removed the default <tr>
        .should("have.length", 6);
    });
  });

  context("testing the functionality of lab 6", () => {
    context("testing each button that POSTs data to the API", () => {
      ["button#to_csv", "button#to_xml", "button#to_json"].map((sel) => {
        const endpoint = sel.split("_")[1];
        const type = {
          csv: "text/csv",
          json: "application/json",
          xml: "application/xml",
        };

        return it(`${sel} should make a POST to /api/format/${endpoint}`, () => {
          cy.get(sel)
            .click()
            .wait("@request")
            .then((req) => {
              // shorthand
              const request = req.request;
              const headers = request.headers;

              // asserting
              expect(request.body.length).not.eq(
                0,
                "the body shouldn't be empty"
              );
              expect(request.method).to.eq("POST", "the method should be POST");
              expect(headers["accept"]).to.contain(
                type[endpoint],
                "the request should accept the proper MIME type"
              );
              expect(headers["content-type"]).to.contain(
                "text/html",
                "the request should contain the proper content-type"
              );
            });
        });
      });
    });
  });

  context("testing the functionality of lab 8", () => {
    it("button#grades_submit should make a POST to /api/format/grades", () => {
      // adding some data
      let data = {
        name: "fortnite",
        weight: "20",
        grade: "10",
      };

      // filling in the fields
      cy.get("table#grades > tbody > tr").within(($root) => {
        // typing in the name
        cy.wrap($root).get("input:eq(0)").type(data.name);
        // typing in the weight
        cy.wrap($root).get("input:eq(1)").type(data.weight);
        // typing in the grade
        cy.wrap($root).get("input:eq(2)").type(data.grade);
      });

      // making a POST request
      cy.get("button#grades_submit")
        .click()
        .wait("@request")
        .then((req) => {
          // shorthand
          const request = req.request;
          const headers = request.headers;

          // testing the method & headers
          expect(request.method).to.eq("POST", "the method should be POST");
          expect(headers["accept"]).to.contain(
            "application/json",
            "the request should accept the proper MIME type"
          );
          expect(headers["content-type"]).to.contain(
            "application/json",
            "the request should contain the proper content-type"
          );

          // asserting that the body isn't empty
          expect(request.body.length).not.eq(0, "the body shouldn't be empty");

          // asserting the body's contents
          const context = request.body.grades[0];
          expect(context).to.not.be.undefined;
          expect(context.name).to.be.eq(data.name, `the payload's name should be ${data.name}`);
          expect(context.weight).to.be.eq(data.weight, `the payload's name should be ${data.weight}`);
          expect(context.grade).to.be.eq(data.grade, `the payload's name should be ${data.grade}`);
        });
    });
  });
});
