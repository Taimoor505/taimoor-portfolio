import React from "react";

export function FormatOutcome({ value }: { value: string }) {
  if (!value.includes("→")) {
    return <>{value}</>;
  }

  const parts = value.split("→");
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part.trim()}
          {i < parts.length - 1 && (
            <>
              <span aria-hidden="true"> → </span>
              <span className="sr-only"> to </span>
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export default FormatOutcome;
