---
id: version-0.5.2-custom-scalar-types
title: Custom Scalar Types.
original_id: custom-scalar-types
---

The Hot Chocolate query engine has the following built-in scalar types:

| Type     | Description                                                 |
| -------- | ----------------------------------------------------------- |
| Int      | Signed 32‐bit numeric non‐fractional value                  |
| Float    | Double‐precision fractional values as specified by IEEE 754 |
| String   | UTF‐8 character sequences                                   |
| Boolean  | Boolean type representing true or false                     |
| ID       | unique identifier                                           |
| DateTime | ISO‐8601 date time                                          |
| Date     | ISO‐8601 date                                               |
| Time     | ISO‐8601 time                                               |
| Url      | Url                                                         |

In some cases you may need to specify your own scalar types in order to fulfill your sepcific needs. 

Moreover, Hot Chocolate let`s you swap out built-in scalar types and add your own implementation of any scalar type when the need for this should araise.

In order to implement a new scalar type extend the type:  `ScalarType`.

The following example shows you how a the GraphQL string type could have been implemented.

```csharp
public sealed class StringType
    : ScalarType
{
    public StringType()
        : base("String")
    {
    }

    // define which .NET type represents your type
    public override Type NativeType { get; } = typeof(string);

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
}
```
