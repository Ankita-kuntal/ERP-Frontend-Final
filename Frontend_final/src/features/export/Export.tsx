import { useState } from "react";
import { useAuth } from "../auth/store/customHooks";
import { Button } from "../../shared//ui/Button";
import { Card } from "../../shared//ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared//ui/select";
import { DatePicker } from "../../shared//ui/date-picker";
import { FileDown, Calendar } from "lucide-react";

export const Export = () => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const exportTypes = [
    { value: "scholarships", label: "Scholarship Reports" },
    { value: "financial", label: "Financial Reports" },
    { value: "student", label: "Student Reports" },
  ];
  const handleExport = async () => {
    if (!selectedType || !startDate || !endDate) {
      // Show error message
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement export functionality
      // This will be implemented when we have the backend API
      console.log("Exporting data:", {
        type: selectedType,
        startDate,
        endDate,
      });
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Export Data</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent>
                {exportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={isLoading || !selectedType || !startDate || !endDate}
            className="w-full md:w-auto"
          >
            <FileDown className="w-4 h-4 mr-2" />
            {isLoading ? "Exporting..." : "Export Data"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
