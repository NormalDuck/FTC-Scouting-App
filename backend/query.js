import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.ftcscout.org/graphql",
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        eventByCode(code: "USWAHALT", season: 2023) {
          matches {
            matchNum
            teams {
              alliance
              teamNumber
            }
          }
        }
      }
    `,
  })
  .then((result) => console.log(JSON.stringify(result)));
