#!/usr/local/bin/ruby

require 'net/http'
require 'uri'
require 'cgi'
# require_relative 'pathways'
# require_relative 'interactions'


# TODO includir las references, pathways y interacciones en clases separadas
module Gateway
class Gateway
  
  CORE_API_URL_83 = "http://ops.few.vu.nl:9183/opsapi"
  CORE_API_URL_84 = "http://ops.few.vu.nl:9184/opsapi"
  CORE_API_URL_85 = "http://ops.few.vu.nl:9185/opsapi"
  CORE_API_URL_86 = "http://ops.few.vu.nl:9186/opsapi"
  CORE_API_URL_87 = "http://ops.few.vu.nl:9187/opsapi"

  RAILS_LOCAL = "http://localhost:3000/"
  LOCALHOST = "http://localhost/"
  
  attr_reader :api_method
  attr_reader :prot_uri
  attr_reader :uniprotEntriesURI
  
  attr_reader :pathway
  attr_reader :interaction
  
  attr_reader :coreApipoints
  
  
  PROTEIN_LOOKUP = 1
  PROTEIN_INFO = 2
  GET_PATHWAYS = 3
  PATHWAY_INFO = 4
  GET_INTERACTION = 5
  CHECK_ENDPOINT = 6
  
  
  def initialize ()
    @coreApiEndpoints = [CORE_API_URL_83, CORE_API_URL_84, CORE_API_URL_85, 
                      	CORE_API_URL_86, CORE_API_URL_87, LOCALHOST]
        
    @api_method = 'proteinInfo'
    @prot_uri = 'http://chem2bio2rdf.org/chembl/resource/chembl_targets/12261'
    @uniprotEntriesURI = 'http://www.uniprot.org/uniprot/?query=organism:9606+AND+xxxx&format=tab&columns=id,protein%20names,citation,comments,genes'
  
  	@protLookupURI = "http://staging.conceptwiki.org/web-ws/concept/search/byTag?q=xxxx&uuid=eeaec894-d856-4106-9fa1-662b1dc6c6f1"

  	@pathway = Pathways.new
  	@interaction = Interactions.new
  end
  
  
  

# Check the endpoints as defined at coreApiEndpoints member
# 
# @return [String] a string describing a JSON object with the result of the 
# endpoint pings.
  def checkEndpoints ()
    options = Hash.new
    options[:uri] =  '<' + @prot_uri + '>'
    options[:limit] =  1
    options[:offset] = 0
    options[:method] = @api_method

    alive = 0
    lastEndpoint = ""
    @coreApiEndpoints.each do |endpoint|
    puts "Checking #{endpoint}"
      lastEndpoint = endpoint
      alive = checkEndpoint(endpoint, options)
      break alive if alive != -1 && alive != -2 && alive != -3
    end

		jsonStr = ""
    if alive < 0 then
      jsonStr = '{"response_code":'+alive.to_s+',"endpoint":"localhost"}'
    else
      jsonStr = '{"response_code":' + alive.to_s + ', "endpoint":"'+ lastEndpoint +'"}'
    end
#    puts "#{jsonStr}\n"
		jsonStr
  end
  
  
  
  
# Get the uniprot entries based on terms
# 
# @param [String, #read] term, a minimun 3 letter word/term
# @return [String] a string shaped like JSON array with information on 
# the entries retrieved from the parameter term  
  def getUniprotEntries (term)
    uniprotUri = @uniprotEntriesURI.sub("xxxx", term)
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
    jsonStr
  end # EO getUniprotEntries
  
  
 
 	def opsProteinLookup (term) 
		opsUri = @protLookupURI.sub("xxxx", term)
    # url = URI.parse('http://www.uniprot.org/uniprot/?query=organism:9606+AND+xxxx&format=tab&columns=id,protein%20names,citation,comments,genes');
    url = URI.parse(opsUri)
    jsonStr = ""

    if term.length >= 3

      req = Net::HTTP::Get.new(url.request_uri)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      
    end

 	end
  
  
  
# Interface method to get from Pathways class the pathways ids from an
# Uniprot protein id (e.g. protein:Q13131)

# @param [String, #read] term, the protein id
# @returns [String], a JSON string with the pathways retrieved
	def getPathwaysEntries (term)
		jsonEntries = @pathway.getPathways(term)
		
		jsonEntries
	end
	
	
	
	def getPathwayInfo (pathId)
		pathJsonInfo = @pathway.getPathwayInfo (pathId)
		
		pathJsonInfo
	end  
  
  
  
  def getStringInfo (term) 
   	jsonString = @interaction.getInteractions(term)
  	
  	jsonString
  end
  
  
  def getStringImg (stringId)
  	imgURI = @interaction.getInteractionImg (stringId)
  	
  	imgURI
  end


  
### PRIVATE METHODS ##########################################################  
  private
    
