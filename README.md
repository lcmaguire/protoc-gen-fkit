
will generate views for all messages in the incoming proto file.

Message must be parseable to map<string, Value> as it will end up in document.fields of [a firestore document](https://firebase.google.com/docs/firestore/reference/rpc/google.firestore.v1#google.firestore.v1.Document)



# use

- point to /src dir


# requires
- firestore db
- firebase auth

# unsuported features

- oneofs
- repeated enums
- nested messages
- nested enums

