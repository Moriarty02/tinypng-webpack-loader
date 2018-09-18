# tinypng loader for webpack

## install

```
"devDependencies" : {
    "tinypng-webpack-loader" : "git+https://github.com/Moriarty02/tinypng-webpack-loader.git"
}
```

## Usage

### step 1:
```
    sign in tinypng's website get a developer key(just need an email address)  
``` 
 [https://tinyjpg.com/developers](https://tinyjpg.com/developers)
  
### step 2:
 
``` 
    options:{
        isProduct:boolean //use tinypng in production env
        key:string      // you key from https://tinyjpg.com/developers
        cache:boolean     // use cache	
    }
```
### step 3:
```
eg.:
var tinypng=require('tinypng-webpack-loader');

module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'tinypng-webpack-loader',
        options: {
          isProduct: process.env.NODE_ENV == 'production',
          key: "your key",
          cache: true
        }
      }
    ]
  },

```