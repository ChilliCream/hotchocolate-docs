---
id: schema-first
title: Schema-first
---

GraphQL has an easy and beatiful syntax to describe schemas. Hot Chocolate supports native GraphQL schemas and lets you bind resolvers or types to the.

Lets walk you through some examples in order to show the various approaches to define a schema.

First let us create our playground project to get started:

```bash
mkdir graphql-demo
cd graphql-demo
dotnet new console  
dotnet add package hotchocolate -v 1.0.0-preview-0012
dotnet restore
```

Now let us define a simple hello world schema:

```graphql
type Query {
    hello: String
}
```

So, in order to get started lets make this schema executable by binding resolvers to it:

```csharp
var schema = Schema.Create(
    @"
    type Query {
        hello: String
    }
    ",
    c => c.BindResolver(() => "world").To("Query", "hello"));
```

If you have larger schemas it may be not feasale for you to define resolvers for all of your fields. 
So, we added the ability to bind poco types to the schema.

```csharp
var schema = Schema.Create(
    @"
    type Query {
        hello: String
    }
    ",
    c => c.BindType<Query>());
```

```csharp
public class Query
{
    public string GetHello() => "world";
}
```

Sometimes you have business obejcts that alread exist and that do not exactly match your schema.
In those cases you are able to create a new class that contains the resolvers for your class and that lets you inject your business object into this resolver type.

So, in our example the query time that was defined in the above exampe represents out business object that might already existed before we defined our schema.

We now would just need to define our resolver type.

```csharp
public class QueryResolvers
{
    public string GetHello(Query query) => query.GetHello();
}
```

Our schema would now be declared like the following:

```csharp
var schema = Schema.Create(
    @"
    type Query {
        hello: String
    }
    ",
    c => c.BindResolver<QueryResolvers>().To<Query>());
```

You can also mix and match resolvers:

```csharp
var schema = Schema.Create(
    @"
    type Query {
        hello: String
        foo: Foo
    }

    type Foo {
        bar: String
    }
    ",
    c =>
    {
        c.BindResolver<QueryResolvers>().To<Query>();
        c.BindResolver(() => "hello foo").To("Query", "foo");
        c.BindResolver(ctx => ctx.Parent<string>()).To("Foo", "bar");
    });
```