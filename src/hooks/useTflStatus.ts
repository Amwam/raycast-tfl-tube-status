import { useEffect, useState } from "react";

export type LineStatus = {
  id: string;
  name: string;
  status: string;
  reason?: string;
  hasGoodService: boolean;
};

type TFLLineStatus = {
  id: string;
  name: string;
  lineStatuses: Array<{
    statusSeverity: number;
    statusSeverityDescription: string;
    reason?: string;
  }>;
};

async function getLineStatuses(): Promise<LineStatus[]> {
  const URL = "https://api.tfl.gov.uk/Line/Mode/tube%2Cdlr%2Celizabeth-line/Status?detail=true";

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TFLLineStatus[] = await response.json();

    return data.map((line) => {
      const currentStatus = line.lineStatuses[0];
      const isGoodService = currentStatus.statusSeverity === 10;

      return {
        id: line.id,
        name: line.name,
        status: currentStatus.statusSeverityDescription,
        reason: currentStatus.reason,
        hasGoodService: isGoodService,
      };
    });
  } catch (error) {
    console.error("Failed to fetch TFL line statuses:", error);
    return [];
  }
}

export const useLineStatuses = () => {
  const [state, setState] = useState<{ lineStatuses: LineStatus[]; isLoading: boolean }>({
    lineStatuses: [],
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const statuses = await getLineStatuses();
      setState({
        lineStatuses: statuses,
        isLoading: false,
      });
    })();
  }, []);

  return state;
};
