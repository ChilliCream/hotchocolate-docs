---
id: schema
title: Schema
---

Every GraphQL service defines a set of types which completely describe the set of possible data you can query on that service. Incoming queries are validated and executed against that schema.

## Declaring a Schema

In _Hot Chocolate_ a schema is created by using the `SchemaBuilder`. With the schema builder we can define what types our schema will have and how data is resolved.

There are basically two ways to define a schema, with code or with the GraphQL SDL. We can mix and match code and SDL and are not bound to stick just to one specific way to define our schema.

In schema-first we could create a simple hello world schema like the following:

```csharp
ISchema schema = SchemaBuilder.New()
    .AddDocumentFromString("type Query { hello: String }")
    .AddResolver("Query", "hello", "World")
    .Create();
```

In code-first we can again choose two approaches and again we can mix and match them. The first approach is to define the GraphQL types via POCOS and infer the GraphQL schema types with conventions.

With conventions we could create our above schema like the following:

```csharp
public class Query
{
    public string Hello() => "World";
}

ISchema schema = SchemaBuilder.New()
    .AddQueryType<Query>()
    .Create();
```

_Hot Chocolate_ provides a collection of conventions and attributes to express a schema with POCOs, but if they are not what we want we can override them to make those our own. We can even declare our own set of attributes.

> If you want to read more about conventions head over [here](conventions.md).

The second and way to express a schema in code-first is to declare schema types. Schema types allow us to exactly express how the schema should:

```csharp
public class QueryType
    : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Field("hello").Resolver("World").
    }
}

ISchema schema = SchemaBuilder.New()
    .AddQueryType<QueryType>()
    .Create();
```

We could also use our generic variant in order to have the best of both worlds:

```csharp
public class QueryType
    : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field("foo").Resolver("bar").
    }
}

public class Query
{
    public string Hello() => "World";
}

ISchema schema = SchemaBuilder.New()
    .AddQueryType<QueryType>()
    .Create();
```

The above example would yield the following schema:

```graphql
type Query {
  hello: String
  foo: String
}
```

_Hot Chocolate_ will always try to figure the provided schema out, that means that we will infer the fields from the provided types. Also we can extend those types by declaring further fields. As with everything we can opt out of this behaviour.

> In order to see more about what capabilities our ObjectType has head over [here](code-first-object-type.md).

As I mentioned earlier we can mix and match our approach and also extend schema-first fiels with code-first:

```csharp
public class QueryTypeExtension
    : ObjectTypeExtension
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Field("foo").Resolver("bar").
    }
}

ISchema schema = SchemaBuilder.New()
    .AddDocumentFromString("type Query { hello: String }")
    .AddResolver("Query", "hello", "World")
    .AddType<QueryTypeExtension>()
    .Create();
```

The above example would again yield the following schema:

```graphql
type Query {
  hello: String
  foo: String
}
```

This is very useful with schema stitching, since this allows us to consume remote schmeas and extend them with code-first.

## Overwriting Schema Properties

Like with any type in _Hot Chocolate_ we can inherit from schema in order to provide further logic and details. If we for instance wanted to provide a schema description or decorate the schema with directives we could do that like the following:

```csharp
public class MySchema 
    : Schema
{
    protected override void Configure(ISchemaDescriptor descriptor)
    {
        descriptor.Description("This is my schema description that can be accessed by introspection");
    }
}

ISchema schema = SchemaBuilder.New()
    .AddDocumentFromString("type Query { hello: String }")
    .AddResolver("Query", "hello", "World")
    .SetSchema<MySchema>()
    .Create();
```

## Make Executable

The schema object that we create with the `SchemaBuilder` describes the set of possible data we can query. In order to actually query data in that schema we have to make it executable.

```csharp
IQueryExecutor executor = schema.MakeExecutable();
```

We can create multiple executors on a single schema and define different execution rules on the executor.

In most cases we will not need to now about this fact since most of the time the schema is hosted in ASP.Net and the middleware will take care of making it executable. But it is worth knowing in case we want to write a unit test or host a query executor in a different environment than ASP.Net.

More about the query executor can be read [here](query-executor.md).
