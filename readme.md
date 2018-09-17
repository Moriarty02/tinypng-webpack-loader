# tinypng loader for webpack

## install

```
"devDependencies" : {
    "tinypng-webpack-loader" : "git+http://git.qstore.org/zhangxiuhua/tinypng-webpack-loader.git"
}
```

## Usage
```
Step 1:
    sign in tinypng's website get a developer key
    
    [https://tinyjpg.com/developers](https://tinyjpg.com/developers)
    
step 2:
    options:{
        isProduct:boolean //use tinypng in production env
        key:string      // you key from https://tinyjpg.com/developers
        cache:boolean     // use cache	
    }
    
step 3:

eg.:
var tinypng=require('tinypng-webpack-loader');

module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          isProduct: process.env.NODE_ENV == 'production',
          key: "DEEJwwMJqu5IIpT4IiVhoFSgZ0LV1KdS",//use yours, this is mine
          cache: true
        }
      }
    ]
  },

```