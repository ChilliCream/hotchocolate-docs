---
id: code-first
title: Code-first
---

The code first schema approach lets us built our GraphQL schema with .Net types and gives us all the goodness of strong types. Moreover, there is no need to switch to the GraphQL syntax in order to specify our schema. All can be done in our favourite .Net language.

Lets walk through some examples in order to explore the various approaches to define a schema.

First let us create our playground project to get started:

```bash
mkdir graphql-demo
cd graphql-demo
dotnet new console
dotnet add package hotchocolate
dotnet restore
```

OK, now lets look at how we can write plain .Net objects (POCOs) that can be used to infer GraphQL schema types.

Define a new POCO c# class called Query:

```csharp
public class Query
{
    public string Hello() => "world";
}
```

After that let us create a new schema that uses this type and infers from it the GraphQL query type.

```csharp
ISchema schema = SchemaBuilder.New()
    .AddQueryType<Query>()
    .Create()
```

We now have registered our type with our new schema. The type is registered as our query root type and the schema would look like the following if we had expressed it in the GraphQL SDL:

```graphql
type Query {
  hello: String
}
```

The GraphQL spec defines three root types (Query, Mutation and Subscription). The root types represent our entry points to interact with the query engine. Although GraphQL is a query language we cannot just freely express what we want to query on our backend system. The root types basically define how we can interact with the GraphQL server. Each root type has a specific responsiblity and conveys certain guarantees to the user of a GraphQL API.

The `Query`-type is the most prominent root type and allows us to ask for data. _Operations_ on the `Query`-type are side-effect-free and the server has the freedom to execute the fields in-parallel.

The `Mutation`-type provides us with the semantic to change the data of our backend system, the root fields of a `Mutation`-type are **not** executed in parallel since each execution of a root-field is considered to change the data and thus **not** side-effect-free. Fields, above the root field level are again pure reads and will executed in-parallel.

The `Subscription`-type provides us with realtime-











We didn't even have to write resolvers due to the fact that the schema inferred those from the hello function. out hello function is basically our resolver.

But there are some catches here. At the moment we can only infer scalar types like string, int etc..
Furthermore, we can only infer non-nullability from value types. Reference types like System.String will always be inferred as nullable type since all reference types in .net are nullable.

Fear not, because there is a simple solution to this. If you want to redefine or add more fields to an existing type you can always opt-in to our fluent API to declare your intention.

So, if we wanted the return type of hello to be a non-null string than we could tell our schema that like this.

```csharp
var schema = Schema.Create(c => c.RegisterType(new ObjectType<Query>(
    d => d.Field(f => f.Hello()).Type<NonNullType<StringType>>())));
```

Since this fluent chains could get very long you could also opt to declare a new class `ObjectType` that extends `ObjectType<Query>`.

```csharp
public class QueryType : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(f => f.Hello()).Type<NonNullType<StringType>>();
    }
}
```

Also, you can add fields that are not based on your .net poco types.

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

The foo field would use the specified delegate to resolve the field value. The fluent API offers you the same feature set as the GraphQL schema syntax.

Next we should look at resolver arguments. GraphQL fields let you define arguments. So, if we adjust our hello method to include a new argument name of type string we would infer from the GraphQL field arguments.

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

Also, you can add the [resolver context](https://github.com/ChilliCream/hotchocolate/blob/master/src/Core/Resolvers/IResolverContext.cs) or any resolver context property as an argument to your method.

```csharp
public class Query
{
    public string Hello(Schema schema, string name) => $"Greetings {name} {schema.Query.Name}";
}
```

```csharp
public class Query
{
    public string Hello(IResolverContext context, string name) => $"Greetings {name} {context.Service<FooService>().GetBar()}";
}
```

This gives you the flexibility to tab into the data that is available in the query engine execution context and use it to make your resolvers more dynamic.
