import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getLeadById, addMessageToLead, type Lead, type Message } from "@/api/leads"
import { useToast } from "@/hooks/useToast"
import { ArrowLeft, Send, MessageSquare, User, Building2, Plus } from "lucide-react"

export function ConversationManager() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [messageSender, setMessageSender] = useState<"brand" | "influencer">("brand")
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return

      try {
        console.log('Fetching lead details for conversation manager...')
        const response = await getLeadById(id)
        setLead((response as any).lead)
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

    fetchLead()
  }, [id, toast])

  const handleAddMessage = async () => {
    if (!lead || !newMessage.trim()) return

    setSending(true)
    try {
      console.log('Adding new message to lead...')
      
      const newMessageObj: Omit<Message, '_id'> = {
        sender: messageSender,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: true
      }

      const response = await addMessageToLead(lead._id, newMessageObj)
      const updatedLead = (response as any).lead
      setLead(updatedLead)
      setNewMessage("")
      
      toast({
        title: "Success",
        description: "Message added successfully",
      })
    } catch (error) {
      console.error('Error adding message:', error)
      toast({
        title: "Error",
        description: "Failed to add message",
        variant: "destructive",
      })
    } finally {
      setSending(false)
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
        <div className="grid gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
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
          <Button variant="ghost" onClick={() => navigate(`/leads/${lead._id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lead Details
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversation Manager</h1>
            <p className="text-gray-600">{lead.brandName} - {lead.collaborationType}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white">
          {lead.messages.length} messages
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Display */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Current Conversation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {lead.messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Add the first message below.</p>
                  </div>
                ) : (
                  lead.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'influencer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'influencer'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.sender === 'influencer' ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Building2 className="h-3 w-3" />
                          )}
                          <span className="text-xs font-medium capitalize">
                            {message.sender}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'influencer' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Message Form */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sender">Message From</Label>
                <Select value={messageSender} onValueChange={(value) => setMessageSender(value as "brand" | "influencer")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" />
                        <span>Brand</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="influencer">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Influencer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder="Type the message content..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setNewMessage("")}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleAddMessage}
                  disabled={!newMessage.trim() || sending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Adding...' : 'Add Message'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lead Info Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Lead Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Brand</label>
                <p className="font-semibold">{lead.brandName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p>{lead.collaborationType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Budget</label>
                <p>{lead.budgetRange}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <Badge className={`
                  ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                  ${lead.status === 'qualified' ? 'bg-green-100 text-green-800' : ''}
                  ${lead.status === 'negotiating' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${lead.status === 'accepted' ? 'bg-purple-100 text-purple-800' : ''}
                  ${lead.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {lead.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}