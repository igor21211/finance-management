import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ImportTable from './import-table';
import { useState } from 'react';
import { convertAmountToMiliUnits } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (
    data: {
      date: string;
      amount: number;
      payee: string;
      notes?: string;
      categoryId?: string;
    }[]
  ) => void;
};
interface SelectedColumnsState {
  [key: string]: string | null;
}
const outputFormat = 'yyyy-MM-dd';
const requireOptions = ['amount', 'date', 'payee'];

const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] =
    useState<SelectedColumnsState>({});
  const headers = data[0];
  const body = data.slice(1);

  const onTableSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === 'skip') {
        value = null;
      }
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };
  const progress =
    Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    // Get the index of the column
    const getColumnIndex = (column: string) => {
      return column.split('_')[1];
    };
    // Map the data to the selected columns
    const mappedData = {
      headers: headers.map((_header, index) => {
        const column = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${column}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const column = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${column}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };
    // Transform the data into an array of objects
    const arrayOfData = mappedData.body
      .map((row) => {
        return row.reduce<Record<string, string>>(
          (acc, cell, index) => {
            const header = mappedData.headers[index];
            if (header !== null && cell !== null) {
              acc[header] = cell;
            }
            return acc;
          },
          {} as Record<string, string>
        );
      })
      // Filter out rows where all required fields are empty
      .filter((item) => {
        return requireOptions.every((field) => {
          const value = item[field];
          return value && value.trim() !== '';
        });
      });

    // Format the data
    const formattedData = arrayOfData.map((item) => {
      try {
        if (!item.date || typeof item.date !== 'string') {
          throw new Error('Date is required');
        }

        const trimmedDate = item.date.trim();
        if (!trimmedDate) {
          throw new Error('Date cannot be empty');
        }

        const [datePart, timePart] = trimmedDate.split(' ');
        if (!datePart || !timePart) {
          throw new Error('Invalid date format');
        }

        const [day, month, year] = datePart.split('.');
        const [hours, minutes] = timePart.split(':');

        if (!day || !month || !year || !hours || !minutes) {
          throw new Error('Invalid date components');
        }

        const parsedDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );

        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date');
        }

        return {
          ...item,
          amount: convertAmountToMiliUnits(parseFloat(item.amount)),
          date: format(parsedDate, outputFormat),
          payee: item.payee || '',
          notes: item.notes,
          categoryId: item.categoryId,
        };
      } catch (err) {
        console.error(err);
        const errorMsg = `Invalid date format in row. Expected DD.MM.YYYY HH:mm, got: ${item.date || 'empty value'}`;
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }
    });

    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-2xl line-clamp-1">
            Import Transactions
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={onCancel}
            >
              <X className="size-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="w-full lg:w-auto"
              disabled={progress < requireOptions.length}
              onClick={handleContinue}
            >
              Continue ({progress}/{requireOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableSelectChange={onTableSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default ImportCard;
