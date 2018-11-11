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

