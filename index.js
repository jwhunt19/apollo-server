const { ApolloServer, gql } = require("apollo-server");
const models = require("./models");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    links: [Link!]!
  }  
  
  type Mutation {
    setLink(url: String!, slug: String!): Link
  }

  type Link {
    url: String!
    slug: ID!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    links: () => models.Link.findAll()
  }, 
  
  Mutation: {
    setLink: (_, data) => models.Link.create(data)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
