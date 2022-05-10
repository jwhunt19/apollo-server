const { ApolloServer, gql } = require("apollo-server");
const models = require("./models");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    links: [Link!]!
    link(slug: String): [Link]
  }

  type Mutation {
    setLink(url: String!, slug: String): Link
  }

  type Link {
    url: String!
    slug: ID!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    links: () => models.Link.findAll(),
    link: (_, { slug }) => models.Link.findAll({ where: { slug } })
  },

  Mutation: {
    setLink: async (_, { url, slug }) => {
      async function slugCheck() {
        const result = await resolvers.Query.link(undefined, { slug });
        return result.length > 0
      }

      async function generateSlug() {
        slug = Math.random().toString(24).slice(-6);
        if (await slugCheck()) generateSlug();
      }

      if (!slug) generateSlug();
      else if (await slugCheck()) throw new Error("slug already exists");

      models.Link.create({ url, slug });
    }
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
