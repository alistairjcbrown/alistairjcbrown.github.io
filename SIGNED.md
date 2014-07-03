##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTteXkAAoJEJEOHi8Q7zzzBWoIALShkrHMIxwtjZ5XlmvwMcoW
Vo672mAUq8y9xkDJMxrFmCq8jzx3sN80fdCA4x9H1gBbnuM76WFgkIFJ82OsqmTV
/YoDRa0PYBRMl124U/9qCA5zGFjhHVw+Nzj3D+LMyUgNJTIKBGG9TEUGPG8YPAk3
7KPxkEsoRWGby5W+JFGJ7zzdJ8c4ExodxOTyZ+C9cTZr38/qqAe3gVC7oakPGuqg
gzVQiIsbRELAuACmA19drq0A5I4af4u917VsY9gYWX8dpyRb8ccGQX5uh2UThifs
K/i6JnbsQ5fOfHpfDs4pJ0n/WrGi0OXIHj6vhmUSpPylBFbnIuhtHO8lxBeXZQ0=
=ytfO
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size  exec  file                     contents                                                        
            ./                                                                                       
26            .gitignore             51c2b9520b429236f1d61fa87fc6aff27f4ef20714a093e15e425e18f729c6b2
332           .htaccess              7b7ef54a42745f3addf4087e331bee67b209726abdd7d708b4627babcb368499
              .well-known/                                                                           
3000            keybase.txt          01b4a0109d6d816ed6ddf788c9bb5eab7d7b69939dce10c3aeec7b1c7a8f1e04
3031          Gruntfile.js           f3a6e44a26fd651a49a82ccf3eba721243b1b1e7d24246cca20bc27a6df316c8
85            README.md              4bbf7a01604798c4cceec972420ce0e9fa9b88da482fd7855c3bf52a25ba76f9
              css/                                                                                   
1098            reset.css            f96b44c7b969277b79410066c40296ed729b95c6173625b677326736363b7775
4198            style.css            cf06246a2632f73f6049cf7552fb77d44b5e49697d75335e9e71491cf9c39d8c
4010            style.min.css        ec1a15eca8056f9055fb714890c37cc0625bc479fc956b8012c80599363cb87b
              images/                                                                                
2365            arrow.svg            0cbc32f9d994b150657e14708f04d96229e65b66836bfd7d30a5f18adbf35295
4455          index.html             96a46efb0c0d52299ca24c935b9a85f35d379af1d5b059142b81362650cf0474
              js/                                                                                    
398             google-analytics.js  acfce8b2ae170acd76f9b53e9bad82c155664fd3d14f5f66a6cf83bae18ffcea
2116            script.min.js        3c1140cf81e0f5e6e05b0a0b2928af15c2bea466ad7189e26153b575930ed185
1068            slide-toggle.js      4ad1627367dc794c334278442cecb8d8d0a15ca5ad9ee9676b7579b7a6bec59e
4916            subset.js            76eee7e863c0955ed4416acb558a21baf107dbff836b912e35725df8dfff4cd5
542           package.json           debb546b8968b6be616249c9d516494d73fc8eda4b4a37939ebbe357d91d4c0d
```

#### Ignore

```
/SIGNED.md
```

#### Presets

```
git      # ignore .git and anything as described by .gitignore files
dropbox  # ignore .dropbox-cache and other Dropbox-related files    
kb       # ignore anything as described by .kbignore files          
```

<!-- summarize version = 0.0.9 -->

### End signed statement

<hr>

#### Notes

With keybase you can sign any directory's contents, whether it's a git repo,
source code distribution, or a personal documents folder. It aims to replace the drudgery of:

  1. comparing a zipped file to a detached statement
  2. downloading a public key
  3. confirming it is in fact the author's by reviewing public statements they've made, using it

All in one simple command:

```bash
keybase dir verify
```

There are lots of options, including assertions for automating your checks.

For more info, check out https://keybase.io/docs/command_line/code_signing