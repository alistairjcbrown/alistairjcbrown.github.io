##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTl5RwAAoJEJEOHi8Q7zzz1s8H/REGycIPRN8ksI+y55nZHRVq
hkrKC5AW8oELmFZEEtF2Y8GCfoJ3dFuW85Xrd4TZGVyPrS6hrMzM16tEyoIzTN4N
XZtOdwBphH8SOkHnCm8dWpu324KogbydH80IU634wExAzi7E6KvzqYtyDAZfdBqD
Etio4Op7//t/ePulBa5XmpXVLKV70uNhtiXg6h75/oxfQlxqihGiPRrrBysLXMoX
iwgCRYUIhK0frqys8rp3bVyodCl0LEz47uQlggWwZ+lY4tk0Wc3c8NytLp1BwzWi
j/G0aLvGMueSVED6erKIU5KA08AcYBJgONnQsto6vfauLR2zPXHikTaTskLuYts=
=2I5q
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size  exec  file             contents                                                        
            ./                                                                               
332           .htaccess      7b7ef54a42745f3addf4087e331bee67b209726abdd7d708b4627babcb368499
              .well-known/                                                                   
3000            keybase.txt  01b4a0109d6d816ed6ddf788c9bb5eab7d7b69939dce10c3aeec7b1c7a8f1e04
85            README.md      4bbf7a01604798c4cceec972420ce0e9fa9b88da482fd7855c3bf52a25ba76f9
              css/                                                                           
1098            reset.css    f96b44c7b969277b79410066c40296ed729b95c6173625b677326736363b7775
4198            style.css    cf1e4794729bae7de7d1ed01eb4e3c49b1c9cae716b8aff4290f640552d29577
              images/                                                                        
2365            arrow.svg    0cbc32f9d994b150657e14708f04d96229e65b66836bfd7d30a5f18adbf35295
6358          index.html     2c8b8240b523decb4ceb882389fe58f1d2ca8f73e67d16692a64f882362cfa24
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

<!-- summarize version = 0.0.8 -->

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