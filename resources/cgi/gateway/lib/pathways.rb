

require 'net/http'

module Gateway
	
# Class Pathways
# Fetches the pathways from Kegg by ajax requesting	
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
		
	end
end