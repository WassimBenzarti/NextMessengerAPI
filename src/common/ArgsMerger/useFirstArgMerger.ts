import { useMerger } from "./useMerger";

export function useFirstArgMerger(commonOptions) {
  return useMerger(commonOptions, (common, fn, opts) => {
    return fn({ ...common, ...opts });
  });
}
