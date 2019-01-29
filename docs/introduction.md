---
id: introduction
title: Introduction
---

Hot Chocolate is a .net GraphQL server platform that can help you build a GraphQL layer over your existing and new infrastructure.

## What is GraphQL?

GraphQL is a query language for APIs that gives the clients the power to ask for exactly the data what they need. GraphQL was initialy developed by Facebook and released to the public in 2015.

If you are completely new to GraphQL you can also head over to [GraphQL.org](https://graphql.org) in order to learn about more about it.

### Transport

GraphQL itself is transport agnostic and can be used even in-process to fetch data from a database or file system. However, in the wild you mostly will consume GraphQL schemas through a HTTP endpoint. Hot Chocolate hooks GraphQL into ASP.net and ASP.net core by adding a middleware.





