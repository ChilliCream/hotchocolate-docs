---
id: code-first-introduction
title: Introduction
---

GraphQL basically specifies six type kinds excluding ListType and NonNullType:

- [Object Type](https://graphql.org/learn/schema/#object-types-and-fields)
- [Interface Type](https://graphql.org/learn/schema/#interfaces)
- [Union Type](https://graphql.org/learn/schema/#union-types)
- [Input Object Type](https://graphql.org/learn/schema/#input-types)
- [Enum Type](https://graphql.org/learn/schema/#enumeration-types)
- [Scalar Type](https://graphql.org/learn/schema/#scalar-types)

When describing your GraphQL API code-first you are starting with your existing code which is just common .net code.

In order to give your types the right context in a GraphQL schema or more precisly to infer the GraphQL schema types from your .net APIs we are wrapping them into schema types that correlate to the corresponding schema type kind.

Lets say we have a simpel .net type `Query` that has one method `GetFoo()` which returns a `System.String`:

```csharp
public class Query
{
    public string GetFoo() => "Some Result";
}
```

We cann add this type to our schema by registering it like the following:

```csharp
var schema = Schema.Create(c =>
{
  c.RegisterType<ObjectType<Query>>();
})
```

By wrapping `Query` as `ObjectType<Query>` we essentially tell the schema setup that `Query` is an object type and the schema setup will try to infer the rest of this type automatically.

So, without much effort we now have a GraphQL Schema that looks like the following:

```graphql
type Query {
  foo: String
}
```

In many cases we can even infer the schema type. So you can just register your types and the schema will try to figure out what the specified type shall represent in your GraphQL schema.

```csharp
var schema = Schema.Create(c =>
{
  c.RegisterType<Query>();
})
```

Here is a table that depicts how we will try to infer the schema types from your .net types:

| .net Type        | GraphQL Type |
| ------------- | ----------- |
| non-abstract class | Object Type |
| Enum | Enum Type |
| System.String | String |
| System.Char | String |
| System.Int16 | Short! |
| System.Int32 | Int! |
| System.Int64 | Long! |
| System.Single | Float! |
| System.Double | Float! |
| System.Decimal | Decimal! |
| System.DateTime | DateTime! |

We even will automatically inspect your properties for further object types. This means that we are not only flattly mapping you properties but also all the referenced types.

Let`s have a look at a small example:

```csharp
public class Query
{
    public Person GetPerson() => new Person { Name = "Foo" };
}

public class Person
{
    public string Name { get; set; }

    public Person GetNewFriend(string name) => new Person { Name = "Foo" };
}

var schema = Schema.Create(c =>
{
  c.RegisterType<Query>();
})
```

The above schema would look like the following in the GraphQL syntax:

```graphql
type Query {
  person: Person
}

type Person {
    name: String
    newFriend(name: String): Person
}
```

We are constantly working on this mechanism in order to support more cases. The most significant drawback at the moment is that we cannot detect if a reference type is meant as non-null-type or as nullable-type.

In order to describe your intention more detailed or even describe types that do not exist in c# you can opt to use the schema types.

There are basically to ways to describe your types explicitly. For smaller declarations we can pass into the constructor of a schema type a configuration delegate that specifies the schema type properties.

```csharp
var schema = Schema.Create(c =>
{
  c.RegisterType(new ObjectType<Foo>(d => d.Name("SuperFoo"));
})
```

Since, we would end up with a very long chain of method calls if you had to specify more than just the name, you can also inherit from ObjectType<T> and override the Configure method.

It is important to note that you can mix and match plain .net types, schema types and types expressed in the GraphQL syntax. Moreover, even with the schema types in place you only have to fill in the gaps. So, if we only wanted the `Name` property of the `Person` type to be a non-null-type we would have to make the following change to our code.

```csharp
public class Query
{
    public Person GetPerson() => new Person { Name = "Foo" };
}

public class Person
{
    public string Name { get; set; }

    public Person GetNewFriend(string name) => new Person { Name = "Foo" };
}

public class PersonType : ObjectType<Person>
{
    protected override void Configure(IObjectDescriptor<Person> desc)
    {
        desc.Field(t => t.Name).Type<NonNullType<StringType>>();
    }
}

var schema = Schema.Create(c =>
{
  c.RegisterType<Query>();
  c.RegisterType<PersonType>();
})
```

```graphql
type Query {
  person: Person
}

type Person {
    name: String!
    newFriend(name: String): Person
}
```

Moreover, we can add additional fields that our .net type does not contain:

```csharp
public class PersonType : ObjectType<Person>
{
    protected override void Configure(IObjectDescriptor<Person> desc)
    {
        desc.Field(t => t.Name).Type<NonNullType<StringType>>();
        desc.Field("newField").Resolver(() => "hello"));
    }
}
```

```graphql
type Query {
  person: Person
}

type Person {
    name: String!
    newFriend(name: String): Person
    newField: String
}
```

For more help on the configuration of the specific types checkout the specific type descriptor help pages:

- [Object Type Descriptor](code-first-object-type.md)
- [Interface Type Descriptor](code-first-interface-type.md)
- [Union Type Descriptor](code-first-union-type.md)
- [Enum Type Descriptor](code-first-enum-type.md)
- [Input Object Type Descriptor](code-first-input-object-type.md)
