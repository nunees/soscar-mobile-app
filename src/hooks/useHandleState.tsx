export function useHandleState() {
  function handleMultipleStateSelection(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeFunction: React.Dispatch<React.SetStateAction<any[]>>,
    state: unknown[],
    value: unknown
  ) {
    const alreadySelected = state.includes(value);

    if (alreadySelected === undefined) {
      changeFunction([value]);
      return;
    }
    if (!alreadySelected) {
      changeFunction([...state!, value]);
      return;
    }
    if (alreadySelected) {
      changeFunction(state?.filter((item) => item !== value));
    }
  }

  return { handleMultipleStateSelection };
}
