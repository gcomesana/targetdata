

require 'net/http'


module Gateway
	
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
	
end # EO module	