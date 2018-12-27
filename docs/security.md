---
id: security
title: Security
---

The user of a GraphQL services is given enormous capabilities by crafting his or her queries and defining what data he or she really needs.

This stands in contrast to REST or SOAP have fixed operations that can be tested and the performance impact can be predicted more easily.

This is one of the main features of GraphQL but also poses one of the main challenges for the backend developer since it makes the backend less predictable performance wise.

_Hot Chocolate_ provides you with some basic startegies to make your backend more predictable and protect against queries that have a to high coplexity and thus would pose a headache for your backend.

## Execution Timeout

The first strategy and the simplest one is using a timeout to protect your backend against large queries. Basically, if a query execeds the allowed amount of execution time it will be aborted and a GraphQL error is returned.

_By default a query is limited to 30 seconds._

## Query Depth

Many GraphQL schemas expose cyclic graphs allowing for recursive queries like the following:

```graphql
{
  me {
    friends {
      friends {
        friends {
          friends {
            friends {
              friends {
                friends {
                  friends {
                    friends {
                      #...
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Sure, GraphQL queries are finit and there is now way to craft a query that would crawl throgh your graph forever but you could write or generate a very big query that drills very deep in your graph.

In order to limit the depth of queries you can enable a maximum execution depth and by this protect you query agains this kind of queries.

It is important to know that the query will be validated before any execution is happening. So, in contrast to the execution timeout which will actually start executing a query the execution depth of a query is validated beforehand.

The query will be rejected when any of the provided operations exceeds the allowed query depth.

## Query Complexity

All of the execution options are listed [here](options.md).
