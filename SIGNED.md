##### Signed by https://keybase.io/alistairjcbrown
```
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.14 (GNU/Linux)

iQEcBAABAgAGBQJTlk7sAAoJEJEOHi8Q7zzzBSsH/0O5nou4mZK4+gBl4mYxoBs+
xMpovTvJtCugmk8YhK6sm1+eS3l4ZhGAaaOmvlhiaeW1+fXJn8HGiWpCCUoUSdGv
Otw2aH7fff5zj2YzmreLusVoyVdUuiPu0wT27EOs74jWNHDPDn8k+PJ9TLmmcgyz
7A8O7RPFeRGQEVfr5xh+lgbkljDr6lXE7aRHlGg4knVzt9HC/ijAd7Mb44mSMjBy
r7bfm5UV6a2yhNHdSGD/+L8lH341u8RQS+KMQoH0CJbc1PIN4m0I7PZtExMJRHRK
feFrLHhSjgUyiv+1zQ/NjQrVUT2JxGyKuNalQKC6NUh17LeTCR/UVm5ny9QkIHY=
=S1/g
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
4198            style.css    1fee2e3a7cedba3e1e7b753529e19ecd707a5a75d268c6f50d27792559ecbb97
              images/                                                                        
2365            arrow.svg    0cbc32f9d994b150657e14708f04d96229e65b66836bfd7d30a5f18adbf35295
6544          index.html     1fe610cb39b772302497d90b102251659e6370be7787b132b7606d933e20fe9a
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