##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTmJXvAAoJEJEOHi8Q7zzzLk4IAKGZnGdlw4Q++x8rxw7LX9gf
DH5DTb1b6B+erS9ugrZ7bbFcX96b18APzDse2CQfkOfIAGfR9VHspCoEBI2gWPvv
+pw1dK1jWlWS9OB+FCu5mfAwMKKSH7sBJj1iNK68RrWqmUF3wfr7hbUbiQxj4gkv
RhsiF0gtnBO0MFOpii6h21lTgQKKnCCP7NHmRWyO4/kIBkAQSnO5AjwDgsH6ZC6o
9sNvUC2EPWByolfI5EzZ4vZE8DHn/WST7RjG4QQ7D0ZHrR7yHaIpm8V3kM5U/18Q
y1tzkttQPF1XwhM4KUsxlX/8BB3tSR8R7sSvvH+lpYq1RZ03x3hyLsGRXyRX29w=
=ONo3
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
4198            style.css    cf06246a2632f73f6049cf7552fb77d44b5e49697d75335e9e71491cf9c39d8c
              images/                                                                        
2365            arrow.svg    0cbc32f9d994b150657e14708f04d96229e65b66836bfd7d30a5f18adbf35295
6550          index.html     1fb7337cd27ea76bd81efd10ef5576852e38972612f2b8f24b593b381fba1a82
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