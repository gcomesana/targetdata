#!/usr/local/bin/ruby

require_relative '../lib/gateway'

term = "runx"

uniprotAcc = 'Q13131'
pathId = 'hsa04150'

gateway = Gateway::Gateway.new
jsonCheck = gateway.checkEndpoints()

puts "#{jsonCheck}\n\n"
jsonEntries = gateway.getUniprotEntries (term)
puts "#{jsonEntries}\n\n"
=begin
pathEntries = gateway.getPathwaysEntries(uniprotAcc)
puts "** Pathways:\n#{pathEntries}\n"

pathInfo = gateway.getPathwayInfo(pathId)
puts "** PathInfo:\n#{pathInfo}\n"


stringInfo = gateway.getStringInfo (uniprotAcc)
puts "** STRING:\n#{stringInfo}\n"
=end

# stringImg = gateway.getStringImg ('9606.ENSP00000346148')
#puts "** STRING img URI:\n#{stringImg}\n"
