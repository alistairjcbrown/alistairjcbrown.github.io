##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTteEAAAoJEJEOHi8Q7zzz3KoIAJLCZlhYDU0ibmlZDACpfEO5
XhB15cGKZ3fH5UUKUG8y6ShTMx9SBhGOJ6OHCuxGwW0hZFFtFZLKXwa8ETUSvmi5
0R3tSZTx7haOOCTkBtmQtLRMUfkaQU72EPLoCqgTmuupBh9X4xydEy2cOfqVYGio
J/RW5JPci0fx/pNoZGVz8N8lc01qU5LwndcBMQT6dvO8mUb0cxaJ7GZKwqm/5eHv
nBh8xNe5Pe13GzfgNrq2QcRJGNdZvAsYPHo2B87PInz5FTamOhL0HghHnYhsNCwD
MwDP90BQpOSM1ZJz7X5/GRwqhFwH7vK0DzRf6rYeMkB15gOnbIA3ryIKLpHzq/U=
=aq+b
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
3029          Gruntfile.js           ee238efbca95fbcd170534bf21ecb6346317650eff845db60eac8072f12958bd
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
2115            script.min.js        d9ac7c34da26782d5ae41fe8c05c9fe824b899b1e8562915c092518e235b26c9
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