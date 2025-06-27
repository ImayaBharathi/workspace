import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createLead, type Lead } from "@/api/leads"
import { useToast } from "@/hooks/useToast"
import { ArrowLeft, Plus, Building2 } from "lucide-react"

export function AddLead() {
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [newLead, setNewLead] = useState({
    brandName: "",
    brandLogo: "",
    collaborationType: "",
    budgetRange: "",
    aiConfidence: 50,
    extractedInfo: {
      industry: "",
      deliverables: [] as string[],
      timeline: "",
      specialRequirements: [] as string[]
    }
  })
  const { toast } = useToast()

  const handleCreateLead = async () => {
    if (!newLead.brandName.trim() || !newLead.collaborationType.trim() || !newLead.budgetRange.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      console.log('Creating new lead...')
      const response = await createLead(newLead)
      const createdLead = (response as any).lead
      
      toast({
        title: "Success",
        description: "Lead created successfully",
      })

      // Navigate to the newly created lead
      navigate(`/leads/${createdLead._id}`)
    } catch (error) {
      console.error('Error creating lead:', error)
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeliverableAdd = (deliverable: string) => {
    if (deliverable.trim() && !newLead.extractedInfo.deliverables.includes(deliverable.trim())) {
      setNewLead(prev => ({
        ...prev,
        extractedInfo: {
          ...prev.extractedInfo,
          deliverables: [...prev.extractedInfo.deliverables, deliverable.trim()]
        }
      }))
    }
  }

  const handleDeliverableRemove = (index: number) => {
    setNewLead(prev => ({
      ...prev,
      extractedInfo: {
        ...prev.extractedInfo,
        deliverables: prev.extractedInfo.deliverables.filter((_, i) => i !== index)
      }
    }))
  }

  const resetForm = () => {
    setNewLead({
      brandName: "",
      brandLogo: "",
      collaborationType: "",
      budgetRange: "",
      aiConfidence: 50,
      extractedInfo: {
        industry: "",
        deliverables: [],
        timeline: "",
        specialRequirements: []
      }
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
            <p className="text-gray-600">Create a new partnership opportunity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Lead Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    placeholder="Enter brand name"
                    value={newLead.brandName}
                    onChange={(e) => setNewLead(prev => ({ ...prev, brandName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandLogo">Brand Logo URL</Label>
                  <Input
                    id="brandLogo"
                    placeholder="https://example.com/logo.png"
                    value={newLead.brandLogo}
                    onChange={(e) => setNewLead(prev => ({ ...prev, brandLogo: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="collaborationType">Collaboration Type *</Label>
                  <Select value={newLead.collaborationType} onValueChange={(value) => setNewLead(prev => ({ ...prev, collaborationType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select collaboration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sponsored Post">Sponsored Post</SelectItem>
                      <SelectItem value="Product Review">Product Review</SelectItem>
                      <SelectItem value="Brand Ambassador">Brand Ambassador</SelectItem>
                      <SelectItem value="Video Content">Video Content</SelectItem>
                      <SelectItem value="Story Features">Story Features</SelectItem>
                      <SelectItem value="Long-term Partnership">Long-term Partnership</SelectItem>
                      <SelectItem value="Event Coverage">Event Coverage</SelectItem>
                      <SelectItem value="Giveaway/Contest">Giveaway/Contest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range *</Label>
                  <Select value={newLead.budgetRange} onValueChange={(value) => setNewLead(prev => ({ ...prev, budgetRange: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                      <SelectItem value="$1,000 - $2,500">$1,000 - $2,500</SelectItem>
                      <SelectItem value="$2,500 - $5,000">$2,500 - $5,000</SelectItem>
                      <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="$10,000+">$10,000+</SelectItem>
                      <SelectItem value="Product Exchange">Product Exchange</SelectItem>
                      <SelectItem value="Negotiable">Negotiable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Fashion, Tech, Food"
                    value={newLead.extractedInfo.industry}
                    onChange={(e) => setNewLead(prev => ({
                      ...prev,
                      extractedInfo: { ...prev.extractedInfo, industry: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 2 weeks, 1 month"
                    value={newLead.extractedInfo.timeline}
                    onChange={(e) => setNewLead(prev => ({
                      ...prev,
                      extractedInfo: { ...prev.extractedInfo, timeline: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables</Label>
                <div className="flex gap-2">
                  <Input
                    id="deliverables"
                    placeholder="Add deliverable and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleDeliverableAdd(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {newLead.extractedInfo.deliverables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newLead.extractedInfo.deliverables.map((deliverable, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleDeliverableRemove(index)}
                      >
                        {deliverable} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiConfidence">AI Confidence (%)</Label>
                <Input
                  id="aiConfidence"
                  type="number"
                  min="0"
                  max="100"
                  value={newLead.aiConfidence}
                  onChange={(e) => setNewLead(prev => ({ ...prev, aiConfidence: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isCreating}
                >
                  Reset Form
                </Button>
                <Button
                  onClick={handleCreateLead}
                  disabled={isCreating}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isCreating ? 'Creating...' : 'Create Lead'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Guide */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Form Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Required Fields</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Brand Name</li>
                  <li>• Collaboration Type</li>
                  <li>• Budget Range</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Deliverables</h4>
                <p className="text-sm text-gray-600">
                  Type a deliverable and press Enter to add it. Click on added deliverables to remove them.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Confidence</h4>
                <p className="text-sm text-gray-600">
                  Set a confidence score (0-100%) for how likely this lead is to convert.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add a brand logo URL for better visual identification</li>
                  <li>• Include industry for better categorization</li>
                  <li>• Specify timeline for project planning</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}