##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTlOg7AAoJEJEOHi8Q7zzzCJQH/1CJ3sYkwkFTtiyQ0ZO7KXyk
vmwyfN/ly1jBIhdybcjkxkzU73+EY8mA586K2A09/j//FH/mz4S6uaCqfEBUBfn8
EvuCpEqpJciJwiAjkn15NEWTnvNMbbTWhUknmsK37wFB8LgvZjd569OfQJbXmQT/
0LxqCXXONigBaWyli98+XAXl37FWf29LmlQasFWjbqkxq/CJj9rfXtAMor3p4nt8
0ZNZvlUIRF7VX+bDhWPbbIt0JS5VyLiW5p4TYtZonKlv3qP4dgRFreb05nOUsaX4
MEJ6gmcCWpNXFCY0gLE3o0yuh5O+c6iuI4mXee0mRzRqUuu/0kyQmz3RF0ypl2g=
=zDIa
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
3217            style.css    77175cb903bd2e1c35a70dcbbbd77052c49a528fe196ea142a72daf540b08176
3829          index.html     24afb2624746ca07b3bfff048c4f26be5bedf0f11d1790ac7e26e1e7b6188865
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