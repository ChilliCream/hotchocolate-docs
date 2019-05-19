---
id: schema-descriptions
title: Schema Descriptions
---

As with any API, documentation is an important of describing the data and queries available to a consumer. _Hot Chocolate_ offers multiple ways to document your GraphQL application.

## Schema-first
In schema-first scenarios the schema parser supports the inclusion of description strings. When a schema string includes such descriptions, they will be available through your typically introspection queries.
<!--DOCUSAURUS_CODE_TABS-->
<!-- C# -->
```
Schema.Create(@"
""""""
A droid in the Star Wars universe.
""""""
type Droid {
    ""The Id of the droid.""
    id: String

    ""The name of the droid.""
    name: String
}

""""""
An episode in the Star Wars series.
""""""
enum Episode {
    ""Star Wars Episode IV: A New Hope""
    NEWHOPE

    ""Star Wars Episode V: Empire Strikes Back""
    EMPIRE

    ""Star Wars Episode VI: Return of the Jedi""
    JEDI
}

type Query {
    """"""
    Get a droid by Id.
    """"""
    droid(
        ""The Id of the droid.""
        id: String
    ): Droid
}",
c =>
{
    c.BindResolver(() => null).To("Query", "droid");
    c.BindResolver(() => "1234").To("Droid", "id");
    c.BindResolver(() => "R2D2").To("Droid", "name");
});
```
<!-- GraphQL -->
```
"""
A droid in the Star Wars universe.
"""
type Droid {
    "The Id of the droid."
    id: String

    "The name of the droid."
    name: String
}

"""
An episode in the Star Wars series.
"""
enum Episode {
    "Star Wars Episode IV: A New Hope"
    NEWHOPE

    "Star Wars Episode V: Empire Strikes Back"
    EMPIRE

    "Star Wars Episode VI: Return of the Jedi"
    JEDI
}

type Query {
    """
    Get a particular droid by Id.
    """
    droid(
        "The Id of the droid."
        id: String
    ): Droid
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Code-First
In code-first schemas there are multiple ways to describe the types and queries available in your API. The documentation options listed below are listed in order of specificity, meaning that options listed at the top will be overridden by options listed after it.

### XML Documentation
Out of the box, _Hot Chocolate_ has the ability to automatically generate API documentation from your existing [XML documentation comments](https://docs.microsoft.com/en-us/dotnet/csharp/codedoc). For example, given the following C# code with XML documentation strings you will have the following GraphQL schema.
<!--DOCUSAURUS_CODE_TABS-->
<!--C#-->
```
/// <summary>
/// A droid in the Star Wars universe.
/// </summary>
public class Droid
{
    /// <summary>
    /// The Id of the droid.
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// The name of the droid.
    /// </summary>
    public string Name { get; set; }
}

/// <summary>
/// An episode in the Star Wars series.
/// </summary>
public enum Episode
{
    /// <summary>
    /// Star Wars Episode IV: A New Hope
    /// </summary>
    NEWHOPE,
    /// <summary>
    /// Star Wars Episode V: Empire Strikes Back
    /// </summary>
    EMPIRE,
    /// <summary>
    /// Star Wars Episode VI: Return of the Jedi
    /// </summary>
    JEDI
}

public class Query {
    /// <summary>
    /// Get a particular droid by Id.
    /// </summary>
    /// <param name="id">The Id of the droid.</param>
    /// <returns>The droid.</returns>
    public Droid GetDroid(string id)
    {
        /* Removed for brevity */
    }
}
```
<!--GraphQL-->
```
"""
A droid in the Star Wars universe.
"""
type Droid {
    "The Id of the droid."
    id: String

    "The name of the droid."
    name: String
}

"""
An episode in the Star Wars series.
"""
enum Episode {
    "Star Wars Episode IV: A New Hope"
    NEWHOPE

    "Star Wars Episode V: Empire Strikes Back"
    EMPIRE

    "Star Wars Episode VI: Return of the Jedi"
    JEDI
}

