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
public void BeginParsing(IQueryContext context)
{
    // ... your code
}
```

#### Stop Parsing

The stop event is raised once the parser finished. It is important to know that the stop event is even raised if a `SyntaxException` is thrown. The `Document` property on the `IQueryContext` will be null in this case. The parser middleware will add a property to the context data indicating if the query was retrieved from the cache: `DocumentRetrievedFromCache`.

```csharp
[DiagnosticName("HotChocolate.Execution.Parsing.Stop")]
public void EndParsing(IQueryContext context)
{
    // ... your code
}
```

#### Parsing Errors

The parser will throw a `SyntaxException` if the query is not syntactically correct. The `SyntaxException` will cause a query error.

### Validation Events

The validation events are raised whenever the validation middleware is invoked. Like with the parsing middleware the validation middleware will cache validation results. This means that only the first validation of a query document can be used to measure the validation duration. The context property `DocumentRetrievedFromCache` can also be used in this case to detect if the validation result was pulled from the internal cache or if it was computed.

#### Validation Start

```csharp
[DiagnosticName("HotChocolate.Execution.Validation.Start")]
public void BeginValidation(IQueryContext context)
{
    // ... your code
}
```

#### Validation Stop

```csharp
[DiagnosticName("HotChocolate.Execution.Validation.Stop")]
public void EndValidation(IQueryContext context)
{
    // ... your code
}
```

#### Validation Errors

```csharp
[DiagnosticName("HotChocolate.Execution.Validation.Error")]
public void OnValidationError(
    IQueryContext context,
    IReadOnlyCollection<IError> errors)
{
    // ... your code
}
```

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

## Getting Started

In order to subscribe to the _Hot Chocolate_ instrumentation events you have to create a class that implements the marker interface `IDiagnosticObserver`.

```csharp
public class MyDiagnosticObserver
    : IDiagnosticObserver
{
}
```

The observer subscribes to an event by adding a method that is annotated with the event name like the following:

```csharp
public class MyDiagnosticObserver
    : IDiagnosticObserver
{
    [DiagnosticName("HotChocolate.Execution.Validation.Error")]
    public void OnValidationError(
        IQueryContext context,
        IReadOnlyCollection<IError> errors)
    {
        // ... your code
    }
}
```

When subscribing to start/stop events you also have to add the actual event method, otherwise the diagnostic source will not enable the event.

```csharp
public class MyDiagnosticObserver
    : IDiagnosticObserver
{
    [DiagnosticName("HotChocolate.Execution.Query")]
    public void OnQuery(IQueryContext context)
    {
        // This method is used to enable start/stop events for query.
    }

    [DiagnosticName("HotChocolate.Execution.Query.Start")]
    public void BeginQueryExecute(IQueryContext context)
    {
        // ... your code
    }

    [DiagnosticName("HotChocolate.Execution.Query.Stop")]
    public void EndQueryExecute(
        IQueryContext context,
        IExecutionResult result)
    {
        // ... your code
    }
}
```

You can use the context data to pass tracing details like a custom request id between your events:

```csharp
public class MyDiagnosticObserver
    : IDiagnosticObserver
{
    [DiagnosticName("HotChocolate.Execution.Query")]
    public void OnQuery(IQueryContext context)
    {
        // This method is used to enable start/stop events for query.
    }

    [DiagnosticName("HotChocolate.Execution.Query.Start")]
    public void BeginQueryExecute(IQueryContext context)
    {
        context.ContextData["TracingId"] = Guid.NewGuid();
        // ... your code
    }

    [DiagnosticName("HotChocolate.Execution.Query.Stop")]
    public void EndQueryExecute(
        IQueryContext context,
        IExecutionResult result)
    {
        Guid tracingId = (Guid)context.ContextData["TracingId"];
        // ... your code
    }
}
```

There are two ways to register the diagnostics observer with the execution engine. You either can register the observer with the executor directly

## Examples

We have created a little example project that demonstartes how you can delegate _Hot Chocolate_ events to the APS.Net core logger API.

[Example Project](https://github.com/ChilliCream/hotchocolate-examples/tree/master/Instrumentation)
