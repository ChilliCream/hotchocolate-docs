---
id: schema-object-type
title: Object Type
---

The object type is the most prominent output type in GraphQL and represents a kind of object you can fetch from your schema. The GraphQL schema representation of an objec looks like the following:

```GraphQL
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

An object in GraphQL consists of a collection of fields. Object field in GraphQL can have arguments, so you could compare it to methods in _C#_. Each field has a distinct type. All field types have to be output types (scalars, enums, objects, unions or interfaces). The arguments of a field on the other hand have to be input types scalars, enums and input objects).

With _Hot Chocolate_ you can define and object by using the GraphQL SDL or by using C#. Each field of an object will get a resolver assigned that knows how to fetch the data for that field.

A single GraphQL object might be the composition of data that comes from several data sources.

If we take the following object for instance:

```GraphQL
type Query {
  sayHello: String!
}
```

We could define this like the following:

```csharp
SchemaBuilder.New()
  .AddDocumentFromString(@"
      type Query {
        sayHello: String!
      }")
  .AddResolver(context => "Hello!")
  .Create();
```

With C# we could define it like the following:

```csharp
public class Query
{
    public string SayHello() => "Hello!";
}

SchemaBuilder.New()
  .AddQuery<Query>()
  .Create();
```

GraphQL has a concept of nun-null types. Basically any type can be a non-nullable type, in the SDL we decorate non-nullable types with the `Bang` token `!`. In order to describe this in C# you can use attributes or the more powerful schema types.

This is how it would look like with our attributes:

```csharp
public class Query
{
    [GraphQLNonNull]
    public string SayHello() => "Hello!";
}

SchemaBuilder.New()
  .AddQuery<Query>()
  .Create();
```

With schema types the same thing would look like the following:

```csharp
public class Query
{
    public string SayHello() => "Hello!";
}

public class QueryType
    : ObjectType<Query>
{
    protected override Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(t => t.SayHello()).Type<NonNullType<StringType>>();
    }
}

SchemaBuilder.New()
  .AddQuery<QueryType>()
  .Create();
```

Schema types will also allow me to add fields that are not on our current model.
Lets say we have the following C# model:

```csharp
public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

And we want to expose the following object to your schema users:

```GraphQL
type Person {
  id: Int!
  name: String!
  friends: [Person]
}
```

Then we could do something like this:

```csharp
public class PersonType
    : ObjectType<Person>
{
    protected override Configure(IObjectTypeDescriptor<Person> descriptor)
    {
        descriptor.Field(t => t.Name).Type<NonNullType<StringType>>();
        descriptor.Field("friends")
            .Type<ListType<NonNullType<StringType>>>()
            .Resolver(context =>
                context.Service<IPersonRepository>().GetFriends(
                    context.Parent<Person>().Id));
    }
}
```

So, lets have a look at the above example, first we have our name field there, since we need to declare it non-nullable.
But we do not have the `id` field there. _Hot Chocolate_ will always try to infer the usage of the provided type if it is not overriden by the user. You always can opt out of this behaviour and tell _Hot Chocolate_ that you do want to declare everything explicitly. In this case of value types _Hot Chocolate_ can infer the non-nullability correctly and you do not have to specify anything extra.

The second thing that is important in this example os that we can introduce fields that are not on our model and that might even come from a completly different data source. In these cases we have to provide explicit resolvers since we can not infer the resolver the C# type.

> We are planing to support C# 8 and with that we will be able to infer non-nullability from reference types aswell.

## `ObjectType<T>`

The first approach is by using the generic object type class which lets you specify an entity type that shall represent your schema type in .net. The object type descriptor will then try to automatically infer the GraphQL schema type from your .net type.

```csharp
public class Query
{
  public string GetHello() => "World";
}

public class QueryType
  : ObjectType<Query>
{
}
```

```graphql
type Query {
  hello: String
}
```

In order to specify your intend more explicitly you can opt to use the `IObjectTypeDescriptor<Query>` that is accessible by overriding the configure method of the `QueryType`.

