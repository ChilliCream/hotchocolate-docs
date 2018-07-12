---
id: introduction
title: Introduction
---

Setup a GraphQL Schema in minutes and bring your current service into the future. GraphQL gives you the flexibility to advance your service APIs at a much faster pace by stiching together your current backend services, filling in new functionality and even mocking parts that you are still working on. You can do all of this without abandoning your current infrastructure.

```csharp
var schema = Schema.Create(
    @"
    type Query { robot: Robot }
    type Robot { name: String manufacturer: String }
    ",
    c => c.BindResolver(() => new { Name = "iRobot", Manufacturer = "iRobot" })
        .To("Query", "robot"));
Console.WriteLine(schema.Execute("{ robot { name } }"));
```

## Features

1. Schema-first approach

    Use the GraphQL syntax to define your schema and bind simple methods or whole types to your GraphQL types.

1. Code-first approach

    Use C# to define your schema in a strong typed way.

1. Custom Scalar Types

    Define your own scalar types to make your schemas even richer.

1. Support for data loader

    We have baked-in support for data loaders which makes batching and caching for faster query requests a breeze.  

1. dotnet CLI Templates

    In order to get you even faster started we are providing templates for the dotnet CLI which lets you setup a .net GraphQL server in les than 10 seconds.