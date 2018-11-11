---
id: aspnet
title: ASP.net
---

_Hot Chocolate_ comes with a middleware for ASP.net core and ASP.net classic.

## ASP.net core

The fastest way to create a _Hot Chocolate_ GraphQL server for _ASP.net core" is to use our server template.

Install Server Template:

```bash
dotnet new -i HotChocolate.Templates.Server
```

Create Server with Template:

```bash
dotnet new graphql-server
```

The server is already configured for subscriptions over websockets and with a GraphiQL endpoint. With the server template you just focus on creating your schema and implementing your business logic.

### Query Middleware

The query middleware enables your GraphQL server to handle GraphQL query requests and handle GraphQL subscriptions via websockets. 


