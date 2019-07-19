---
id: code-first-subscription
title: Subscriptions
---

## What are GraphQL subscriptions?

Subscriptions is a GraphQL feature that allows a server to send data to its clients when a specific event on the server-side occurs.

Subscribing to an event is like writing a standard query. The one difference here is the operaion keyword and that we are only allowed to have one root field in our query since the root fields represent events.

```graphql
subscription {
  onReview(episode: NEWHOPE) {
    stars
    comment
  }
}
```

If you are using GraphQL over HTTP than it is most likely served over web sockets. Hot Chocolate implemented the Apollo subscriptions protocol in order to serve subscriptions over web sockets.

## Getting started

Subscriptions types are almost implemented like a simple query. In many cases subscriptions are raised through mutations, but subscriptions could also be raised through other backend systems.

In order to enable subscriptions you have to register a subscription provider with your server. Subscription provider represent a pub-/sub-system abstraction that handles the events.

We currently support the following subscription provider:

- InMemory
  This one is good enough if you have a single server and all events are triggered through your mutations.

- Redis
  We have an out-of-the-box redis subscription provider that uses the redis publish/subscribe functionality. If you have multiple instances of our server then this provider is your best option.

> We are in the process to add more pub-/sub-provider for Kafka, Redis Streams, Azure EventHub and Azure ServiceBus. We also can help you along if you want to implement your own subscription provider.

In order to add the subsciption provider to your server add the following service in the `ConfigureServices` method of your `Startup.cs`:

```csharp
services.AddInMemorySubscriptionProvider();
```

or

```csharp
services.AddRedisSubscriptionProvider(configuration);
```

Once this is setup subscriptions are generally available. In order to define subscriptions we have to create a subscription type. The subscription type is just a regular `ObjectType`, so we create it like any other root type.

```csharp
public class SubscriptionType
    : ObjectType<Subscription>
{
    protected override void Configure(IObjectTypeDescriptor<Subscription> descriptor)
    {
        descriptor.Field(t => t.OnReview(default, default))
            .Type<NonNullType<ReviewType>>()
            .Argument("episode", arg => arg.Type<NonNullType<EpisodeType>>());
    }
}
```

But there is a difference when it comes to the resolver. A subscription resolver can ask for an additional argument that represents the event message.

```csharp
public Review OnReview(Episode episode, IEventMessage message)
{
    return (Review)message.Payload;
}
```

The event message can have a used-defined payload representing some kind of prepared data or what ever we want to put in there. The allowed payload size depends on the subscription provider.

The payload can also be null and we can pull relevant data in from other data sources whenever the event occurs.

An event is triggered when we send use the `IEventSender` to raise an event. This will be mostly done within a mutation since the mutation represents the operation that change the server state and hence cause it to raise events.

So, in our mutation we can ask for the `IEventSender` and raise an event like the following:

```csharp
public async Task<Review> CreateReview(
    Episode episode, Review review,
    [Service]IEventSender eventSender)
{
    _repository.AddReview(episode, review);
    await eventSender.SendAsync(new OnReviewMessage(episode, review));
    return review;
}
```

In the above case we are sending a `OnReviewMessage` which actually inherits from `EventMessage`.

```csharp
public class OnReviewMessage
    : EventMessage
{
    public OnReviewMessage(Episode episode, Review review)
        : base(CreateEventDescription(episode), review)
    {
    }

    private static EventDescription CreateEventDescription(Episode episode)
    {
        return new EventDescription("onReview",
            new ArgumentNode("episode",
                new EnumValueNode(
                    episode.ToString().ToUpperInvariant())));
    }
}
```

If you want to have a working example for subscription head over to our ASP.net Core [example](https://github.com/ChilliCream/hotchocolate/tree/master/examples/AspNetCore.StarWars).

## In-Memory Provider

The in-memory subscription provider does not need any configuration and is easily setup:

```csharp
services.AddInMemorySubscriptionProvider();
```

## Redis Provider

The redis subscription provider uses Redis as pub/sub system to handle messages, this enables you to run multiple instances of the _Hot Chocolate_ server and handle subscription events reliably.

In order to use the Redis provider add the following package:
`HotChocolate.Subscriptions.Redis`

After you have added the package you can add the redis subscription provider to your services like the following:

```csharp
var configuration = new ConfigurationOptions
{
    Ssl = true,
    AbortOnConnectFail = false,
    Password = password
};

configuration.EndPoints.Add("host:port");

services.AddRedisSubscriptionProvider(configuration);
```

Our Redis subscription provider uses the `StackExchange.Redis` Redis client underneath an we have integration tests against the Azure Cache.
