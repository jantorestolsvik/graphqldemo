var express = require('express');
var graphqlHTTP = require('express-graphql');
var { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');
var fetch = require('node-fetch')

var FilmType = new GraphQLObjectType({
  name: 'Film',
  fields: () => ({
    title: {
      type: GraphQLString,
      description: 'The title of this film.',
    }
  })
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'root',
    fields: () => ({
      allFilms: {
        type: new GraphQLList(FilmType),
        resolve: () => {
          return fetch("http://swapi.co/api/films/")
          .then(res => res.json())
          .then(res => {
            console.log(res)
            return res.results;
          })
        }
      }
    })
  })
})

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
