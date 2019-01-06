---
id: custom-scalar-types
title: Scalar Type Support
---

The Hot Chocolate query engine by default supports scalar types defined by the GraphQL specification.

## Scalar Types

| Type     | Description                                                 |
| -------- | ----------------------------------------------------------- |
| Int      | Signed 32‐bit numeric non‐fractional value                  |
| Float    | Double‐precision fractional values as specified by IEEE 754 |
| String   | UTF‐8 character sequences                                   |
| Boolean  | Boolean type representing true or false                     |
| ID       | unique identifier                                           |

The query engine also provides support for a few more extended scalar types.

## Extended Scalar Types

| Type     | Description                                                 |
| -------- | ----------------------------------------------------------- |
| Long     | Signed 64-bit numeric non-fractional value                  |
| Decimal  | .NET Floating Point Type                                    |
| Url      | Url                                                         |
| DateTime | ISO‐8601 date time                                          |
| Date     | ISO‐8601 date                                               |
| Uuid     | GUID                                                        |
| Time     | ISO‐8601 time                                               |

To use these types, they must be registered during schema configuration. You can choose to register all extended types at once.

```csharp
var schema = Schema.Create(c =>
{
    // Register all 6 extended scalar types
    c.RegisterExtendedScalarTypes();
});
```

You can also choose to register these types individually.

```csharp
var schema = Schema.Create(c =>
{
    // Register only decimal and long type
    c.RegisterType<DecimalType>();
    c.RegisterType<LongType>();
});
```

In some cases, you may even need to specify your own scalar types in order to fulfill your specific needs. 

In addition; because the above extended scalar types are not registered automatically, you can choose to register your own implementation of an extended scalar type when the need should arise.

## Custom Scalars

In order to implement a new scalar type extend the type:  `ScalarType`.

The following example shows you how a Custom String type could be implemented.

```csharp
public sealed class CustomStringType
    : ScalarType
{
    public CustomStringType()
        : base("CustomString")
    {
    }

    // define which .NET type represents your type
    public override Type ClrType { get; } = typeof(string);

    // define which literals this type can be parsed from.
    public override bool IsInstanceOfType(IValueNode literal)
    {
        if (literal == null)
        {
            throw new ArgumentNullException(nameof(literal));
        }

        return literal is StringValueNode
            || literal is NullValueNode;
    }

    // define how a literal is parsed to the native .NET type.
    public override object ParseLiteral(IValueNode literal)
    {
        if (literal == null)
        {
            throw new ArgumentNullException(nameof(literal));
        }

        if (literal is StringValueNode stringLiteral)
        {
            return stringLiteral.Value;
        }

        if (literal is NullValueNode)
        {
            return null;
        }

        throw new ArgumentException(
            "The string type can only parse string literals.",
            nameof(literal));
    }

    // define how a native type is parsed into a literal,
    public override IValueNode ParseValue(object value)
    {
        if (value == null)
        {
            return new NullValueNode(null);
        }

        if (value is string s)
        {
            return new StringValueNode(null, s, false);
        }

        if (value is char c)
        {
            return new StringValueNode(null, c.ToString(), false);
        }

        throw new ArgumentException(
            "The specified value has to be a string or char in order " +
            "to be parsed by the string type.");
    }

    // define the result serialization. A valid output must be of the following .NET types:
    // System.String, System.Char, System.Int16, System.Int32, System.Int64,
    // System.Float, System.Double, System.Decimal and System.Boolean
    public override object Serialize(object value)
    {
        if (value == null)
        {
            return null;
        }

        if (value is string s)
        {
            return s;
        }

        if(value is char c)
        {
            return c;
        }

        throw new ArgumentException(
            "The specified value cannot be serialized by the StringType.");
    }

    public override bool TryDeserialize(object serialized, out object value)
    {
        if (serialized is null)
        {
            value = null;
            return true;
        }

        if (serialized is string s)
        {
            value = s;
            return true;
        }

        value = null;
        return false;
    }
}
```
