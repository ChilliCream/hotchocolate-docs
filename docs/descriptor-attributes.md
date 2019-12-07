---
id: descriptor-attributes
title: Descriptor Attributes
---

_Hot Chocolate_ allows to define a schema in various ways. When defining schemas with pure .NET types and custom attributes we need a way to access the advanced features like custom field middleware that we have at our disposal with schema types.

This is where descriptor attributes come in. Descriptor attributes allow us to package descriptor configurations into an attribute that can be used to decorate our .NET types. Within a descriptor attribute we can access the associated descriptor.

## Built-In Attributes

We have prepared the following set of built-in descriptor attributes.

- UsePagingAttribute
- UseFilteringAttribute
- UseSortingAttribute
- AuthorizeAttribute

## Custom Descriptor Attributes

It is super simple to create custom descriptor attributes and package complex functionality in simple to use attributes.

```csharp
public class SomeMiddlewareAttribute
    : ObjectFieldDescriptorAttribute
{
    public override void OnConfigure(IObjectFieldDescriptor descriptor)
    {
        descriptor.Use(next => context => ...);
    }
}
```

We have one descriptor base class for each descriptor type.

- EnumTypeDescriptorAttribute
- EnumValueDescriptorAttribute
- InputObjectTypeDescriptorAttribute
- InputFieldDescriptorAttribute
- InterfaceTypeDescriptorAttribute
- InterfaceFieldDescriptorAttribute
- ObjectTypeDescriptorAttribute
- ObjectFieldDescriptorAttribute
- UnionTypeDescriptorAttribute
- ArgumentDescriptorAttribute

While this is enough in most cases we sometimes want to intercept multiple descriptor types. Like maybe we want to configure with one attribute types on interface fields as well as on object fields. In these cases we can use the `DescriptorAttribute`.

```csharp
[AttributeUsage(
    AttributeTargets.Property | AttributeTargets.Method,
    Inherited = true,
    AllowMultiple = true)]
public sealed class MyCustomAttribute : DescriptorAttribute
{
    protected override void TryConfigure(IDescriptor descriptor)
    {
        switch(descriptor)
        {
            case IInterfaceFieldDescriptor interfaceField:
                // do something ...
                break;

            case IObjectFieldDescriptor interfaceField:
                // do something ...
                break;
        }
    }
}
```

## Usage

It is simple to use these attributes. Just annotating a type or a property with an attribute will add the packaged functionality. The types can be used in conjunction with schema types or without.
