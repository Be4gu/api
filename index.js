require("dotenv").config(); //Variables de entorno
require("./connection_mongo"); //Ejecuta el archivo

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const express = require("express");
const cors = require("cors");
const app = express(); //crea la app de express

const notFound = require("./middleware/notFound.js");
const handleErrors = require("./middleware/handleErrors.js");

const usersRouter = require("./controllers/users");
const clubsRouter = require("./controllers/clubs");
const languageRouter = require("./controllers/languages");
const roleRouter = require("./controllers/roles");
const countryRouter = require("./controllers/countries");
const loginRouter = require("./controllers/login");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

Sentry.init({
  dsn: "https://e6660beb502c47f48871d29225729e91@o1255013.ingest.sentry.io/6433035",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (request, response) => {
  response.send("<h1>Hellow Word<h1>");
});

app.use("/api/users", usersRouter);
app.use("/api/clubs", clubsRouter);
app.use("/api/languages", languageRouter);
app.use("/api/roles", roleRouter);
app.use("/api/countries", countryRouter);
app.use("/api/login", loginRouter);

app.use(notFound);
app.use(Sentry.Handlers.errorHandler());
app.use(handleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
