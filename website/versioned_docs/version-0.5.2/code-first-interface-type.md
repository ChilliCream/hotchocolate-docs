---
id: version-0.5.2-code-first-interface-type
title: Interface Type
original_id: code-first-interface-type
---

An Interface is an abstract type that includes a certain set of fields that a type must include to implement the interface. Currently, a schema interface type has no .NET representation. This means that we currently do not infer the type properties from a .NET type.

In order to specify an interface type you can inherit from `InterfaceType` and overwrite the `Configure` method.

```csharp
public class CharacterType
    : InterfaceType
{
    protected override void Configure(IInterfaceTypeDescriptor descriptor)
    {
        descriptor.Name("Character");

        descriptor.Field("id")
            .Type<NonNullType<StringType>>();

        descriptor.Field("name")
            .Type<StringType>();
    }
}
```

```graphql
interface Character {
  id: String!
  name: String
}
```

An object type can specify that it does implement a certain interface like the following:

```csharp
public class DroidType
    : ObjectType
{
    protected override void Configure(IInterfaceTypeDescriptor descriptor)
    {
        descriptor.Interface<CharacterType>();

        descriptor.Field("id")
            .Type<NonNullType<StringType>>()
            .Resolver(() => "id");

        descriptor.Field("name")
            .Type<StringType>()
            .Resolver(() => "name");
    }
}
```
