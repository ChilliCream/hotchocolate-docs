---
id: aspnet
title: ASP.net
---

_Hot Chocolate_ comes with a middleware for ASP.net core and ASP.net classic so you do not have to spent time to figure out how to host a schema endpoint and how to server queries via HTTP or websocket.

## Getting Started with ASP.net core

The fastest way to create a _Hot Chocolate_ GraphQL server for _ASP.net core is to use our server template.

```bash
dotnet new -i HotChocolate.Templates.Server
dotnet new graphql-server
```

The server is already configured for subscriptions over websockets and with a GraphiQL endpoint so you can explore your api without needing to install an additional tool.

With the server template you just focus on creating your schema and implementing your business logic.

### Setting up a ASP.net core server without the template

If you want to setup the server on your in order to fine-tune it and to get to know all the levers and buttons we can guide you through the configuration.

The ASP.net core server is comprised of the following three packages:

- HotChocolate.AspNetCore
  This package contains the query middleware for GET and POST GraphQL query and mutation requests. Moreover, this package includes a WebSocket middleware for subscription request.

- HotChocolate.AspNetCore.GraphiQL
  This package contains GraphiQL confgured to work with WebScoket subscription protocol `graphql-ws`.

- HotChocolate.AspNetCore.Authorization
  This package adds authorization capabilities to your schema.


### Query Middleware

The query middleware enables your GraphQL server to handle GraphQL query requests and handle GraphQL subscriptions.

The middleware can handle POST, GET and WebSocket requests.

```csharp
app.UseGraphQL("/graphql");
```


```csharp
app.UseGraphQL(new GraphQLMiddlewareOptions
{
    Path = "/graphql",
    OnCreateRequest = (context, request, properties) =>
    {
        properties["foo"] = "bar";
        return Task.CompletedTask;
    }
});
```

```csharp

```

```csharp

```


### Subscriptions

For subscriptions we have opted to implement the `graphql-ws` protocol that works over websockets. The protocol was specified by [Apollo](https://www.apollographql.com) and is specified [here](https://github.com/apollographql/subscriptions-transport-ws).

