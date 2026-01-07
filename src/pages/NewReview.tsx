import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Share2, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { ColorPicker } from "@/components/ColorPicker";
import { FlavorSelector } from "@/components/FlavorSelector";
import { bourbons } from "@/data/bourbons";
import { glasswareOptions } from "@/data/reviews";
import { toast } from "sonner";

export default function NewReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedBourbonId = searchParams.get("bourbon");

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
  });

  const selectedBourbon = bourbons.find(b => b.id === formData.bourbonId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bourbonId) {
      toast.error("Please select a bourbon");
      return;
    }
    if (formData.rating === 0) {
      toast.error("Please add a rating");
      return;
    }

    // In a real app, this would save to a database
    toast.success("Tasting note saved!", {
      description: `Your review for ${selectedBourbon?.name} has been added to your diary.`
    });
    
    navigate("/diary");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Bourbon Tasting: ${selectedBourbon?.name || 'My Bourbon'}`,
        text: formData.overallThoughts || "Check out my bourbon tasting notes!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🥃 Bourbon Tasting: ${selectedBourbon?.name}\n⭐ Rating: ${formData.rating}/5\n💭 ${formData.overallThoughts}`
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
            <Button type="submit" variant="bourbon" size="lg" className="gap-2 flex-1 sm:flex-none">
              <Check className="h-4 w-4" />
              Save Tasting Note
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
