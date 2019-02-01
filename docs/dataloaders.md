---
id: dataloaders
title: DataLoaders
---

## Data Loaders

If you want to read more about _DataLoader_ in general, you can head over to Facebook's [GitHub repository](https://github.com/facebook/dataloader).

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

This basically represents the first case where _DataLoader_ help us by batching requests against our database or backend service. Currently, we allow _DataLoader_ per request and globally.

So, let's look at some code in order to understand what they are doing. First, let's have a look at how we would write our field resolver without _DataLoader_:

```csharp
public async Task<Person> GetPerson(string id, [Service]IPersonRepository repository)
{
    return await repository.GetPersonById(id);
}
```

The above example would result in two calls to the person repository that would than fetch the persons one by one from our data source.

If you think that through you can see that each GraphQL request would cause multiple requests to our data source resulting in slugish performance and uneccessary roundtrips to our data source.

This, means that we reduced the roundtrips from our client to our server with GraphQL but multiplied the roundtrips between the data sources and the service layer.

With _DataLoader_ we can now centralise our person fetching and reduce the number of round trips to our data source.

In order to use _DataLoader_ with _HotChocolate_ we have to add the _DataLoader_ registry. The _DataLoader_ registry basically manages the data loader instances and interacts with the execution engine.

```csharp
services.AddDataLoaderRegistry();
```

Next, we have to create a _DataLoader_ that now acts as intermediary between a field resolver and the data source.

You can either implement a _DataLoader_ as class or just provide us with a delegate that represents the fetch logic.

## Class DataLoader

Let us first look at the class _DataLoader_:

```csharp
public class PersonDataLoader : DataLoaderBase<string, Person>
{
    private readonly IPersonRepository _repository;

    public PersonDataLoader(IPersonRepository repository)
      : base(new DataLoaderOptions<string>())
    {
        _repository = repository;
    }

    protected override async Task<IReadOnlyList<Result<Person>>> FetchAsync(
        IReadOnlyList<string> keys,
        CancellationToken cancellationToken)
    {
        return _repository.GetPersonBatch(keys);
    }
}
```

The _DataLoader_ is now injected by the execution engine as a field resolver argument.

_DataLoader_ have to be injected at field resolver argument level and **NOT** as constructor arguments since the lifetime of a _DataLoader_ is in many cases shorter than the class containing the field resolvers.

```csharp
public Task<Person> GetPerson(string id, [DataLoader]PersonDataLoader personLoader)
{
    return personLoader.LoadAsync(id);
}
```

It is important that you do not have to register a _DataLoader_ with your dependency injection provider. _HotChocolate_ will handle the instance management and register all _DataLoader_ automatically with the _DataLoader_ registry that we have added earlier.

Now, person requests in a single execution batch will be batched to the data source.

But there are still some more issues ahead that _DataLoader_ will help us with. For that we should amend our query a little bit.

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

## Delegate DataLoader

With the class _DataLoader_ you have full controll of how the _DataLoader_ works. But in many cases this control is not needed. We have specified four classes of _DataLoaders_ that can be specified as delegate.

### Batch DataLoader

The batch _DataLoader_ collects requests for entities per processing level and send them as a batch request to the data source.

The batch _DataLoader_ gets the keys as a collection and expects a `Dictionar<TKey, TValue>` back.

```csharp
public Task<Person> GetPerson(string id, IResolverContext context, [Service]IPersonRepository repository)
{
    return context.DataLoader("personLoader", keys => repository.GetPersonBatch(keys)).LoadAsync(id);
}
```

The `DataLoader` extension method on `IResolverContext` gets or creates a batch _DataLoader_. So, this basically saves you writing the _DataLoader_ classes.

### One to Many DataLoader

The one to many _DataLoader_ is also a batch _DataLoader_ but instead of returning one entity per key it returns multiple entities per key. The one to many _DataLoader_ gets the keys as a collection and expects a `ILookup<TKey, TValue>` back.

```csharp
public Task<Person> GetPerson(string id, IResolverContext context, [Service]IPersonRepository repository)
{
    return context.DataLoader("personLoader", keys => repository.GetPersonBatch(keys).ToLookup(t => t.Id)).LoadAsync(id);
}
```

### Single Request DataLoader

The single request _DataLoader_ is basically the easiest to implement since there is no batching involved. So, we can just use the initial `GetPersonById` method. We, do not get the benifits of batching with this one but if in a query graph the same entity is twice resolved that we get the benefits of the _DataLoader_ caching.

```csharp
public Task<Person> GetPerson(string id, IResolverContext context, [Service]IPersonRepository repository)
{
    return context.DataLoader("personLoader", keys => repository.GetPersonById(keys)).LoadAsync(id);
}
```

### Load Once Request DataLoader

The load one request _DataLoader_ is not really a _DataLoader_ like described by facebook. It rather uses the infrastructure of the _DataLoader_ to provide a kind cache loader. So, basically you can use this one to cache the values of certain calls within a request.

```csharp
public Task<Person> GetPerson(string id, IResolverContext context, [Service]IPersonRepository repository)
{
    return context.DataLoader("cachingLoader", () => repository.GetSomeResource())();
}
```

And since we do not have any keys here we just return a `Func<Task<TValue>>` that can be executed to fetch a value.

## Stacked DataLoader

This is more like an edge case that is supported than a certain type of _DataLoader_. Somtime we have more complex resolvers that might first fetch data from one _DataLoader_ and use that to fetch data from the next. With the new _DataLoader_ implementation this is supported and under test.

```csharp
public Task<IEnumerable<Customer>> GetCustomers(string personId, IResolverContext context, [Service]IPersonRepository personRepository, [Service]ICustomerRepository customerRepository)
{
    Person person = await context.DataLoader("personLoader", keys => repository.GetPersonById(keys)).LoadAsync(id);
    return await context.DataLoader("customerLoader", keys => repository.GetCustomerById(keys)).LoadAsync(person.CustomerIds);
}
```

## Global DataLoader

Global _DataLoader_ are _DataLoader_ that are shared between request. This can be useful for caching strategies.

In order to add support for global _DataLoader_ you can add a second _DataLoader_ registry. This one has to be declared as singleton. It is important that you declare the global registry first since we use the last registered registry for ad-hoc registrations.

```csharp
services.AddSingleto<IDataLoaderRegistry, DataLoaderRegistry>();
services.AddDataLoaderRegistry();
```

It is important to know that you always have to do `AddDataLoaderRegistry` since this also sets up the batch operation that is needed to hook up the execution engine with the _DataLoader_.

## GreenDonut

For more information about our _DataLoader_ implementation head over to our _DataLoader_ [GitHub repository](https://github.com/ChilliCream/greendonut).

## Custom Data Loaders and Batch Operations

With the new API we are introducing the `IBatchOperation` interface. The query engine will fetch all batch operations and trigger those once all data resolvers in one batch are running. We have implemented this interface for our _DataLoader_ aswell. So, if you want to implement some database batching or integrate a custom _DataLoader_ than this interface is your friend. There is also a look ahead available which will provide you with the fields that have to be fetched.

If you are planung to implement something in this area get in contact with us and we provide you with more information.