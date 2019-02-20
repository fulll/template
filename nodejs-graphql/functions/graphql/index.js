const { graphql } = require("graphql");
const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require("graphql-tools");
const { readFileSync } = require("fs");

const { parse, stringify } = JSON;

const typeDefs = readFileSync("./functions/graphql/schema.graphql", "utf8");
const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false }
});

addMockFunctionsToSchema({ schema });

async function handler(event) {
  try {
    const { query, variables } = parse(event.body);
    const statusCode = 200;
    const body = await graphql(schema, query, null, null, variables);

    return {
      statusCode,
      body: stringify(body)
    };
  } catch (error) {
    console.error(error.message);
    return { statusCode: 400, body: stringify(error.message) };
  }
}

module.exports = { handler };
