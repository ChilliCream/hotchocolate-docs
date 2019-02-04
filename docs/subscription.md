---
id: code-first-subscription
title: Subscriptions
---

## What are GraphQL subscriptions?

Subscriptions is a GraphQL feature that allows a server to send data to its clients when a specific event happens. So, basically GraphQL subscriptions is the GraphQL way to expose a pub-sub-system to clients.

If you are using GraphQL over HTTP than it is most likely served over web sockets. Hot Chocolate implemented the Apollo subscriptions protocol in order to serve subscriptions over web sockets.

## Getting started

Subscriptions types are almost implemented like a simple query. In many cases subscriptions are raised through mutations but subscriptions could also be raised through other backend systems.
