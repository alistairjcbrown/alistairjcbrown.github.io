##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTi6luAAoJEJEOHi8Q7zzzmdMH/0MVhSG0WPkmUsQShSBClutD
SIti2gyKiTJeR0F9v6XU/zrX5TTfxPp3yEVpDt6z2w2GPOcqsHqOmT1Wdfg2YhwM
685nN1it5xouIE2PZlkrnDHCalMIihSopDVIjOd55cCJCg6GL1BpXXgFENE49v9S
Vk+em8ctTPpUIjV47QXxolZChGG5oUuDmgsCY3U9Tq5Zs0dYbCdklr8iRaVxAuRE
urev//atp8jAB3qun6AGydREtLc6r45FkLw3UhfnZCcoaHawWrMPh52g+zZ2iAT+
RVe4iYQfmZ31dAHKf5W4cgFUQFKfpaU8Y6IMglto3FKemxsFM7VAfI5VDnsR8OA=
=2xD2
-----END PGP SIGNATURE-----

```

<!-- END SIGNATURES -->

### Begin signed statement 

#### Expect

```
size  exec  file             contents                                                        
            ./                                                                               
325           .htaccess      d32419b4aa7534790817455b4511e40d014e4d2d23f4cc2f67e697361d927bf4
              .well-known/                                                                   
3000            keybase.txt  01b4a0109d6d816ed6ddf788c9bb5eab7d7b69939dce10c3aeec7b1c7a8f1e04
85            README.md      4bbf7a01604798c4cceec972420ce0e9fa9b88da482fd7855c3bf52a25ba76f9
              css/                                                                           
1098            reset.css    f96b44c7b969277b79410066c40296ed729b95c6173625b677326736363b7775
3074            style.css    e3c3076c418ec4a8136a4f22b1fde75fffc4ca81fbb2bcd4642bdfb947b13390
3324          index.html     3317f05a4da84e6e2df0a1426af343d40a31c7a92bb7b60b6ba1c59084a7d9ed
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