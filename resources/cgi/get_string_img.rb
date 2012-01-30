#!/usr/local/bin/ruby

require 'net/http'
require 'cgi'


cgi = CGI.new
term = cgi['ensemblId']

# request data via HTTP by utilizing an GET request
# url = URI.parse('http://pfam.sanger.ac.uk/family?output=xml&acc=PF00285')
stringUri = 'http://string-db.org/api/image/network?identifier=xxxx&required_score=950&limit=10&network_flavor=evidence'
stringUri = stringUri.sub("xxxx", term)

url = URI.parse(stringUri)
jsonStr = nil

req = Net::HTTP::Get.new(url.request_uri)
res = Net::HTTP.start(url.host, url.port) {|http|
  http.request(req)
}


jsonStr = res.body
# puts jsonStr

cgi.header("type" => "application/json; charset=utf-8")
cgi.out {
  jsonStr
}
  
