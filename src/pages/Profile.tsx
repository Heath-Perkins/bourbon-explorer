import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, User, MapPin, Wine, Globe, Twitter, Save, LogOut } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const flavorOptions = [
  "Vanilla", "Caramel", "Oak", "Cinnamon", "Honey",
  "Cherry", "Chocolate", "Tobacco", "Leather", "Spice",
  "Citrus", "Maple", "Nutty", "Floral", "Smoky"
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    favorite_style: profile?.favorite_style || "",
    website: profile?.website || "",
    twitter_handle: profile?.twitter_handle || "",
    flavor_preferences: profile?.flavor_preferences || [],
  });

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        favorite_style: profile.favorite_style || "",
        website: profile.website || "",
        twitter_handle: profile.twitter_handle || "",
        flavor_preferences: profile.flavor_preferences || [],
      });
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      await uploadAvatar(file);
    }
  };

  const toggleFlavor = (flavor: string) => {
    setFormData(prev => ({
      ...prev,
      flavor_preferences: prev.flavor_preferences.includes(flavor)
        ? prev.flavor_preferences.filter(f => f !== flavor)
        : [...prev.flavor_preferences, flavor]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse text-muted-foreground text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold">My Profile</h1>
            <Badge variant={profile?.subscription_tier === 'premium' ? 'default' : 'secondary'}>
              {profile?.subscription_tier === 'premium' ? '✨ Premium' : 'Free'}
            </Badge>
          </div>

          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-secondary">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">Click the photo to change</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="display_name"
                    placeholder="How should we call you?"
                    className="pl-10"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your bourbon journey..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="City, State"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favorite_style">Favorite Style</Label>
                  <div className="relative">
                    <Wine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="favorite_style"
                      placeholder="e.g., High Rye, Wheated"
                      className="pl-10"
                      value={formData.favorite_style}
                      onChange={(e) => setFormData({ ...formData, favorite_style: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    placeholder="@username"
                    className="pl-10"
                    value={formData.twitter_handle}
                    onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flavor Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flavor Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {flavorOptions.map((flavor) => (
                  <Badge
                    key={flavor}
                    variant={formData.flavor_preferences.includes(flavor) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleFlavor(flavor)}
                  >
                    {flavor}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleSave} 
              variant="bourbon" 
              className="gap-2 flex-1"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
