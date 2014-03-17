#CarwingsJS

CarwingsJS is a Node module that provides bindings for the Nissan Leaf [Carwings][1] SOAP API. To be clear, Carwings API is not officially documented externally and it is unclear how long Nissan will continue to allow 3rd party apps to connect to it. 

## Installation

`npm install carwingsjs`

## Usage

In your application 

```
var carwings = require('carwings');

carwings.login('username', 'password', function(err, output) {
	console.log(output);
})
```

## Contributors

[https://github.com/crabasa/carwingsjs/graphs/contributors](https://github.com/crabasa/carwingsjs/graphs/contributors)

## License

MIT

## Appendix

1. [Nissan Leaf Forums - Carwings protocol][2]
2. [Nissan Leaf Forums - Carwings API thread][3]

[1]:http://www.nissanusa.com/innovations/carwings.article.html
[2]:http://www.mynissanleaf.com/wiki/index.php?title=Carwings_protocol
[3]:http://www.mynissanleaf.com/viewtopic.php?f=27&t=2214
