import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/useToast"
import { User, Bell, Brain, Instagram, Shield, Palette } from "lucide-react"
import { getInfluencerProfile, createOrUpdateInfluencerProfile, InfluencerProfile } from "@/api/influencer"

export function Settings() {
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    followers: "",
    niche: "",
    location: ""
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyDigest: true,
    highValueOpportunities: true,
    responseReminders: true
  })

  const [aiSettings, setAiSettings] = useState({
    minBudget: [1000],
    responseDelay: "1hour",
    autoQualify: true,
    confidenceThreshold: [75],
    preferredCollaborations: ["sponsored-post", "story-campaign"]
  })

  const [rateCard, setRateCard] = useState({
    sponsoredPost: "0",
    storyPost: "0",
    reelPost: "0",
    productReview: "0",
    longTermPartnership: "0"
  })

  // Load influencer profile on component mount
  useEffect(() => {
    loadInfluencerProfile()
  }, [])

  const loadInfluencerProfile = async () => {
    try {
      setProfileLoading(true)
      const response = await getInfluencerProfile()
      const profileData = response.data

      setProfile({
        name: profileData.influencerProfile?.name || "",
        email: profileData.email || "",
        bio: profileData.influencerProfile?.bio || "",
        followers: profileData.influencerProfile?.followerCount?.toString() || "",
        niche: profileData.influencerProfile?.niche || "",
        location: profileData.influencerProfile?.location || ""
      })

      if (profileData.influencerProfile?.rates) {
        setRateCard({
          sponsoredPost: profileData.influencerProfile.rates.sponsoredPost?.toString() || "0",
          storyPost: profileData.influencerProfile.rates.storyPost?.toString() || "0",
          reelPost: profileData.influencerProfile.rates.reelPost?.toString() || "0",
          productReview: profileData.influencerProfile.rates.productReview?.toString() || "0",
          longTermPartnership: profileData.influencerProfile.rates.longTermPartnership?.toString() || "0"
        })
      }
    } catch (error: any) {
      console.error('Error loading profile:', error)
      // Don't show error toast for new users who don't have a profile yet
      if (!error.message.includes('User not found')) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const profileData = {
        name: profile.name,
        bio: profile.bio,
        niche: profile.niche,
        followerCount: parseInt(profile.followers) || 0,
        location: profile.location,
        rates: {
          sponsoredPost: parseInt(rateCard.sponsoredPost) || 0,
          storyPost: parseInt(rateCard.storyPost) || 0,
          reelPost: parseInt(rateCard.reelPost) || 0,
          productReview: parseInt(rateCard.productReview) || 0,
          longTermPartnership: parseInt(rateCard.longTermPartnership) || 0,
        }
      }

      await createOrUpdateInfluencerProfile(profileData)

      toast({
        title: "Success",
        description: "Profile settings saved successfully",
      })
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      console.log('Saving notification settings...')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      })
    } catch (error) {
      console.error('Error saving notifications:', error)
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAI = async () => {
    setLoading(true)
    try {
      console.log('Saving AI settings...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "AI settings saved successfully",
      })
    } catch (error) {
      console.error('Error saving AI settings:', error)
      toast({
        title: "Error",
        description: "Failed to save AI settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRates = async () => {
    await handleSaveProfile() // Rate card is now part of the profile
  }

  const collaborationTypes = [
    { value: "sponsored-post", label: "Sponsored Post" },
    { value: "story-campaign", label: "Story Campaign" },
    { value: "reel-post", label: "Reel Post" },
    { value: "product-review", label: "Product Review" },
    { value: "brand-ambassador", label: "Brand Ambassador" },
    { value: "event-coverage", label: "Event Coverage" }
  ]

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and AI configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Followers</label>
                <Input
                  type="number"
                  value={profile.followers}
                  onChange={(e) => setProfile({ ...profile, followers: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Niche *</label>
                <Input
                  value={profile.niche}
                  onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={loading || !profile.niche}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-gray-600">Receive email notifications for new leads</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600">Get instant push notifications</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-gray-600">Weekly summary of your activity</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">High-Value Opportunities</p>
                <p className="text-sm text-gray-600">Alert for high-budget partnerships</p>
              </div>
              <Switch
                checked={notifications.highValueOpportunities}
                onCheckedChange={(checked) => setNotifications({ ...notifications, highValueOpportunities: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Response Reminders</p>
                <p className="text-sm text-gray-600">Reminders for pending responses</p>
              </div>
              <Switch
                checked={notifications.responseReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, responseReminders: checked })}
              />
            </div>
            <Button
              onClick={handleSaveNotifications}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Minimum Budget Threshold: ${aiSettings.minBudget[0]}
              </label>
              <Slider
                value={aiSettings.minBudget}
                onValueChange={(value) => setAiSettings({ ...aiSettings, minBudget: value })}
                max={10000}
                min={100}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100</span>
                <span>$10,000</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Response Delay</label>
              <Select value={aiSettings.responseDelay} onValueChange={(value) => setAiSettings({ ...aiSettings, responseDelay: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="1hour">1 Hour</SelectItem>
                  <SelectItem value="4hours">4 Hours</SelectItem>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                AI Confidence Threshold: {aiSettings.confidenceThreshold[0]}%
              </label>
              <Slider
                value={aiSettings.confidenceThreshold}
                onValueChange={(value) => setAiSettings({ ...aiSettings, confidenceThreshold: value })}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Qualify Leads</p>
                <p className="text-sm text-gray-600">Automatically qualify obvious partnerships</p>
              </div>
              <Switch
                checked={aiSettings.autoQualify}
                onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoQualify: checked })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Collaboration Types</label>
              <div className="flex flex-wrap gap-2">
                {collaborationTypes.map((type) => (
                  <Badge
                    key={type.value}
                    variant={aiSettings.preferredCollaborations.includes(type.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const updated = aiSettings.preferredCollaborations.includes(type.value)
                        ? aiSettings.preferredCollaborations.filter(t => t !== type.value)
                        : [...aiSettings.preferredCollaborations, type.value]
                      setAiSettings({ ...aiSettings, preferredCollaborations: updated })
                    }}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSaveAI}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              Save AI Settings
            </Button>
          </CardContent>
        </Card>

        {/* Rate Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Rate Card</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Sponsored Post</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={rateCard.sponsoredPost}
                  onChange={(e) => setRateCard({ ...rateCard, sponsoredPost: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Story Post</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={rateCard.storyPost}
                  onChange={(e) => setRateCard({ ...rateCard, storyPost: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reel Post</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={rateCard.reelPost}
                  onChange={(e) => setRateCard({ ...rateCard, reelPost: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Product Review</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={rateCard.productReview}
                  onChange={(e) => setRateCard({ ...rateCard, productReview: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Long-term Partnership</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={rateCard.longTermPartnership}
                  onChange={(e) => setRateCard({ ...rateCard, longTermPartnership: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveRates}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              Save Rate Card
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instagram Integration */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Instagram className="h-5 w-5" />
            <span>Instagram Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Instagram Connected</p>
                <p className="text-sm text-gray-600">@sarahjohnson_style • {profile.followers || '0'} followers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
              <Button variant="outline" size="sm">
                Reconnect
              </Button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Privacy & Security</p>
                <p className="text-sm text-blue-700 mt-1">
                  Your Instagram data is encrypted and only used to analyze partnership opportunities.
                  We never post on your behalf or access your personal messages.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}