```csharp
public class Query
{
  public string GetHello() => "World";
}

public class QueryType
  : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> desc)
    {
        desc.Field(t => t.GetHello()).Type<NonNullType<StringType>>();
    }
}
```

```graphql
type Query {
  hello: String!
}
```

## Object Type Descriptors

The following table shows the object type descriptor options:

| Name                                                                | Description                                                                                    |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `Name(string name)`                                                 | Defines the name of the object type.                                                           |
| `Description(string description)`                                   | Defines the description of the object type that will be accessible through the introspection.  |
| `Interface\<T\>()`                                                  | Specifies an interface type that is implemented by this object type.                           |
| `IsOfType(IsOfType isOfType)`                                       | Defines a function that specifies if a specific resolver type is of the specified object type. |
| `BindFields(BindingBehavior bindingBehavior)`                       | Specifies the field binding behaviour.                                                         |
| `Field\<TValue\>(Expression\<Func\<T, TValue\>\> propertyOrMethod)` | Specifies field configuration of a method or property declared in T.                           |
| `Field(string name)`                                                | Specifies a field that does not exist in T.                                                    |

### Name

The object type descriptor will by default resolve the name of the schema type from the provided type argument. If the type is annotated with the GraphQLNameAttribute than the name attribute will take precedence over the type name. The explicitly specified name will take precedence over both.

Example name from type:

```csharp
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{

}
```

```graphql
type Bar {
  foo: String
}
```

Example name from attribute:

```csharp
[GraphQLName("Foo")]
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{

}
```

```graphql
type Foo {
  foo: String
}
```

Example explicit name:

```csharp
[GraphQLName("Foo")]
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Name("Foo123");
    }
}
```

```graphql
type Foo123 {
  foo: String
}
```

### Description

The description of a type will provide an additional text that describes a type to the schema introspection. This is useful with tools like GraphiQL. GraphQL descriptions are defined using the Markdown syntax (as specified by [CommonMark](http://commonmark.org)).

```csharp
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Description("Lorem ipsum dolor sit amet, consectetur adipiscing elit...");
    }
}
```

```graphql
"""
Lorem ipsum dolor sit amet, consectetur adipiscing elit...
"""
type Bar {
  foo: String
}
```

### IsOfType

The object type descriptor will by default use an instance of approach to figure out if a resolver result is of a certain object type. In some cases when you either have no explicit type binding or you use a .net net type in multiple schema types it is necessary to specify a IsOfType delegate that determines the type of a resolver result.

```csharp
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.IsOfType((context, result) => result is string s && s == "bar");
    }
}
```

### BindFields

The object type descriptor will by default scan the provided entity type for additional fields. In some cases you might want to specify all the fields explicitly in order to have a more predictable schema. You might not want that a property or method that you add to your types automatically shows up in your schema. In those cases you can change the field binding behaviour to explicit.

```csharp
public class Bar
{
  public string Foo1 { get; set; }
  public string Foo2 { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.BindFields(BindingBehaviour.Explicit);
        desc.Field(t => t.Foo1);
    }
}
```

```graphql
type Bar {
  foo1: String
}
```

### Field

There are two ways to define fields. First you can specify a field configuration by pointing to a property or method that is declared in your .net type.

```csharp
public class Bar
{
  public string Xyz { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Field(t => t.Xyz).Name("foo");
    }
}
```

```graphql
type Bar {
  foo: String
}
```

Second, you can define fields that do not have any representation in your .net type.

```csharp
public class Bar
{
  public string Xyz { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Field("foo").Resolver(() => "hello world");
    }
}
```

```graphql
type Bar {
  xyz: String
  foo: String
}
```

The field descriptor options are described in more detail [here](schema-object-type-field.md).

## ObjectType

The second approach to describe object types is with the non-generic object type. The non-generic type does not necessarily have a fixed .net type binding. This means that you have more flexibility in defining your schema type and how the data flows through the query engine.

```csharp
public class BarType
  : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor desc)
    {
        desc.Field("foo").Resolver(() => "hello world");
    }
}
```

```graphql
type Bar {
  foo: String
}
```

Compared to the generic descriptor interface you are loosing the generic field descriptor that is able to bind a field to a .net property or method.
