const ENIVROMENT_VARIABLES = {};

const { PORT, NODE_ENV, SECRET_KEY, CORS_ORIGIN } = process.env;

ENIVROMENT_VARIABLES.SECRET_KEY = SECRET_KEY || "veri $ecret K#y";
ENIVROMENT_VARIABLES.PORT = PORT || 3000;
ENIVROMENT_VARIABLES.NODE_ENV = NODE_ENV || "development";
ENIVROMENT_VARIABLES.CORS_ORIGIN = CORS_ORIGIN || "http://localhost:3000";

module.exports = ENIVROMENT_VARIABLES;
