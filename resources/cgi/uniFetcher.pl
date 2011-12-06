#!/usr/bin/perl -W

use strict;
use CGI;
use LWP::UserAgent;
use URI;
use XML::XML2JSON;
#use utf8;

# http://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=uniprotkb&id=A1AG1_HUMAN&format=uniprotxml&style=default&Retrieve=Retrieve
my $EBIBASE = 'http://www.ebi.ac.uk/Tools/dbfetch/dbfetch';
my $cgi = CGI->new();

my $retval = '';
foreach my $paramName ($cgi->param()) {
	next  unless($paramName eq 'id');
	my $id = $cgi->param($paramName);
	
	my($uri)=URI->new($EBIBASE);
	$uri->query_form(
		'db' => 'uniprotkb',
		'id' => $id,
		'format' => 'uniprotxml',
		'style' => 'default',
		'Retrieve' => 'Retrieve'
	);
	my $ua = LWP::UserAgent->new();
	my $response = $ua->get($uri->as_string());
	if($response->is_success()) {
		my $decoded = $response->decoded_content();
		if(index($decoded,'ERROR 12 No entries found.')==-1) {
			my $X = XML::XML2JSON->new(attribute_prefix=>'_at_',content_key=>'_text_');
			eval {
				$retval = $X->convert($response->decoded_content());
			}
		}
	}
	last;
}
print $cgi->header(-content_type=>'application/json',-charset=>'UTF-8');
print $retval;