# Checks if the endpoint addrs is working 
# 
# @param [String, #read] addrs the URL of the endpoint 
# @return [int] the response code for the request to addrs
    def checkEndpoint (addrs, opts)
      uri = URI.parse (addrs)
      myHttp = Net::HTTP.new(uri.host, uri.port)
      request = Net::HTTP::Post.new(uri.request_uri)
      request["Content-Type"] = "application/json"

    #  puts "Setting form data..."
      request.set_form_data(opts)
    # print "And POSTing request...#{uri.host} vs #{uri.port} vs uri: #{uri}\n"
      response = Net::HTTP::post_form(uri, opts)

      rescue Timeout::Error => exc
        puts "ERROR: #{exc.message}"
        -1
      rescue Errno::ETIMEDOUT => exc
        puts "ERROR: #{exc.message}"
        -2

      rescue Errno::ECONNREFUSED => exc
        puts "ERROR: #{exc.message}"
        -3

      else
    #    puts "Response is..."
    #    puts response.code.to_i
        response.code.to_i
    end # EO checkEndpoint
  
  
  
# Transform a tab separated values line got from uniprot for a term
#
# @param [String, #read] aLine the tab separated values ended with \n
# @return [String] a string shaped like a custom JSON object  
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
    end # EO line2json

  end # EO class


  class Interactions

		def initialize ()
			@stringUri = STRING_INFO_URI
			@stringImgUri = STRING_IMG_URI
		end		
		
		
		
# Get information about the interactions of the target represented by 
# uniprotAcc from STRING database
#
# @param [String, #read] uniprotAcc, the uniprot accession
# @return [String] a JSON string with the information of interactions
		def getInteractions (uniprotAcc)
			@stringUri = @stringUri.sub("xxxx", uniprotAcc)

			url = URI.parse(@stringUri)
			jsonStr = nil
			
			req = Net::HTTP::Get.new(url.request_uri)
			res = Net::HTTP.start(url.host, url.port) {|http|
			  http.request(req)
			}
			
			jsonStr = res.body
		end
		
		
		
# Get the image for requested interaction from STRING
#
# @param [String, #read] paramId, the identifier to get the image
# @return [String] the URI for the requested image
		def getInteractionImg (stringId)
			@stringImgUri = @stringImgUri.sub("xxxx", stringId)

			url = URI.parse(@stringImgUri)
			jsonStr = nil
			
			req = Net::HTTP::Get.new(url.request_uri)
			res = Net::HTTP.start(url.host, url.port) {|http|
			  http.request(req)
			}
			
			jsonStr = res.body
		end		
		
		
		
	private
		:stringUri
		:stringImgUri
		
		STRING_INFO_URI = "http://string-db.org/api/json/resolve?identifier=xxxx&species=9606"
		STRING_IMG_URI = "http://string-db.org/api/image/network?identifier=xxxx&required_score=950&limit=10&network_flavor=evidence"
		
	end # EO class
	
	
	
	class Pathways
		
		
		def initialize ()
			@rbbtReqUri = RBBT_GET_PATHWAY_URI
			@rbbtInfoUri = RBBT_INFO_PATHWAY_URI
		end
		
		
		
# Get the pathways ids from RBBT based on Uniprot protein 
# identifier (e.g. protein:Q13131)
# 
# @param [String, #read] the protein Uniprot identifier
# @return [String] a string shaped like JSON array with information on 
# the entries retrieved from the parameter term		
		def getPathways (term)
			@rbbtReqUri = @rbbtReqUri.sub("xxxx", term)

			url = URI.parse(@rbbtReqUri)
			jsonStr = nil
			
			req = Net::HTTP::Get.new(url.request_uri)
			res = Net::HTTP.start(url.host, url.port) {|http|
			  http.request(req)
			}
			
			if (res.code == "500")
			  jsonStr = "[]"
			
			else
			  if res.body == "null"
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
			  
			end			
			
			jsonStr
		end # EO getPathways	
	
	
	
# Get information for the pathway
#
# @param [String, #read] the KEGG pathway identifier (e.g. pathway:hsa04150)
# @return [String], a JSON string with the information for the requested pathway
		def getPathwayInfo (pathId)
			@rbbtInfoUri = @rbbtInfoUri.sub("xxxx", pathId)

			url = URI.parse(@rbbtInfoUri)
			jsonStr = nil
			
			req = Net::HTTP::Get.new(url.request_uri)
			res = Net::HTTP.start(url.host, url.port) { |http|
			  http.request(req)
			}
			
			if (res.code == "500")
			  jsonStr = "{}"
			else
			  jsonStr = res.body
			end
			
			jsonStr
		end
		
		
		
	
### PRIVATE MEMBERS ##########################################################		
	private	
		:rbbtReqUri
		:rbbtInfoUri
		
		RBBT_GET_PATHWAY_URI = "http://rbbt.bioinfo.cnio.es:1988/OPS/get_gene_kegg_pathways?gene=xxxx&organism=Hsa&_format=json"
		RBBT_INFO_PATHWAY_URI = "http://rbbt.bioinfo.cnio.es:1988/OPS/kegg_pathway_info?pathway=xxxx&_format=json"
		
	end # EO CLASS
end # EO module


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

