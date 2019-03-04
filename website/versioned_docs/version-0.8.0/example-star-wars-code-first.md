---
id: version-0.8.0-example-star-wars-code-first
title: Star Wars
original_id: example-star-wars-code-first
---

We have created a dotnet CLI template for the [GraphQL.org](https://graphql.org) Star Wars example. So, you can follow the example and get an impression how you could implement such a schema with our API. In order to get it just run the following dotnet CLI command.

```bash
dotnet new -i HotChocolate.Templates.StarWars
```

After you have installed this template you can just fire up the following command in order to get the example up and running:

```bash
mkdir starwars
cd starwars
dotnet new starwars
dotnet run --project StarWars/StarWars.csproj -c release
```

The service should start-up and run on the port 5000. In order to test your server and send queries head over to our playground endpoint: http://127.0.0.1:5000/playground

The template source code is located [here](https://github.com/ChilliCream/hotchocolate-templates/tree/master/StarWars/content).
