# Code Reference Service

This nodejs service returns code snippets of particular languages and algorithms. It uses the code.json file to find and serve data.

### Endpoint

`/api/query`

##### BODY

`{ "query" : <query string> } `

##### Response

If found ,

```
status: 200 ,
response : { "code": <code snippet>, "language":<programming language searched for>}
```

If not found,

```
status 404 ,
response: {'res':"Query not found "}
```
