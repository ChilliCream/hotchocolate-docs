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

1. Schema-first approach

   Use the GraphQL syntax to define your schema and bind simple methods or whole types to your GraphQL types.

2. Code-first approach

   Use C# to define your schema in a strong typed way.
