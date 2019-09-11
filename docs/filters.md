---
id: filters
title: Filter Support
---

**What are filters?**

With the _Hot Chocolate_ filters you are able to expose complex filter object through your GraphQL API that translate to native database queries.

The default filter implementation translates filters to expression trees that are applied on `IQueryable`.

## Using Filters

Filters by default work on `IQueryable` but you can also easily customize them to use other interfaces.

_Hot Chocolate_ by default will inspect your .Net model and infer from that the possible filter operations.

The following type would yield the following filter operations:

```csharp
public class Foo 
{
    public string Bar { get; set; }
}
```

```graphql
input FooFilter {
  bar: String
  bar_contains: String
  bar_ends_with: String
  bar_in: [String]
  bar_not: String
  bar_not_contains: String
  bar_not_ends_with: String
  bar_not_in: [String]
  bar_not_starts_with: String
  bar_starts_with: String
  AND: [FooFilter!]
  OR: [FooFilter!]
}
```

**So how can we get started with filters?**

Getting started with filters is very easy and if you do not want to explicitly define filters or customize anything then filters are super easy to use, lets have a look at that.

```csharp
public class QueryType 
    : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(t => t.GetPerson(default))
            .Type<ListType<NonNullType<PersonType>>>()
            .UseFiltering();
    }
}

public class Query 
{
    public IQueryable<Person> GetPersons([Service]IPersonRepository repository)
    {
        repository.GetPersons();
    }
}
```

> ⚠️ **Note**: Be sure to install the `HotChocolate.Types.Filters` NuGet package.

In the above example the person resolver just returns the `IQueryable` representing the data source. The `IQueryable` represents a not executed database query on which we are able to apply filters.

The next thing to note is the `UseFiltering` extension method which adds the filter argument to the field and a middleware that can appy those filters to the `IQueryable`. The execution engine will in the end execute the `IQueryable` and fetch the data.

## Customizing Filters

The filter objects can be customized and you can rename and remove operations from it or define operations explicitly.

Filters are input objects and are defined through a `FilterInputType<T>`. In order to define and customize a filter we have to inherit from `FilterInputType<T>` and configure it like any other type.

```csharp
public class PersonFilterType
    : FilterInputType<Person>
{
    protected override void Configure(
        IFilterInputTypeDescriptor<Foo> descriptor)
    {
        descriptor
            .BindFieldsExplicitly()
            .Filter(t => t.Name)
            .BindOperationsExplicitly()
            .AllowEquals().Name("equals").And()
            .AllowContains().Name("contains").And()
            .AllowIn().Name("in");
    }
}
```

The above type defines explicitly for what fields filter operations are allowed and what filter operations are allowed. Also the filter renames the equals filter to `equals`.

In order to apply this filter type we just have to provide the `UseFiltering` extension method with the filter type as type argument.

```csharp
public class QueryType 
    : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> descriptor)
    {
        descriptor.Field(t => t.GetPerson(default))
            .Type<ListType<NonNullType<PersonType>>>();
            .UseFiltering<PersonFilterType>()
    }
}
```

## Customizing Filter Transformation

With our filter solution you can write your own filter transformation which is fairly easy once you wrapped your head around transfroming graphs with visitors.

We provide a `FilterVisitorBase` which is the base of our `QueryableFilterVisitor` and it is basically just implementing an new visitor that walks the filter graph and translates it into any other query syntax.
