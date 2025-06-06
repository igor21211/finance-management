'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from './ui/popover';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { formatDateRange } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { format, subDays } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import qs from 'query-string';

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get('accountId');
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);
  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };
  const [date, setDate] = useState<DateRange | undefined>(paramState);
  const pushToUrl = (date: DateRange | undefined) => {
    const query = {
      accountId,
      from: format(date?.from || defaultFrom, 'yyyy-MM-dd'),
      to: format(date?.to || defaultTo, 'yyyy-MM-dd'),
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );
    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={false}
            size="sm"
            variant="outline"
            className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 text-white
      hover:text-white border-none  focus:ring-offset-0 focus:ring-transparent outline-none focus:bg-white/30 transition"
          >
            <span>{formatDateRange(paramState)}</span>
            <ChevronDown className="size-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="lg:w-auto w-full p-0"
          align="start"
        >
          <Calendar
            disabled={false}
            initialFocus
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="p-4 w-full flex items-center gap-x-2">
            <PopoverClose asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={!date?.from && !date?.to}
              >
                Reset
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button
                size="sm"
                onClick={() => pushToUrl(date)}
                disabled={!date?.from && !date?.to}
              >
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
