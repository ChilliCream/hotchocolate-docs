---
id: introduction
title: Introduction
---

Hot Chocolate is a .net GraphQL server platform that can help you build a GraphQL layer over your existing and new infrastructure.

## What is GraphQL?

GraphQL is a query language for APIs that gives the clients the power to ask for exactly the data what they need. GraphQL was initialy developed by Facebook and released to the public in 2015.

If you are completely new to GraphQL you can also head over to [GraphQL.org](https://graphql.org) in order to learn more about it.

### Schema

Everything in GraphQL starts with a schema. The schema basically defines how you can interact with your server. GraphQL provides a nice SDL in which you can define your schema. Hot Chocolate will allow you to define your GraphQL schema-first by using the GraphQL SDL, code-first with with schema types ind c# or by using pocos.

A simple hello world schema in GraphQL could look like the following:

```graphql
type Query {
  hello: String!
}
```

A more complex schema could look

## Query
