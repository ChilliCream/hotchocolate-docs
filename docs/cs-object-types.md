---
id: cs-object-types
title: Object Types
---

## Auto Configuration

Lets say you have a query type

```csharp
public class HumanType
    : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
    }
}
```

|                   |                                      |
|------------------ | ------------------------------------ |
| `Name(string name)` | Defines the name of the object type. |
| `Description(string description)` | Defines the description of the object type that will be accessible through through introspection. |
| `Interface<T>()` | Defines the name of the object type. |
| `IsOfType(IsOfType isOfType)` | Defines the name of the object type. |
| `BindFields(BindingBehavior bindingBehavior)` | Defines the name of the object type. |
| `Field(string name)` | Defines the name of the object type. |
| `Field<TValue>(Expression<Func<T, TValue>> property)` | Defines the name of the object type. |

`IObjectTypeDescriptor<T>`

```csharp
public class Human
    : ICharacter
{
    public string Id { get; set; }

    public string Name { get; set; }

    public IReadOnlyList<string> Friends { get; set; }
}

public class HumanType
    : ObjectType<Human>
{
    protected override void Configure(IObjectTypeDescriptor<Human> descriptor)
    {
        descriptor.Interface<CharacterType>();

        descriptor.Field(t => t.Friends)
            .Type<ListType<CharacterType>>()
            .Resolver(c => CharacterType.GetCharacter(c));

        descriptor.Field(t => t.Height)
            .Argument("unit", a => a.Type<EnumType<Unit>>())
            .Resolver(c => CharacterType.GetHeight(c));
    }
}
```


|                   |                                      |
|------------------ | ------------------------------------ |
| `Name(string name)` | Defines the name of the object type. |
| `Description(string description)` | Defines the description of the object type that will be accessible through through introspection. |
| `Interface<T>()` | Defines the name of the object type. |
| `IsOfType(IsOfType isOfType)` | Defines the name of the object type. |
| `BindFields(BindingBehavior bindingBehavior)` | Defines the name of the object type. |
| `Field(string name)` | Defines the name of the object type. |
| `Field<TValue>(Expression<Func<T, TValue>> property)` | Defines the name of the object type. |