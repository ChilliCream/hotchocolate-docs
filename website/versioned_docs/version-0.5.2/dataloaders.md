---
id: version-0.5.2-dataloaders
title: DataLoaders
original_id: dataloaders
---

## Data Loaders

If you want to read more about _DataLoaders_ in general, you can head over to Facebook's [GitHub repository](https://github.com/facebook/dataloader).

GraphQL is very flexible in the way you can request data. This flexibility also introduces new classes of problems called _n+1_ issues for the GraphQL server developer.

In order to depict the issue that DataLoaders solve in this context, let me introduce a little GraphQL schema:

```graphql
type Query {
  person(id: ID): Person
}

type Person {
  id: ID
  name: String
  friends: [Person]
}
```

The above schema allows to fetch a person by its internal identifier and each person has a list of friends that is represented by a list of persons.

Since GraphQL requests are not fixed requests like REST requests, the developer really defines what data he/she wants. This avoids overfetching data that you do not need and also saves you unecessary roundtrips to the GraphQL backend.

So, a query against the above schema could look like the following:

```graphql
{
  a: person(id: "a") {
    name
  }

  b: person(id: "b") {
    name
  }
}
```

The above request fetches two persons in one go without the need to call the backend twice. The problem for the GraphQL backend is that field resolvers are atomic and do not have any knoledge about the query as a whole. So, a field resolver does not know that it will be called multiple times in parallel to fetch similar or equal data from the same data source.

This basically represents the first case where _DataLoaders_ help us by batching requests against our database or backend service. Currently, we allow _DataLoaders_ per request and globally.

So, let's look at some code in order to understand what they are doing. First, let's have a look at how we would write our field resolver without _DataLoaders_:

```csharp
public async Task<Person> GetPerson(string id, [Service]IPersonRepository repository)
{
    return await repository.GetPersonById(id);
}
```

The above example would result in two calls to the person repository that would than fetch the persons one by one from our data source.

If you think that through you can see that each GraphQL request would cause multiple requests to our data source resulting in slugish performance and uneccessary roundtrips to our data source.

This, means that we reduced the roundtrips from our client to our server with GraphQL but multiplied the roundtrips between the data sources and the service layer.

With _DataLoaders_ we can now centralise our person fetching and reduce the number of round trips to our data source.

First, we have to create a _DataLoader_ that now acts as intermediary between a field resolver and the data source.

```csharp
public class PersonDataLoader : DataLoaderBase<string, Person>
{
    private readonly IPersonRepository _repository;

    public PersonDataLoader(IPersonRepository repository)
      : base(new DataLoaderOptions<string>())
    {
        _repository = repository;
    }

    protected override Task<IReadOnlyList<Result<string>>> Fetch(
        IReadOnlyList<string> keys)
    {
        return _repository.GetPersonBatch(keys);
    }
}
```

The _DataLoader_ is now injected by the execution engine as a field resolver argument.

_DataLoaders_ have to be injected at field resolver argument level and **NOT** as constructor arguments since the lifetime of a _DataLoader_ is in many cases shorter than the class containing the field resolvers.

```csharp
public Task<Person> GetPerson(string id, [DataLoader]PersonDataLoader personLoader)
{
    return personLoader.LoadAsync(id);
}
```

Next, we have to register our _DataLoader_ with the schema. By default, _DataLoaders_ are registerd as per-request meaning that the execution engine will create one instance of each _DataLoader_ per-request **if** a field resolver has requested a _DataLoader_. This ensures that, _DataLoaders_ that are not beeing requested are not instantiated unnecessarily.

```csharp
Schema.Create(c =>
{
    // your other code...

    c.RegisterDataLoader<PersonDataLoader>();
});
```

Now, person requests in a single execution batch will be batched to the data source.

But there are still some more issues ahead that _DataLoaders_ will help us with. For that we should amend our query a little bit.

```graphql
{
  a: person(id: "a") {
    name
    friends {
      name
    }
  }

  b: person(id: "b") {
    name
    friends {
      name
    }
  }
}
```

The above query now drills down into the friends property, which again yields persons.

Let's, say our person object is located in a mongo database and the document would look something like the following:

```json
{
  "id":"a"
  "name":"Foo"
  "friends": [
    "b",
    "c",
    "d"
  ]
}

{
  "id":"b"
  "name":"Bar"
  "friends": [
    "a",
    "c",
    "e"
  ]
}
```

The person with ID `a` is also friends with person `b`. Moreover, `a` is also friends with `c` and `d`. Furthermore, `b` is friends with `a` and also friends with `c` and `e`.
The best case now would be that we only fetch `c`, `d` and `e` since we have already fetched `a` and `b`.

This is the second problem class the _DataLoader_ utility helps us with since the _DataLoader_ contains a cache and holds the resolved instances by default for the duration of your request.

For more information about our _DataLoader_ implementation head over to our _DataLoader_ [GitHub repository](https://github.com/ChilliCream/greendonut).

## Custom Data Loaders

We are supporting custom _DataLoader_ implementations. You can use our
