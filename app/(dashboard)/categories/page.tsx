'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';
import { useNewCategory } from '@/features/categories/hooks/use-new-category';
const CategoriesPage = () => {
  const newCategory = useNewCategory();
  const categories = useGetCategories();
  const bulkDeleteCategories = useBulkDeleteCategories();
  const data = categories.data?.categories || [];

  const isDisabled =
    categories.isLoading || bulkDeleteCategories.isPending;

  if (categories.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex  lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-2xl line-clamp-1">
            Categories
          </CardTitle>
          <Button onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            onDelete={(rows) => {
              const ids = rows.map((row) => row.original.id);
              bulkDeleteCategories.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
