/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");
const fs = require("fs");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  // The Handlebars template will use the parameter values to update the page with the chosen color
  return reply.view("/src/pages/index.hbs", params);
});

// Endpoint to get the total number of cat screams
fastify.get("/getNumber", (req, res) => {
  fs.readFile("number.txt", "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Error reading the total number of cat screams");
    }

    // Parse the current total number of total screams
    let total_screams = parseInt(data);

    if (isNaN(total_screams)) {
      // Something got goofy
      return res
        .status(500)
        .send(
          "Error reading the total number of cat screams - data file is corrupt with NaN"
        );
    }

    res.send(data);
  });
});

// Endpoint to add screams to the total number of cat screams
fastify.post("/setNumber", (req, res) => {
  const { number } = req.body;

  if (isNaN(number)) {
    return res
      .status(500)
      .send(
        "Error reading data for additional number of cat screams - not a number"
      );
  }

  fs.readFile("number.txt", "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Error reading data for additional number of cat screams");
    }

    // Parse the current total number of total screams
    let total_screams = parseInt(data);

    if (isNaN(total_screams)) {
      // Something got goofy, reset the total screams
      total_screams = 0;
    }

    // Add the posted screams to the total number of screams
    total_screams += number;

    // Convert back to string to store in our simple text file
    const numberAsString = total_screams.toString();

    fs.writeFile("number.txt", numberAsString, (err) => {
      if (err) {
        return res
          .status(500)
          .send("Error adding screams to the total number of cat screams");
      }
      res.send("Total number of cat screams updated");
    });
  });
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
