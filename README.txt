Target Dossier lashup development
In order to install, just drop the files in resources/cgi into the cgi-bin directory of your web server and be sure they work. To do that, the following commands can be a good try:

[$ cd cgi-bin]
$ ./get_pathways.rb protein=CDK5 |less
$ ./string-resolve.rb uniprotAcc=P62258
$ ./uniFetcher.pl id=Q6IAW3 |less
$ ./pathway_info.rb pathway=hsa05010

Then, if the commands above work, drop the rest of files in whatever directory inside your webserver and it should be done.
