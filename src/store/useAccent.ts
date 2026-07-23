// Joriy konturga mos aksent rangi. Kontur almashganda butun ilovada rang o'zgaradi.
import { accentFor } from '../theme/tokens';
import { useSettings } from './useSettings';

export function useAccent(): string {
  const contour = useSettings((s) => s.contour);
  return accentFor(contour);
}