type Query {
    """
    Get a particular droid by Id.
    """
    droid(
        "The Id of the droid."
        id: String
    ): Droid
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

Once you've written your documentation, you will need to enable documentation file generation for your `.csproj`. One of the easiest ways to accomplish this is to add the `<GenerateDocumentationFile>` element to a `<PropertyGroup>` element in your project file. When your project is built this will automatically generate an XML documentation file for the specificed framework and runtime.
```
<PropertyGroup>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>$(NoWarn);1591</NoWarn>
</PropertyGroup>
```

> The `<NoWarn>` element is optional. Including this element prevents the compiler for emitting warnings for any classes, properties, or methods that are missing documentation strings.

Should you decide you do not want to use the XML documentation, you have the ability to turn it off by setting the `UseXmlDocumentation` property on the schema's `ISchemaOptions`.
```
Schema.Create(c =>
{
    c.Options.UseXmlDocumentation = false;
});
```

### Attributes
_Hot Chocolate_ also provides a `GraphQLDescriptionAttribute` that can be used to provide descriptions for classes, properties, methods, and method parameters. For example, given the following C# code you will have the following GraphQL schema.

<!--DOCUSAURUS_CODE_TABS-->
<!--C#-->
```
[GraphQLDescription("I am a droid in the Star Wars universe.")]
public class Droid
{
    [GraphQLDescription("The Id of the droid.")]
    public string Id { get; set; }

    [GraphQLDescription("The name of the droid.")]
    public string Name { get; set; }
}

public class Query
{
    [GraphQLDescription("Get a particular droid by Id.")]
    public Droid GetDroid(
        [GraphQLDescription("The Id of the droid.")] string id)
    {
        /* Removed for brevity */
    }
}
```
<!--GraphQL-->
```
"""
A droid in the Star Wars universe.
"""
type Droid {
    "The Id of the droid."
    id: String

    "The name of the droid."
    name: String
}

type Query {
    """
    Get a particular droid by Id.
    """
    droid(
        "The Id of the droid."
        id: String
    ): Droid
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> If the description provided to the `GraphQLDescriptionAttribute` is `null` or made up of only white space _Hot Chocolate_ will use XML documentation strings as a fallback (assuming you have the feature enabled).

### Fluent APIs
The `IObjecTypeDescriptor<T>` includes fluent APIs that enable setting descriptions through a declarative syntax. You can easily access these fluent APIs by creating a class that inherits from the `ObjectType<T>` class and overriding the `Configure(IObjectTypeDescriptor<T>)` method. For example, given the following C# code you would have the following GraphQL schema.

<!--DOCUSAURUS_CODE_TABS-->
<!--C#-->
```
public class Droid
{
    public string Id { get; set; }

    public string Name { get; set; }
}

public class DroidType : ObjectType<Droid>
{
    protected override void Configure(IObjectTypeDescriptor<Droid> descriptor)
    {
        descriptor.Description("A droid in the Star Wars Universe");

        descriptor.Field(f => f.Id)
            .Description("The Id of the droid.");

        descriptor.Field(f => f.Name)
            .Description("The name of the droid.");
    }
}
```

<!--GraphQL-->
```
"""
A droid in the Star Wars Universe.
"""
type Droid {
    "The Id of the droid."
    id: String

    "The name of the droid."
    name: String
}
```
<!--END_DOCUSAURUS_CODE_TABS-->


Similar to the previous options, the fluent APIs also provide the ability to generate descriptions for the queries and their arguments.
<!--DOCUSAURUS_CODE_TABS-->
<!--C#-->
```
public class Query
{
    public Droid GetDroid(string id)
    {
        /* Removed for brevity */
    }
}

public class QueryType : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(f => f.GetDroid(default))
            .Type<DroidType>()
            .Description("Search for droids.")
            .Argument(
                "id",
                argDescriptor => argDescriptor
                    .Description("The text to search on.")
            );
    }
}
```

<!--GraphQL-->
```
type Query {
    """
    Search for droids.
    """
    search(
        "The Id of the droid."
        text: String
    ): Droid[]!
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> If the `Description()` methods are used they will **always** override any descriptions provided from the previous options, regardless of being `null` or white space values.