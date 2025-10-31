# AlistairJCBrown.com

Code running http://www.alistairjcbrown.com

### Build

```
npx parcel build src/index.html --dist-dir ./docs
```

### Serve

```
python3 -m http.server --directory ./docs
```

### Format

```
npx prettier ./src --write
```
