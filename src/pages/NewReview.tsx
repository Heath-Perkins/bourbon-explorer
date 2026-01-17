import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Share2, Check, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/StarRating";
import { ColorPicker } from "@/components/ColorPicker";
import { FlavorSelector } from "@/components/FlavorSelector";
import { PhotoUpload } from "@/components/PhotoUpload";
import { bourbons } from "@/data/bourbons";
import { glasswareOptions } from "@/data/reviews";
import { useTastingNotes } from "@/hooks/useTastingNotes";
import { toast } from "sonner";

export default function NewReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedBourbonId = searchParams.get("bourbon");
  const { addNote } = useTastingNotes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bourbonMode, setBourbonMode] = useState<"library" | "custom">(
    preselectedBourbonId ? "library" : "library"
  );

  const [formData, setFormData] = useState({
    bourbonId: preselectedBourbonId || "",
    visibleColor: "#CD853F",
    bouquet: "",
    taste: "",
    finish: "",
    overallThoughts: "",
    discernibleFlavors: [] as string[],
    rating: 0,
    location: "",
    glassware: "",
    waterAdded: false,
    iceAdded: false,
    photos: [] as string[],
  });

  const [customBourbon, setCustomBourbon] = useState({
    name: "",
    distillery: "",
    proof: "",
    age: "",
    origin: "",
    mashBill: "",
  });

  const selectedBourbon = bourbons.find(b => b.id === formData.bourbonId);

  const getBourbonName = () => {
    if (bourbonMode === "library" && selectedBourbon) {
      return selectedBourbon.name;
    }
    return customBourbon.name || "My Bourbon";
  };

  const getBourbonId = () => {
    if (bourbonMode === "library" && selectedBourbon) {
      return selectedBourbon.id;
    }
    // For custom bourbons, create a unique ID
    return `custom-${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bourbonMode === "library" && !formData.bourbonId) {
      toast.error("Please select a bourbon");
      return;
    }
    
    if (bourbonMode === "custom" && !customBourbon.name.trim()) {
      toast.error("Please enter the bourbon name");
      return;
    }
    
    if (formData.rating === 0) {
      toast.error("Please add a rating");
      return;
    }

    setIsSubmitting(true);

    const { error } = await addNote({
      bourbon_id: getBourbonId(),
      bourbon_name: getBourbonName(),
      visible_color: formData.visibleColor,
      bouquet: formData.bouquet || null,
      taste: formData.taste || null,
      finish: formData.finish || null,
      overall_thoughts: formData.overallThoughts || null,
      discernible_flavors: formData.discernibleFlavors,
      rating: formData.rating,
      location: formData.location || null,
      glassware: formData.glassware || null,
      water_added: formData.waterAdded,
      ice_added: formData.iceAdded,
      photo_url: formData.photos[0] || null,
    });

    setIsSubmitting(false);

    if (!error) {
      toast.success("Tasting note saved!", {
        description: `Your review for ${getBourbonName()} has been added to your diary.`
      });
      navigate("/diary");
    }
  };

  const handleShare = () => {
    const bourbonName = getBourbonName();
    if (navigator.share) {
      navigator.share({
        title: `Bourbon Tasting: ${bourbonName}`,
        text: formData.overallThoughts || "Check out my bourbon tasting notes!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🥃 Bourbon Tasting: ${bourbonName}\n⭐ Rating: ${formData.rating}/5\n💭 ${formData.overallThoughts}`
      );
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">New Tasting Note</h1>
            <p className="text-muted-foreground">
              Document your bourbon experience with detailed tasting notes.
            </p>
          </div>

          {/* Bourbon Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Bourbon</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={bourbonMode} onValueChange={(v) => setBourbonMode(v as "library" | "custom")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="library">From Library</TabsTrigger>
                  <TabsTrigger value="custom" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Custom Entry
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="library" className="mt-0">
                  <Select 
                    value={formData.bourbonId} 
                    onValueChange={(value) => setFormData({ ...formData, bourbonId: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a bourbon..." />
                    </SelectTrigger>
                    <SelectContent>
                      {bourbons.map((bourbon) => (
                        <SelectItem key={bourbon.id} value={bourbon.id}>
                          <span className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: bourbon.color }} 
                            />
                            {bourbon.name} - {bourbon.distillery}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Can&apos;t find your bourbon? Switch to &quot;Custom Entry&quot; to add it manually.
                  </p>
                </TabsContent>
                
                <TabsContent value="custom" className="mt-0 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="customName">Bourbon Name *</Label>
                      <Input
                        id="customName"
                        placeholder="e.g., Pappy Van Winkle 15 Year"
                        value={customBourbon.name}
                        onChange={(e) => setCustomBourbon({ ...customBourbon, name: e.target.value })}
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customDistillery">Distillery</Label>
                      <Input
                        id="customDistillery"
                        placeholder="e.g., Buffalo Trace"
                        value={customBourbon.distillery}
                        onChange={(e) => setCustomBourbon({ ...customBourbon, distillery: e.target.value })}
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customProof">Proof</Label>
                      <Input
                        id="customProof"
                        type="number"
                        placeholder="e.g., 107"
                        value={customBourbon.proof}
                        onChange={(e) => setCustomBourbon({ ...customBourbon, proof: e.target.value })}
                        min={0}
                        max={200}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customAge">Age Statement</Label>
                      <Input
                        id="customAge"
                        placeholder="e.g., 15 years"
                        value={customBourbon.age}
                        onChange={(e) => setCustomBourbon({ ...customBourbon, age: e.target.value })}
                        maxLength={50}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customOrigin">Origin</Label>
                      <Input
                        id="customOrigin"
                        placeholder="e.g., Frankfort, Kentucky"
                        value={customBourbon.origin}
                        onChange={(e) => setCustomBourbon({ ...customBourbon, origin: e.target.value })}
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="customMashBill">Mash Bill (optional)</Label>
                      <Input
                        id="customMashBill"
                        placeholder="e.g., 75% corn, 13% rye, 12% malted barley"
                        value={customBourbon.mashBill}
                        onChange={(e) => setCustomBourbon({ ...customBourbon, mashBill: e.target.value })}
                        maxLength={200}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photos</CardTitle>
              <CardDescription>
                Add photos of the bottle, label, or your pour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                photos={formData.photos}
                onChange={(photos) => setFormData({ ...formData, photos })}
                maxPhotos={3}
              />
            </CardContent>
          </Card>

          {/* Color */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visible Color</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorPicker 
                value={formData.visibleColor} 
                onChange={(color) => setFormData({ ...formData, visibleColor: color })}
              />
            </CardContent>
          </Card>

          {/* Tasting Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasting Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bouquet">Bouquet (Nose)</Label>
                <Textarea
                  id="bouquet"
                  placeholder="Describe the aromas... vanilla, caramel, oak, etc."
                  value={formData.bouquet}
                  onChange={(e) => setFormData({ ...formData, bouquet: e.target.value })}
                  rows={3}
                  maxLength={1000}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taste">Taste (Palate)</Label>
                <Textarea
                  id="taste"
                  placeholder="Describe the flavors on your palate..."
                  value={formData.taste}
                  onChange={(e) => setFormData({ ...formData, taste: e.target.value })}
                  rows={3}
                  maxLength={1000}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="finish">Finish</Label>
                <Textarea
                  id="finish"
                  placeholder="Describe the finish and aftertaste..."
                  value={formData.finish}
                  onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                  rows={2}
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>

          {/* Flavors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discernible Flavors</CardTitle>
            </CardHeader>
            <CardContent>
              <FlavorSelector
                selected={formData.discernibleFlavors}
                onChange={(flavors) => setFormData({ ...formData, discernibleFlavors: flavors })}
              />
            </CardContent>
          </Card>

          {/* Serving Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Serving Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where are you tasting?"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    maxLength={100}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="glassware">Glassware</Label>
                  <Select 
                    value={formData.glassware} 
                    onValueChange={(value) => setFormData({ ...formData, glassware: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select glassware..." />
                    </SelectTrigger>
                    <SelectContent>
                      {glasswareOptions.map((glass) => (
                        <SelectItem key={glass} value={glass}>{glass}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Switch
                    id="water"
                    checked={formData.waterAdded}
                    onCheckedChange={(checked) => setFormData({ ...formData, waterAdded: checked })}
                  />
                  <Label htmlFor="water" className="cursor-pointer">Water added</Label>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    id="ice"
                    checked={formData.iceAdded}
                    onCheckedChange={(checked) => setFormData({ ...formData, iceAdded: checked })}
                  />
                  <Label htmlFor="ice" className="cursor-pointer">On the rocks</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Thoughts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Share your overall impression of this bourbon..."
                value={formData.overallThoughts}
                onChange={(e) => setFormData({ ...formData, overallThoughts: e.target.value })}
                rows={4}
                maxLength={2000}
              />
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <StarRating
                rating={formData.rating}
                size="lg"
                interactive
                onChange={(rating) => setFormData({ ...formData, rating })}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              type="submit" 
              variant="bourbon" 
              size="lg" 
              className="gap-2 flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Tasting Note"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
