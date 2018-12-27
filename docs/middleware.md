---
id: middleware
title: Middleware
---

_Hot Chocolate_ has three kinds of middleware. The query middleware which allows to extend or rewrite the processing of a query request, the field middleware which allows to extend or rewrite the processing of field resolvers and the directive middleware which allows basically to add a field middleware to fields that are annotated with a specific directive.

## Field Middleware

The most common way to extend the execution is to extend the pipeline that resolves data from a field.

The field resolver itself is embeded in a middleware that will call the field\`s resolver if no other middleware component has produced a result for the field.

A field middleware can be used to convert the result of a field to fetch the result from a different source or even validate the arguments of a field. There are multiple use cases for which a field middleware is useful.

A field middleware can be bound to a specific field or it can be included into the field resolver pipeline of all fields.

So, let us first have a look at the simpelest case were we add a field middleware to every field of the middleware.

Our middleware shall resolve the field data if the source-object (parent-object) that is passed down to the field resolver pipeline is a dictionary.

```csharp
Schema.Create(
    c => c.Use(next => context =>
    {
        if(context.Parent<object>() is IDictionary<string, object> dict)
        {
            context.Result = dict[context.Field.Name];
            return Task.CompletedTask;
        }
        else
        {
            return _next(context);
        }
    }));
```

In your middleware you can always decide if your middleware completes the pipeline or if it shall call the next pipeline component.

In the above example we are completing (short-circuiting) the middleware pipeline if the source-object is a dictionary and we have resolved the field result; otherwise, we are calling the next middleware component in the pipeline.

Our middleware could also pass to the next pipeline if we want to allow other middleware components to be able to further process the result or even replace result with a new result.

Another pattern is to reverse the execution of our middleware and first let the middleware components that come after our middleware process. This will let the other middleware compose the field result.

Our field middlware can now convert the result that some other middleware component has produced.

```csharp
Schema.Create(
    c => c.Use(next => async context =>
    {
        await _next(context);

        if(context.Result is string s)
        {
            context.Result = s.ToUpper();
        }
    }));
```

Lets now have a look of how you can bind a middleware to a specific field.

The first way to do that is to use `Map` on the schema configuration and basically map a middleware to a specific field.

```csharp
Schema.Create(
    c => c.Map("Query", "field", next => async context =>
    {
        await _next(context);

        if(context.Result is string s)
        {
            context.Result = s.ToUpper();
        }
    }));
```

Map is especially useful if you are building your schema with the schema-first approach.

If you are using the code-first approach you can do that more elegantly by using `Use` on a field descriptor.

```csharp
public class FooType
    : ObjectType<Foo>
{
    protected override void Configure(IObjectTypeDescriptor<Foo> descriptor)
    {
        descriptor.Field(t => t.Bar).Use(next => async context =>
        {
            await _next(context);

            if(context.Result is string s)
            {
                context.Result = s.ToUpper();
            }
        });
    }
}
```

You also can define you middleware as a class. There is no interface since you can choose services as payloads for your constructor and/or method.

The method has to return `Task` and must be called `InvokeAsync` or `Invoke`.

Since, a middleware lifetime is basically bound to the lifetime of the executer you should only inject singletons into the constructor.

Services with a scoped lifetime should be injected as method parameters.

```csharp
public class MyMiddleware
{
    private readonly FieldDelegate _next;
    private readonly  IMySingletonService _singletonService;

    public MyMiddleware(FieldDelegate next, IMySingletonService singletonService)
    {
        _next = next;
        _singletonService = singletonService;
    }

    public async Task InvokeAsync(IMiddlewareContext context, IMyScopedService scopedService)
    {
        // the middleware logic
        await _next(context);
    }
}
```

The class middlewares can be registerd as follows:

```csharp
descriptor.Field(t => Bar).Use<MyMiddleware>();
```

Also if you have custom parameters that you want to pass allong you can use our factory.

```csharp
descriptor.Field(t => Bar).Use((services, next) => new MyMiddleware(next, "custom", "custom", services.GetRequiredService<FooBar>()));
```

Our paging implementation for IQueryable is a field middleware and is provided through an extension method on `IObjectFieldDescriptor`.

The extension method adds the middleware as well as the arguments that the middleware expects.

```csharp
descriptor.Field(t => Bar).UsePaging();
```

The extension method hides the complexity of combining a middleware with arguments and so on and also reduces repetitive code.

_As a side note, the `IMiddlewareContext` implements also `IResolverContext` so in a middleware you have access to all the context information that the resolver context has._

_You can even access all the results that the previous resolver in your path have produced by accessing the `Source` property which is exposed as a immutable stack of results._

## Directive Middleware

Directives can be used to annotate nearly everything in your schema or query. The annotation can than be used in a field middleware to change the way something is executed and so on.

In order to make directives even more powerfull we added the ability to define a directive middleware which is executed whenever a directive is annotated to an object definition, field definition or field selection.

So, first lets have a look at how to define a directive middleware.

Lets say we want to have a directive that allways converts the result of annotated fields to an upper string.

```csharp
public class UpperDirectiveType
    : DirectiveType
{
    protected override void Configure(
        IDirectiveTypeDescriptor<FooDirective> descriptor)
    {
        descriptor.Name("upper");
        descriptor.Location(DirectiveLocation.Field);
        descriptor.Use(next => async context =>
        {
            await next.Invoke(context);

            if(context.Result is string s)
            {
                context.Result = s.ToUpper();
            }
        })
    }
}
```

Directives have to be registered with the schema in order to be used in queries or schema types.

```csharp
Schema.Create(t => t.RegisterDirective<UpperDirectiveType>());
```

Once registered our directive can be used like the following in queries:

```graphql
{
  foo {
    bar @upper
  }
}
```

The directive middleware is then included into the resolver pipline of this field in this particular query.

This makes writing middlewares simpler since you do not have to write a middleware that has to check everytime if the field is annotated with a certain directive.

Moreover, the middleware is only injected into the field resolver pipeline if needed so you do not have extra code running each time a field is resolved when it is not annotated with your directive.

More about directives in particular can be read [here](directive.md)

## Query Middleware

The query execution process itself is just made up of many query middleware components.

For us it makes changes to the execution pipeline very simple. Moreover, we can write tests for each middleware component.

Furthermore, with the `QueryExecutionBuilder` you are able to rewrite our execution pipeline.

We are using this very thing to implement our schema stitching API. Basically we swapped out the parser middleware for one that parses and rewrites queries in order to delegate parts of the query to remote schemas.

So, when you want to rewrite the execution process itself then a query middleware is what you want to do implement.

A query middleware is declared with the `QueryExecutionBuilder`.

```csharp
QueryExecutionBuilder.New()
    .Use(next => context =>
    {
        // your middleware code
    })
    .UseDefaultPipeline()
    .Build(schema);
```
