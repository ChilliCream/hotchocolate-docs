---
id: version-0.7.0-type-conversion
title: Type Conversion
original_id: type-conversion
---

For what do we need the type conversion API on Hot Chocolate?

Let us have a look at a simple example to answer this question and also to show how this is solved with Hot Chocolate.

Assume we have a mongo database entity representation in c# that looks like the following:

```csharp
public class Message
{
    public ObjectId Id { get; set; }
    public DateTimeOffset Created { get; set; }
    public string Text { get; set; }
}
```

We want the `Id` property to be of the `IdType` in the GraphQL schema. The Hot Chocolate query execution engine does not know how `ObjectId` is serialized or deserialized. 

Moreover, `IdType` uses `System.String` as .NET representation of its values.

In order to be able to use `ObjectId` through out our code, we have to explain to the query execution engine how to serialize `ObjectId` to `System.String` and also how to deserialize it.

This can be done in simple cases with two lines of code:

```csharp
TypeConversion.Default.Register<string, ObjectId>(from => ObjectId.Parse(from));
TypeConversion.Default.Register<ObjectId, string>(from => from.ToString());
```

You can also implement `ITypeConverter` if you want to write classes instead of delegates,

Furthermore, you can register your own `ITypeConversion` with the dependency injection to opt-out of the default converters.

Further, you can register a specific type conversion instance with the dependency injection to provide specific converters to a specific schema instance.
