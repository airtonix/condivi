# UIkit Settings

# `styles/settings`

- nothing here should generate css. only values.
- any settings should be exported as a map
- only core sass functions should be used.

## Breakpoints

### Settings

- Defined as a map for consumption by [../functions/breakpoints.scss](../functions/breakpoints.scss)

## Breakpoints per file

breakpoints are express as separate files, files use BEM naming convention.

```
src/site__whitelabel/
    ...
    components/
      site-header/
        _header.scss
        _header--largeup.scss
    ...
```

wrap these files in breakpoints in your root `components.scss`

```
src/site__whitelabel/
    ...
    components/
      _index.scss                  <----- Here
      site-header/
        _header.scss
        _header--largeup.scss
    ...
```

```
// theme--main/_components.scss

@import "./settings";

@import "./components/site-header/header"

@include breakpoint-gte("large") {
  @import "./components/site-header/header--largeup";
}

...

```
