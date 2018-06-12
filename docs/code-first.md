---
id: code-first
title: Code-first
---

The code first schema approach lets you built your GraphQL schema with .net types.

First let us create our playground project to get started:

```bash
mkdir graphql-demo
cd graphql-demo
dotnet new console  
dotnet add package hotchocolate -v 1.0.0-preview-0012
dotnet restore
```

Lets first look at how you can write plain .net objects that than can be used as GraphQL schema types.

First let us define a new .net object that represents our mandatory query type.

```csharp
public class Query
{
    public string Hello() => "world";
}
```

Now let us create a new schema that uses this type and infers from it our schema.

```csharp
Schema.Create(c => c.RegisterType<ObjectType<Query>>());
```

We now have registered an object type with our new schema that is based on our Query class. The schema would look like this

```graphql
type Query {
    hello: String
}
```

