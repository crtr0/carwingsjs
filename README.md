#CarwingsJS

CarwingsJS is a Node module that provides bindings for the Nissan Leaf [Carwings][1] API. To be clear, this API is not officially documented externally and it is unclear how long Nissan will continue to allow 3rd party apps to connect to it. 

## Installation

`npm install carwingsjs`

## Usage

In your application 

```
var carwings = require('carwings');

carwings.login({
  leaf_username: 'username',
  leaf_password: 'password',
  device_token: 'device token',
  device_id: 'unique device id'	
}, function(err, output) {
	console.log(output);
})
```

## Appendix

1. [Nissan Leaf Forums - Carwings protocol][2]
2. [Nissan Leaf Forums - Carwings API thread][3]

[1]:http://www.nissanusa.com/innovations/carwings.article.html
[2]:http://www.mynissanleaf.com/wiki/index.php?title=Carwings_protocol
[3]:http://www.mynissanleaf.com/viewtopic.php?f=27&t=2214
