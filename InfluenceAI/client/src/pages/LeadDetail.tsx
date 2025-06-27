import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLeadById, updateLeadStatus, respondToLead, type Lead } from "@/api/leads"
import { getTemplates, type Template } from "@/api/templates"
import { useToast } from "@/hooks/useToast"
import { ArrowLeft, Send, CheckCircle, XCircle, Clock, MessageSquare, Brain, Building, Calendar, DollarSign, RefreshCw } from "lucide-react"

export function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        console.log('Fetching lead details and templates...')
        const [leadResponse, templatesResponse] = await Promise.all([
          getLeadById(id),
          getTemplates()
        ])

        setLead((leadResponse as any).lead)
        setTemplates((templatesResponse as any).templates)
        console.log('Lead details loaded successfully')
      } catch (error) {
        console.error('Error fetching lead details:', error)
        toast({
          title: "Error",
          description: "Failed to load lead details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!lead) return

    try {
      console.log(`Updating lead status to: ${newStatus}`)
      await updateLeadStatus(lead._id, newStatus)
      setLead({ ...lead, status: newStatus as any })
      toast({
        title: "Success",
        description: "Lead status updated successfully",
      })
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      })
    }
  }

  const handleSendResponse = async () => {
    if (!lead || !responseText.trim()) return

    setSending(true)
    try {
      console.log('Sending response to lead...')
      await respondToLead(lead._id, responseText, selectedTemplate || undefined)
      toast({
        title: "Success",
        description: "Response sent successfully",
      })
      setResponseText("")
      setSelectedTemplate("")
    } catch (error) {
      console.error('Error sending response:', error)
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleRefreshConversation = async () => {
    if (!id) return

    setRefreshing(true)
    try {
      console.log('Refreshing conversation...')
      const response = await getLeadById(id)
      setLead((response as any).lead)
      toast({
        title: "Success",
        description: "Conversation refreshed",
      })
    } catch (error) {
      console.error('Error refreshing conversation:', error)
      toast({
        title: "Error",
        description: "Failed to refresh conversation",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const replaceTemplateVariables = (content: string, lead: Lead) => {
    let replacedContent = content
    
    // Replace common variables
    replacedContent = replacedContent.replace(/\{brand_name\}/g, lead.brandName)
    replacedContent = replacedContent.replace(/\{collaboration_type\}/g, lead.collaborationType)
    replacedContent = replacedContent.replace(/\{budget_range\}/g, lead.budgetRange)
    
    // Add rate card info for rate card templates
    if (content.includes('{rate_card}')) {
      const rateCardInfo = `
📋 My Rate Card:
• Instagram Post: $500-1,000
• Instagram Story (3 slides): $300-500
• Instagram Reel: $800-1,200
• TikTok Video: $600-1,000
• YouTube Integration: $1,500-2,500
• Long-term Partnership: Custom pricing available

Package deals and bulk collaborations are available with discounts.`
      
      replacedContent = replacedContent.replace(/\{rate_card\}/g, rateCardInfo)
    }
    
    return replacedContent
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t._id === templateId)
    if (template && lead) {
      setSelectedTemplate(templateId)
      const processedContent = replaceTemplateVariables(template.content, lead)
      setResponseText(processedContent)
    }
  }

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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead not found</h2>
        <Button onClick={() => navigate('/leads')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Leads
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/leads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.brandName}</h1>
            <p className="text-gray-600">{lead.collaborationType}</p>
          </div>
        </div>
        <Badge className={getStatusColor(lead.status)}>
          {lead.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversation */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Conversation</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshConversation}
                  disabled={refreshing}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {lead.messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender === 'influencer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'influencer'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'influencer' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Send Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template._id} value={template._id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Type your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResponseText("")
                    setSelectedTemplate("")
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim() || sending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Response'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Lead Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Brand</label>
                <p className="text-lg font-semibold">{lead.brandName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Collaboration Type</label>
                <p>{lead.collaborationType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Budget Range</label>
                <p className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {lead.budgetRange}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Activity</label>
                <p className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTimestamp(lead.lastActivity)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Confidence Score</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${lead.aiConfidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{lead.aiConfidence}%</span>
                </div>
              </div>
              {lead.extractedInfo.industry && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Industry</label>
                  <p>{lead.extractedInfo.industry}</p>
                </div>
              )}
              {lead.extractedInfo.timeline && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Timeline</label>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {lead.extractedInfo.timeline}
                  </p>
                </div>
              )}
              {lead.extractedInfo.deliverables && lead.extractedInfo.deliverables.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Deliverables</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lead.extractedInfo.deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.extractedInfo.specialRequirements && lead.extractedInfo.specialRequirements.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Special Requirements</label>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    {lead.extractedInfo.specialRequirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleStatusUpdate('qualified')}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={lead.status === 'qualified'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Qualified
              </Button>
              <Button
                onClick={() => handleStatusUpdate('negotiating')}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                disabled={lead.status === 'negotiating'}
              >
                <Clock className="h-4 w-4 mr-2" />
                Start Negotiation
              </Button>
              <Button
                onClick={() => handleStatusUpdate('accepted')}
                className="w-full bg-purple-500 hover:bg-purple-600"
                disabled={lead.status === 'accepted'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Deal
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                disabled={lead.status === 'rejected'}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}