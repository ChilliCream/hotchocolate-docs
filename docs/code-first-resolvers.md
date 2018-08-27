---
id: code-first-resolvers
title: Resolvers
---

When you have started building your schema with code-first you might at first not see much about field resolvers although each field of your object type field of your GraphQL schema has an explicit field resolver that basically resolves the value from an object type instance when a query is executed.

The field resolvers for your types are generated when your schema is being created.

Most of the type you will have your first contact with one of those field resolvers when you start adding fields that do not have a representation in one of your .net types.

Lets start with a simple example and assume we have a Person type that has a property `Name` and a list of strings called `FriendIds`.

You want your GraphQL schema to look like the following:

```GraphQL
type Query {
    me: Person
}

type Person {
    name: String
    friends: [Person]
}
```

This will let you drill into the friends and their friends and so on very nicely.

Now to our c# code:

```csharp
public class Person
{
    public string Name { get; set; }
    public List<string> FriendIds { get; set; }
}

public class PersonType : ObjectType<Person>
{
    protected override void Configure(IObjectDescriptor<Person> desc)
    {
        desc.Field(t => t.FriendIds).Ignore();
        desc.Field("friends").Resolver(
            ctx => ctx.Service<IPersonRepository>()
                .GetFriends(ctx.Parent<Person>().FriendIds));
    }
}
```

The first thing we did was to ignore our `FriendIds` property so that this property would not show up in our schema. The second thing is that we added a field name and associated this field name with a resolver. A field resolver is represented as a delegate that can access a resolver context that holds the execution context for this specific field. The type of the field is inferred from the resolver result but can also be specified explicitly.

Another way to specify a resolver more cleanly is to add a method to your `Person` type. Since all members are resolvers we can specify a method in your class and the method arguments are injected from the context. 

Let me give you an example for that:

```csharp
public class Person
{
    public string Name { get; set; }
    public List<string> FriendIds { get; set; }

    public Task<IEnumerable<Person>> GetFriends([Service]IPersonRepository repository)
    {
        return repository.GetFriendsAsync(FriendIds);
    }
}
```

Since the above solution would mess up your clean .net type we could also bind to a different type that contains our resolver method.

```csharp
public class PersonResolvers
{
    public Task<IEnumerable<Person>> GetFriends(Person person, [Service]IPersonRepository repository)
    {
        return repository.GetFriendsAsync(person.FriendIds);
    }
}

public class PersonType : ObjectType<Person>
{
    protected override void Configure(IObjectDescriptor<Person> desc)
    {
        desc.Field(t => t.FriendIds).Ignore();
        desc.Field<PersonResolver>(t => t.GetFriends(default, default));
    }
}
```

The `PersonResolver` instance will be resolved from your dependency injection provider. If you did not register this type with your dependency injection provider we will create it as a singleton and use this instance for each resolver request.

The best way to use dependency injection with such resolver types is, to inject dependencies as method arguments like depicted above. This way you do not have to care about the lifetime of the injected service.

You can basically inject anything that is accessible through the resolver context. So, if you would like to know which field is being resolved you could just add `FieldNode` as method argument and we would inject this into the method call.

```csharp
public class PersonResolvers
{
    public Task<IEnumerable<Person>> GetFriends(Person person, [Service]IPersonRepository repository, FieldNode fieldSelection)
    {
        return repository.GetFriendsAsync(person.FriendIds);
    }
}
```

Or, if you want to have access to the complete resolver context specify an argument of the type `IResolverContext`. 

Moreover, if you specify arguments that are registered as `InputObjectType` or some other arguments that we do not recognise we will treat these as field arguments.

```csharp
public class PersonResolvers
{
    public Task<IEnumerable<Person>> GetFriends(string name, Person person, [Service]IPersonRepository repository)
    {
        return repository.GetFriendsAsync(person.FriendIds);
    }
}
```

The above resolver signature would change now our schema since name would now become a field argument:

```GraphQL
type Person {
    name: String
    friends(name: String): [Person]
}
```
