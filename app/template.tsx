// A template re-mounts on every navigation (unlike layout, which persists), so
// wrapping each route in .page-enter makes the zoom-in animation replay on
// every page change. See the .page-enter rules in globals.css.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
