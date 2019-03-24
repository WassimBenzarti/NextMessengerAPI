export function useMerger(commonOptions, theWayToCall) {
  return (fn, specialOptions?) => {
    return options => {
      return theWayToCall({ ...commonOptions, ...specialOptions }, fn, options);
    };
  };
}
