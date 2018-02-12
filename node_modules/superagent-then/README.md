# superagent-then

A trivial plugin for Superagent that gives Requests a Promises/A+ .then().

## Usage

Install the plugin like any other Superagent plugin with `.use`:

```javascript
superagent
  .get('www.google.com')
  .use(plugin)
  ...
```

This _replaces_ `.end` with a Promise-returning version. At this point, `.end`
_no longer accepts a callback_.

```
superagent
  .get('www.google.com')
  .use(plugin)
  .then(function (response) {
    console.log('GET www.google.com:');
    console.log(response.status);
  }, function (err) {
    console.error('Error in GET www.google.com:');
    console.error(err);
  });
```

## License

```
The MIT License (MIT)

Copyright (c) 2014 Michael Schoonmaker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
