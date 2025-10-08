import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Languages } from "lucide-react";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Languages className="w-4 h-4" />
        Preferred Language
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background/50 border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="hindi">Hindi</SelectItem>
          <SelectItem value="tamil">Tamil</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
