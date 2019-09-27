---
id: code-first
title: Code-first
---

The code-first schema approach lets you built your GraphQL schema with .NET types and gives you all the goodness of strong types. Moreover, there is no need to switch to the GraphQL syntax in order to specify your schema, you can do everything in your favourite .NET language.

OK, let us get started and walk you through some examples in order to show the various approaches to define a schema.

First we will look at how you can write plain .NET objects that can be used to infer GraphQL schema types.

Define a new plain C# class called Query:

```csharp
public class Query
{
    public string Hello() => "world";
}
```

Now let us create a new schema that uses this type and infers from it the GraphQL query type.

```csharp
var schema = SchemaBuilder.New()
  .AddQueryType<Query>()
  .Create();
```

We now have registered an object type with our new schema that is based on our Query class. The schema would look like the following:

```graphql
type Query {
  hello: String
}
```

We didn't even have to write resolvers due to the fact that the schema inferred those from the hello function. Our hello function is basically our resolver.

If you want to opt into more GraphQL features that cannot be inferred from a .NET type, you can either use our schema types or use attributes.

So, if we wanted the return type of our `hello` field to be a non-null string than we could configure the schema like this:

```csharp
var schema = SchemaBuilder.New()
    .AddQueryType<Query>(d => d
        .Field(f => f.Hello())
        .Type<NonNullType<StringType>>())
    .Create();
```

Since these fluent chains could get very long you can also opt to declare a new class `QueryType` that extends `ObjectType<Query>` and add this to your schema.

```csharp
public class QueryType : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(f => f.Hello()).Type<NonNullType<StringType>>();
    }
}

var schema = SchemaBuilder.New()
    .AddQueryType<QueryType>();
    .Create();
```

Furthermore, you can add fields that are not based on your .NET type `Query`.

```csharp
public class QueryType : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(f => f.Hello()).Type<NonNullType<StringType>>();
        descriptor.Field("foo").Type<StringType>().Resolver(() => "bar");
    }
}
```

Our new resulting schema would now look like the following:

```graphql
type Query {
  hello: String!
  foo: String
}
```

The `foo` field would use the specified delegate to resolve the field value. The fluent API offers you the same feature set as the GraphQL schema syntax.

Next, let us have a look at resolver arguments. GraphQL fields let you define arguments, so they are more like methods in C# than properties.

If we add a parameter to our `Hello` method, the `SchemaBuilder` will translate that into a GraphQL field argument.

```csharp
public class Query
{
    public string Hello(string name) => $"Greetings {name}";
}
```

```graphql
type Query {
  hello(name: String): String
}
```

In order to get access to the resolver context in your resolver, you can just add the `IResolverContext` as a method parameter and the query engine will automatically inject the context:

```csharp
public class Query
{
    public string Hello(IResolverContext context, string name) =>
        $"Greetings {name} {context.Service<FooService>().GetBar()}";
}
```

This was just a quick introduction - There is a lot more that you can do with code-first! In order to learn more, head over to the following documentation articles:

- If you want to read more about the `SchemaBuilder` head over [here](schema.md).

- If you are interested about resolvers in more detail [this](resolvers.md) might be the right place for you.

You are all fired up and want to get started with a little tutorial walking you through an end-to-end example with `MongoDB` as your database? [Follow me](tutorial-mongo.md)!

OK, OK, you already have an idea on what to do and you are just looking for way to setup this whole thing with ASP.NET Core or ASP.NET Framework? [This](aspnet.md) is where you find more on that.

If you want to set _Hot Chocolate_ up with AWS Lambda or Azure Functions head over to our slack channel, we do not yet have documentation on that but an example project showing how to. We are constantly adding to our documentation and will include documentation on that soon.
