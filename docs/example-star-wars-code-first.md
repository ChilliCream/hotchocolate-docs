---
id: example-star-wars-code-first
title: Star Wars
---

We have created a dotnet CLI template for the [GraphQL.org](https://graphql.org) Star Wars example. So, you can follow the example and get an impression how you could implement such a schema with hot chocolate. In order to get it just run the following dotnet CLI command.

```bash
dotnet new -i HotChocolate.Demo.StarWars.CodeFirst
```

After you have installed this template you can just fire up the follwing command in order to get the example up and running:

```bash
dotnet new startwars-codefirst
dotnet run --project src/StarWars/StarWars.csproj
```

The service should start-up and run on the port 5000. Get GraphiQL and fire up queries against the schema.