#!/usr/local/bin/ruby

require 'net/http'
require 'cgi'
require_relative '../lib/gateway'

# cgi = CGI.new
# puts cgi.header
# puts "<html><body>This is a Ruby::CGItest</body></html>"

# puts "crap\n"

cgi = CGI.new
what = cgi['what'].to_i # what is what this is to do
endpoint = cgi['ep'] # suppossedly 

cgiGateway = Gateway::Gateway.new
jsonRes = ''
case what
when Gateway::Gateway::PROTEIN_LOOKUP
#	puts ("proteinLookup")
	term = cgi['target_uuid']
	jsonRes = cgiGateway.getUniprotEntries (term)
	
when Gateway::Gateway::PROTEIN_INFO
	puts ("proteinInfo")
	
when Gateway::Gateway::PATHWAY_INFO
#	puts ("pathwayInfo")
  term = cgi['pathway']
  jsonRes = cgiGateway.getPathwayInfo (term)
	
when Gateway::Gateway::GET_PATHWAYS
#	puts ("getPathways")
  term = cgi['protein']
  jsonRes = cgiGateway.getPathwaysEntries (term)
	
when Gateway::Gateway::GET_INTERACTION
#	puts ("getInteractions")
	term = cgi['uniprotAcc']
	jsonRes = cgiGateway.getStringInfo (term)
	
	
else # Gateway::Gateway::CHECK_ENDPOINT
#	puts "lets checks the endpoint"
	jsonRes = cgiGateway.checkEndpoints()
	
end

cgi.header("type" => "application/json; charset=utf-8")
cgi.out {
  jsonRes
}
	