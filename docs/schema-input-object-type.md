---
id: schema-input-object-type
title: Input Object Type
---

The input object provides the capability to pass in complex data structures and is the input type variant of the object.

```GraphQL
input StarshipInput {
  name: String!
  length: Float!
}
```

In contrast to the object type the input object type cannot have have field arguments. Think of the input object as a way to push structured data to your service. The input object is ideal when pushing data mutations but you can also use it on queries and subscriptions.

```GraphQL
input StarshipInput {
  name: String!
  length: Float!
}

type Mutation {
  createStarship(input: StarshipInput!) : Starship
}
```

Input object in _Hot Chocolate_ can have a fixed .Net type representation but do not have to.

```csharp
public class Starship
{
    public string Name { get; set; }
    public double Length { get; set; }
}

public class StarshipInputType
  : InputObjectType<Starship>
{
    protected override void Configure(IInputObjectTypeDescriptor<Starship> descriptor)
    {
        descriptor.Field(t => t.Name).Type<NonNullType<StringType>>();
    }
}
```

If we do not have specified a .Net type the query engine will deserialize these input types to `Dictionary<string, object>`.

When retrieving the argument through the resolver context you are able to request an input type as a compatible .Net type. This means that you are able to convert this input on the fly.

```csharp
public class StarshipName
{
    public string Name { get; set; }
}

public Task<object> StarshipResolver(IResolverContext context)
{
    StarshipName starship = context.Argument<StarshipName>("input");
}
```

> Note, that this kind of conversion is done in the resolvers pipeline instead of in the query pipeline.

Compatible .Net types are types to which we are able to map the properties. The .Net type is allowed to have more or less fields then the input type specifies. Moreover, the .Net Type is allowed to have properties that cannot be matched.