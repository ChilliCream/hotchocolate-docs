---
id: error-filter
title: Error Filter
---

GraphQL errors in _Hot Chocolate_ are passed to the query result by returning an instance of `IError` or an enumerable of `IError` in a field resolver. Moreover, you can throw a `QueryException` that will be be caught by the query engine and translated to a field error. 

If some other exception is thrown during the query execution then the engine would create an instance of `IError` with the message "Unexpected Execution Error".

If you want to translate exceptions into errors with usefull information then you can write an `IErrorFilter`.

An error filter has to be registered with the execution builder like the following.

```csharp
IQueryExecuter executer = schema.MakeExecutable(builder =>
    builder.UseDefaultPipeline(options)
        .AddErrorFilter<MyErrorFilter>());
```

It is also possible to just register the error filter as a delegate like the following.

```csharp
IQueryExecuter executer = schema.MakeExecutable(builder =>
    builder.UseDefaultPipeline(options)
        .AddErrorFilter((error, exception) =>
        {
            if (exception is NullReferenceException)
            {
                return error.WithCode("NullRef");
            }
            return error;
        }));
```

Since, errors are immutable we have added some helper functions like `WithMessage`, `WithCode` and so on that create a new error with the desired message, code or some custom error property.