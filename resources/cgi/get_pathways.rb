#!/usr/local/bin/ruby

require 'net/http'
require 'cgi'



cgi = CGI.new
term = cgi['protein']
organism = 'Hsa'
format = "json"

# request data via HTTP by utilizing an GET request
# url = URI.parse('http://pfam.sanger.ac.uk/family?output=xml&acc=PF00285')
keggReqUri = 'http://rbbt.bioinfo.cnio.es:1988/OPS/get_protein_kegg_pathways?protein=xxxx&organism=Hsa&_format=json'
keggReqUri = keggReqUri.sub("xxxx", term)

url = URI.parse(keggReqUri)
jsonStr = nil

req = Net::HTTP::Get.new(url.request_uri)
res = Net::HTTP.start(url.host, url.port) {|http|
  http.request(req)
}

if (res.code == "500")
  jsonStr = "[]"

else
  jsonAux = res.body
  jsonAux = jsonAux.slice(1, jsonAux.length-1)
  paths = jsonAux.split(",")
  jsonStr = "["
  for path in paths
    jsonStr += '['+ path +'],'
  end
#  jsonStr = jsonStr.slice(0, jsonStr.length-1) + "]"
  jsonStr = jsonStr.slice(0, jsonStr.length-1)
  
end

cgi.header("type" => "application/json; charset=utf-8")
cgi.out {
  jsonStr
}
  
