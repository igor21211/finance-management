import { Upload } from 'lucide-react';
import { useCSVReader } from 'react-papaparse';
import { Button } from '@/components/ui/button';

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};



interface GetRootProps {
  getRootProps: () => Record<string, unknown>;
}

type Props = {
  onUpload: (results: typeof INITIAL_IMPORT_RESULTS) => void;
};

const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  //TODO: Add a paywall

  return (
    <CSVReader
      onUploadAccepted={(results: typeof INITIAL_IMPORT_RESULTS) => {
        onUpload(results);
      }}
    >
      {({ getRootProps }: GetRootProps) => (
        <Button
          className="w-full lg:w-auto"
          size="sm"
          {...getRootProps()}
        >
          <Upload className="size-4 mr-2" />
          Upload
        </Button>
      )}
    </CSVReader>
  );
};

export default UploadButton;
