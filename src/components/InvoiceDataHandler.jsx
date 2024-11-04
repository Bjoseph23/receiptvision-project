import React from 'react';
import  supabase from './supabaseClient';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const InvoiceDataHandler = ({ invoiceData, onSuccess, onError }) => {
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState(null);

  const processInvoiceToSupabase = async () => {
    setProcessing(true);
    setError(null);

    try {
      // First, check/create income source
      const { data: sourceData, error: sourceError } = await supabase
        .from('income_sources')
        .select('id')
        .eq('name', invoiceData.company)
        .single();

      let sourceId;
      
      if (sourceError || !sourceData) {
        // Create new income source if it doesn't exist
        const { data: newSource, error: newSourceError } = await supabase
          .from('income_sources')
          .insert([
            {
              name: invoiceData.company,
              description: `Income from ${invoiceData.company}`
            }
          ])
          .select()
          .single();

        if (newSourceError) throw newSourceError;
        sourceId = newSource.id;
      } else {
        sourceId = sourceData.id;
      }

      // Create income record
      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .insert([
          {
            source_id: sourceId,
            amount: invoiceData.total,
            description: `Invoice #${invoiceData.invoice_number} from ${invoiceData.company} - Customer: ${invoiceData.customer}`,
            is_recurring: false,
            frequency: 'one-time',
            income_date: invoiceData.date,
          }
        ])
        .select();

      if (incomeError) throw incomeError;

      // Optional: Store individual line items if you want to track them
      // You would need to create a new table in your Supabase database for this
      
      onSuccess?.(incomeData);
      setProcessing(false);
    } catch (err) {
      console.error('Error processing invoice:', err);
      setError(err.message);
      onError?.(err);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={processInvoiceToSupabase}
        disabled={processing}
        className="w-full bg-blue-300 rounded-xl hover:bg-blue-900 hover:text-white"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving to Database...
          </>
        ) : (
          'Save Invoice Data'
        )}
      </Button>
    </div>
  );
};

export default InvoiceDataHandler;