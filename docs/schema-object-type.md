---
id: schema-object-type
title: Object Type
---

The object type is the most prominent output type in GraphQL and represents a kind of object you can fetch from your schema. The GraphQL schema representation of an object looks like the following:

```GraphQL
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

An object in GraphQL consists of a collection of fields. Object fields in GraphQL can have arguments, so you could compare it to methods in _C#_. Each field has a distinct type. All field types have to be output types (scalars, enums, objects, unions or interfaces). The arguments of a field on the other hand have to be input types scalars, enums and input objects).

With _Hot Chocolate_ you can define an object by using the GraphQL SDL syntax or by using C#. Each field of an object will get a resolver assigned that knows how to fetch the data for that field.

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

## Resolvers

Schema types will also allow us to add fields that are not on our current model.
Let\`s say we have the following C# model:

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

Let\`s have a look at the above example, first we have our name field there, since we need to declare it non-nullable.
But we do not have the `id` field there. _Hot Chocolate_ will always try to infer the usage of the provided type if it is not overridden by the user. You always can opt out of this behaviour and tell _Hot Chocolate_ that you do want to declare everything explicitly. In this case of value types _Hot Chocolate_ can infer the non-nullability correctly and you do not have to specify anything extra.

The second thing that is important in this example is that we can introduce fields that are not on our model and that might even come from a completely different data source. In these cases, we have to provide explicit resolvers since we cannot infer the resolver the C# type.

> We are planning to support C# 8 and with that we will be able to infer non-nullability from reference types as well.

We also can use schema types if we have no model at all that represents that object. In these cases, we have to write explicit resolvers for each of the fields:

```csharp
public class QueryType
    : ObjectType
{
    protected override Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Field("sayHello")
            .Type<NonNullType<StringType>>()
            .Resolver("Hello!");
    }
}
```

You can also turn that around and write your resolver logic in your C# objects since we support method argument injection. You could also create your `Person` type in c# like the following:

```csharp
public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }

    public Person GetFriends([Service]IPersonRepository repository) =>
        repository.GetFriends(Id);
}

public class PersonType
    : ObjectType<Person>
{
    protected override Configure(IObjectTypeDescriptor<Person> descriptor)
    {
        descriptor.Field(t => t.Name).Type<NonNullType<StringType>>();
        descriptor.Field(t => t.GetFriends(default))
            .Type<ListType<NonNullType<StringType>>>();
    }
}
```

Since in many cases we do not want to put resolver code in our models we can also split our type and still move the resolver code to a C# class:

```csharp
public class Person
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class PersonResolvers
{
    public Person GetFriends(Person person, [Service]IPersonRepository repository) =>
        repository.GetFriends(person.Id);
}

public class PersonType
    : ObjectType<Person>
{
    protected override Configure(IObjectTypeDescriptor<Person> descriptor)
    {
        descriptor.Field(t => t.Name).Type<NonNullType<StringType>>();
        descriptor.Field<PersonResolvers>(t => t.GetFriends(default, default))
            .Type<ListType<NonNullType<StringType>>>();
    }
}
```

> More about resolvers can be read [here](resolvers.md).

## Extension

The GraphQL SDL supports extending obejcts types, this means that you can add fields to an existing object.

```GraphQL
extend type Person {
    address: String!
}
```

Extending types is useful for schema stitching but also when you want to add just something to an existing type. You might have some fields that are optional and that you do not always want to add to your service, or you might just want to separate your types by data source. The capability to extend types gives you flexibility.

_Hot Chocolate_ supports extending types code-first and schema-first. Let\`s have a look at how we can extend our person object with code-first:

```csharp
public class PersonTypeExtension
    : ObjectTypeExtension
{
    protected override Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Name("Person");
        descriptor.Field("address")
            .Type<NonNullType<StringType>>()
            .Resolver(/"Resolver Logic"/);
    }
}
```

```csharp
SchemaBuilder.New()
  .AddType<PersonType>()
  .AddType<PersonTypeExtension>()
  .Create();
```

Type extensions bascially work like usual types and are also added like usual types. This makes it easy to reuse code and to learn using the API.
