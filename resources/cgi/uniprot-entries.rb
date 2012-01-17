#!/usr/local/bin/ruby
=begin
puts "Content-type: text/html"
puts ""
puts "<html>"
puts "<body>"
puts "Test Ruby Page."
puts "<p><h2>It works!!!</h2></p>"
puts "</body>"
puts "</html>"
=end

# load the HTTP related module
require 'net/http'
require 'cgi'


#{
#    "items": [{
#        
#            "entry": "id"
#        ,   "name": "churro",
#        
#            "gens": [
#                "gen1",
#                "gen2"
#            ]
#        ,
#        
#            "cits": [
#                "cit1",
#                "cit2"
#            ]
#        
#    }, {
#        
#            "entry": "id"
#        ,   "name": "churro",
#        
#            "gens": [
#                "gen1",
#                "gen2"
#            ]
#        ,
#        
#            "cits": [
#                "cit1",
#                "cit2"
#            ]
#        
#    }]
#}



def line2json (aLine)
  strJson = "{"
  counter = 0
  tabs = aLine.split("\t")
  
  for part in tabs
    if counter == 0 # entry
      strJson += '"entry":"'+part.strip()+'",'
      
    elsif counter == 1 # protein names
      names = part.split("(")
# print "names: #{names}\n"
      contNames = 0
      strJson += '"names":['
      for protName in names
        bracketIndex = protName.index('[')
        if (bracketIndex != nil) then
          protName = protName.slice(0, bracketIndex-2)
        end
          
        parIndex = protName ? protName.index(')'): nil
        protName = (parIndex != nil)? protName.slice(0, parIndex): protName
        strJson += '"'+protName.strip()+'",' unless protName == nil || protName.length <= 1
      end
      strJson = strJson.slice(0, strJson.length-1) + "],"
#      strJson += '"name":"'+names[0].strip()+'",'
      
        
    elsif counter == 2
      pubmedIds = part.split(";")
      if pubmedIds.length > 0
        strJson += '"pubmed":['
        for pubmedId in pubmedIds
          strJson += pubmedId.strip()+',' unless pubmedId.length <= 1
        end
        strJson = strJson.slice(0, strJson.length-1) + "],"
      end
      
    elsif counter == 4 
      geneNames = part.split(" ")
      strJson += '"genes":['
      for gene in geneNames
        strJson += '"'+gene.strip()+'",'
      end
      strJson = strJson.slice(0, strJson.length-1) + "],"
      
    else
      counter = counter
    end
    counter += 1
    
  end # for
  
  strJson = strJson.slice(0, strJson.length-1) + "},"
end



cgi = CGI.new
term = cgi['target_uuid']
limit = cgi['limit']
start = cgi['start']

# request data via HTTP by utilizing an GET request
# url = URI.parse('http://pfam.sanger.ac.uk/family?output=xml&acc=PF00285')
uniprotUri = 'http://www.uniprot.org/uniprot/?query=organism:9606+AND+xxxx&format=tab&columns=id,protein%20names,citation,comments,genes'
uniprotUri += (limit != nil) ? "&limit=#{limit}": ""
uniprotUri += (start != nil)? "&offset=#{start}": ""
uniprotUri = uniprotUri.sub("xxxx", term)
# url = URI.parse('http://www.uniprot.org/uniprot/?query=organism:9606+AND+xxxx&format=tab&columns=id,protein%20names,citation,comments,genes');
url = URI.parse(uniprotUri)
jsonStr = ""

if term.length >= 3

  req = Net::HTTP::Get.new(url.request_uri)
  res = Net::HTTP.start(url.host, url.port) {|http|
    http.request(req)
  }
  
  lines = res.body.split("\n")
  if lines.length > 0
    jsonStr = '{"items":['
    contLines = 0
    for line in lines
    #  tabs = line.split("\t")
      if contLines > 0
        jsonStr += line2json(line)
      end
      contLines += 1
    # print "jsonStr: #{jsonStr.slice(0, jsonStr.length-1)}"
    end
    jsonStr = jsonStr.slice(0, jsonStr.length-1) + "],"
    jsonStr += '"totalCount":'+ (contLines-1).to_s() + "}"
  end

else
  jsonStr = "{}"
end

cgi.header("type" => "application/json; charset=utf-8")
cgi.out {
  jsonStr
}

# puts "Content-type: application/json; charset=utf-8"
# puts jsonStr
# puts
# puts jsonStr
#data = { name: 'dave', address: [ 'tx', 'usa' ], age: 17 }
#serialized = data.to_json
# print "json: #{serialized}\n"


