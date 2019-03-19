---
id: instrumentation
title: Instrumentation
---

The _Hot Chocolate_ instrumentation allows you to receive internal instrumentation events and process them further. Instrumentation events are provided trhough a `DiagnosticSource`.

Using Microsoft\`s `DiagnosticSource` API allows us to provide rich events without compromising on information detail.

As a developer using _Hot Chocolate_ we can subscribe to those events and delegate them either to our logging provider or to another tracing infrastructure for further processing.

This allows us to just take the information we need for a certain logging solution and for instance craft the events provided by _Hot Chocolate_ into logging meesages that fit our project.

## Events

First let us have a look at what events _Hot Chocolate_ currently provides and what they mean. Later we will walk you through how to setup a `IDiagnosticObserver`.

### Query Events

Query events are raised per request. This means that for each query request that we fire up against a _Hot Chocolate_ one query event is raised.

The following query events are available:

#### Start Query

The start event is raised once the query engine receives a request.

```csharp
[DiagnosticName("HotChocolate.Execution.Query.Start")]
public void BeginQueryExecute(IQueryContext context)
{
    // ... your code
}
```

The query context that we provide as payload with the event is the full query context on which the query middleware operates. This enables us to pick and choose the information that we want.

#### Stop Query

The stop event is raised once the query engine has completed processing the request. This event is even called if an error has occured. Additional to the `IQueryContext` the event also provides the `IExecutionResult`.

```csharp
[DiagnosticName("HotChocolate.Execution.Query.Stop")]
public void EndQueryExecute(
    IQueryContext context,
    IExecutionResult result)
{
    // ... your code
}
```

#### Query Error

The error event is raised should there be an unhandled exception on the query middleware level. This event is not raised whenever a validation or field error is thrown.

```csharp
[DiagnosticName("HotChocolate.Execution.Query.Error")]
public virtual void OnQueryError(
    IQueryContext context,
    Exception exception)
{
    // ... your code
}
```

### Parser Events

The parser events are raised when the parser middleware is invoked. It is important to know that the _Hot Chocolate_ server caches queries. This means that only the first time a query is executed, we can measure the parsing time.

#### Start Parsing

The start event is raised once the parser middleware is invoked.

```csharp
[DiagnosticName("HotChocolate.Execution.Parsing.Start")]
public void BeginQueryExecute(IQueryContext context)
{
    // ... your code
}
```

#### Stop Parsing

The stop event is raised once the parser finished. It is important to know that the stop event is also raised if a syntax exception is called. The `Document` property on the context will be null in this case.

```csharp
[DiagnosticName("HotChocolate.Execution.Parsing.Stop")]
public void BeginQueryExecute(IQueryContext context)
{
    // ... your code
}
```

#### Parsing Errors

The parser will throw a `SyntaxException` if the query is not syntactically correct. The `SyntaxException` will cause a query error.

### Validation Events

HotChocolate.Execution.Validation
HotChocolate.Execution.Validation.Start
IQueryContext context
HotChocolate.Execution.Validation.Stop
IQueryContext context
HotChocolate.Execution.Validation.Error
IQueryContext context
IReadOnlyCollection<IError>

### Resolver Events

HotChocolate.Execution.Resolver
HotChocolate.Execution.Resolver.Start
IResolverContext context
HotChocolate.Execution.Resolver.Stop
IResolverContext context
object result
HotChocolate.Execution.Resolver.Error
IResolverContext context
IEnumerable<IError> errors

```

```
