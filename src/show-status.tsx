import { ActionPanel, Detail, List, Action, Icon } from "@raycast/api";
import { useLineStatuses } from "./hooks/useTflStatus";

export default function Command() {
  const { lineStatuses, isLoading } = useLineStatuses();
  const disruptedLines = lineStatuses.filter((line) => !line.hasGoodService);
  const nonDisruptedLines = lineStatuses.filter((line) => line.hasGoodService);

  return (
    <List>
      {isLoading && <List.Item title="Loading..." icon={Icon.Hourglass} />}
      {disruptedLines.map((line) => (
        <List.Item
          key={line.id}
          icon={Icon.ExclamationMark}
          title={line.name}
          subtitle={line.status}
          accessories={[{ text: "Disrupted" }]}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<Detail markdown={`# ${line.name}\n\n${line.status}`} />} />
              <Action.OpenInBrowser url="https://tfl.gov.uk/tube-dlr-overground/status/" />
            </ActionPanel>
          }
        />
      ))}

      {nonDisruptedLines.map((line) => (
        <List.Item
          key={line.id}
          icon={Icon.CheckCircle}
          title={line.name}
          accessories={[{ text: "Good Service" }]}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<Detail markdown={`# ${line.name}\n\nGood Service`} />} />
              <Action.OpenInBrowser url="https://tfl.gov.uk/tube-dlr-overground/status/" />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
