import { Icon, MenuBarExtra, open } from "@raycast/api";
import { useLineStatuses } from "./hooks/useTflStatus";

export default function Command() {
  const { lineStatuses, isLoading } = useLineStatuses();

  const disruptedLines = lineStatuses.filter((line) => !line.hasGoodService);
  const hasDisruptions = disruptedLines.length > 0;

  let content = (
    <>
      {disruptedLines.map((line) => (
        <MenuBarExtra.Item
          key={line.id}
          onAction={() => open("https://tfl.gov.uk/tube-dlr-overground/status/")}
          title={`${line.name}: ${line.status}`}
        ></MenuBarExtra.Item>
      ))}
    </>
  );

  if (isLoading) {
    content = <MenuBarExtra.Item title="Loading..." />;
  } else if (!hasDisruptions) {
    content = <MenuBarExtra.Item title="All lines running normally" />;
  }

  return (
    <MenuBarExtra
      icon={hasDisruptions ? Icon.ExclamationMark : Icon.Train}
      isLoading={isLoading}
      title={hasDisruptions ? `${disruptedLines.length}` : undefined}
    >
      {content}

      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="View TFL Status"
          onAction={() => open("https://tfl.gov.uk/tube-dlr-overground/status/")}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
