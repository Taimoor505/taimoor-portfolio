// Re-mounts on every navigation, like the reference's page wrapper: fades in and rises 8px.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
