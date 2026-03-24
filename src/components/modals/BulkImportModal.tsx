import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFirestoreCRUD } from "@/hooks/useFirestoreCRUD";
import { generateAutoNumber } from "@/lib/adminHelpers";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import Papa from "papaparse";

interface StockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  unit: string;
  status: string;
  createdAt?: any;
  updatedAt?: any;
}

interface CSVRow {
  product?: string;
  sku?: string;
  stock?: string | number;
  unit?: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const BulkImportModal = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: BulkImportModalProps) => {
  const { toast } = useToast();
  const { add, loading } = useFirestoreCRUD<StockItem>("stock");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const data = results.data as CSVRow[];
        validateAndSetData(data);
      },
      error: (error: any) => {
        toast({
          title: "Parse Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const validateAndSetData = (data: CSVRow[]) => {
    const validationErrors: string[] = [];
    const validRows: CSVRow[] = [];

    data.forEach((row, index) => {
      const rowErrors: string[] = [];

      if (!row.product || !row.product.toString().trim()) {
        rowErrors.push(`Row ${index + 1}: Product name is required`);
      }

      if (!row.sku || !row.sku.toString().trim()) {
        rowErrors.push(`Row ${index + 1}: SKU is required`);
      }

      const stock = parseInt(String(row.stock), 10);
      if (isNaN(stock) || stock < 0) {
        rowErrors.push(`Row ${index + 1}: Stock must be a valid non-negative number`);
      }

      if (!row.unit || !row.unit.toString().trim()) {
        rowErrors.push(`Row ${index + 1}: Unit is required`);
      }

      if (rowErrors.length === 0) {
        validRows.push(row);
      } else {
        validationErrors.push(...rowErrors);
      }
    });

    setErrors(validationErrors);
    setParsedData(validRows);
    setStep("preview");

    if (validationErrors.length > 0) {
      toast({
        title: "Validation Warnings",
        description: `${validationErrors.length} row(s) have errors and will be skipped`,
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast({
        title: "Error",
        description: "No valid data to import",
        variant: "destructive",
      });
      return;
    }

    setStep("importing");
    setIsProcessing(true);

    let successCount = 0;
    let failureCount = 0;

    for (const row of parsedData) {
      try {
        const id = await generateAutoNumber("stock", "STO");
        const status =
          parseInt(String(row.stock), 10) > 500
            ? "In Stock"
            : parseInt(String(row.stock), 10) >= 50
              ? "Low Stock"
              : "Out of Stock";

        const success = await add({
          id,
          product: row.product || "",
          sku: row.sku || "",
          stock: parseInt(String(row.stock), 10),
          unit: row.unit || "",
          status,
        } as Omit<StockItem, "id">);

        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (err) {
        failureCount++;
      }
    }

    setIsProcessing(false);
    toast({
      title: "Import Complete",
      description: `${successCount} items imported successfully${failureCount > 0 ? `, ${failureCount} failed` : ""}`,
      variant: successCount > 0 ? "default" : "destructive",
    });

    if (successCount > 0) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData([]);
    setErrors([]);
    setStep("upload");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Import Stock from CSV</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">CSV Format Required:</p>
              <code className="block bg-white p-2 rounded text-xs font-mono border border-blue-100">
                product,sku,stock,unit<br />
                Pork Siomai,SIO-PRK,2400,packs<br />
                Beef Siomai,SIO-BEF,1850,packs
              </code>
            </div>

            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">CSV files only</p>
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
              ✓ {parsedData.length} valid row(s) ready to import
            </div>

            {errors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex gap-2 items-start mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold text-amber-800">
                    {errors.length} row(s) with errors will be skipped
                  </p>
                </div>
                <div className="text-xs text-amber-700 max-h-[150px] overflow-y-auto space-y-1">
                  {errors.map((error, i) => (
                    <div key={i}>• {error}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-3">Preview (first 5 items):</p>
              <div className="overflow-x-auto">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product</th>
                      <th className="text-left p-2">SKU</th>
                      <th className="text-left p-2">Stock</th>
                      <th className="text-left p-2">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{row.product}</td>
                        <td className="p-2">{row.sku}</td>
                        <td className="p-2">{row.stock}</td>
                        <td className="p-2">{row.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleReset}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={loading || parsedData.length === 0}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import All"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "importing" && (
          <div className="space-y-4 text-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <div>
              <p className="font-semibold text-foreground">Importing {parsedData.length} items...</p>
              <p className="text-sm text-muted-foreground">This may take a moment</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
