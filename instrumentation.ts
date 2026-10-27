import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if ((!token || !host) && process.env.NODE_ENV === "development") {
  const missingVariable = token
    ? "NEXT_PUBLIC_POSTHOG_HOST"
    : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
  console.warn(
    `[PostHog] ${missingVariable} is not configured; analytics logging is paused.`,
  );
}

const posthogLogProvider =
  token && host
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          "service.name": "taimoor-portfolio",
          "service.runtime": "nextjs",
        }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${host}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : null;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !posthogLogProvider) return;

  const logger = posthogLogProvider.getLogger("posthog-log-exporter");
  logger.emit({
    body: "PostHog log exporter configured",
    severityNumber: SeverityNumber.INFO,
    attributes: { event: "posthog_log_exporter_configured" },
  });
  logger.emit({
    body: "PostHog log exporter ready",
    severityNumber: SeverityNumber.INFO,
    attributes: { event: "posthog_log_exporter_ready" },
  });

  await posthogLogProvider.forceFlush();
}
