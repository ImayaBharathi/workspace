import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLeads, type Lead } from "@/api/leads"
import { useToast } from "@/hooks/useToast"
import { Search, Filter, Eye, Clock, DollarSign, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log('Fetching leads...')
        const response = await getLeads()
        setLeads((response as any).leads)
        setFilteredLeads((response as any).leads)
        console.log('Leads loaded successfully')
      } catch (error) {
        console.error('Error fetching leads:', error)
        toast({
          title: "Error",
          description: "Failed to load leads",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [toast])

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.collaborationType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    if (budgetFilter !== "all") {
      filtered = filtered.filter(lead => {
        const budget = lead.budgetRange.toLowerCase()
        switch (budgetFilter) {
          case "low": return budget.includes("500") && !budget.includes("2k")
          case "medium": return budget.includes("2k") || budget.includes("2,000")
          case "high": return budget.includes("5k") || budget.includes("5,000") || budget.includes("+")
          default: return true
        }
      })
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter, budgetFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200'
      case 'negotiating': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'accepted': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partnership Leads</h1>
          <p className="text-gray-600">Manage your brand collaboration opportunities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-white">
            {filteredLeads.length} leads
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by brand name or collaboration type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="low">Under $1K</SelectItem>
                <SelectItem value="medium">$1K - $5K</SelectItem>
                <SelectItem value="high">$5K+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {lead.brandLogo && (
                    <img 
                      src={lead.brandLogo} 
                      alt={lead.brandName}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{lead.brandName}</h3>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{lead.collaborationType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{lead.budgetRange}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimeAgo(lead.lastActivity)}</span>
                      </div>
                    </div>
                    {lead.extractedInfo.deliverables && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {lead.extractedInfo.deliverables.slice(0, 3).map((deliverable, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                          {lead.extractedInfo.deliverables.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.extractedInfo.deliverables.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">AI Confidence</div>
                    <div className={`text-lg font-semibold ${getConfidenceColor(lead.aiConfidence)}`}>
                      {lead.aiConfidence}%
                    </div>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Link to={`/leads/${lead._id}`} className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && !loading && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}