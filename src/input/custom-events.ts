// TypeScript Lesson: This gets merged into the default HTMLElementEventMap interface
// and tells tsc that these event types fires CustomEvent
declare global {
  interface HTMLElementEventMap {
    inputchanged: CustomEvent,
    inputpushed: CustomEvent,
    hexinput: CustomEvent,
  }
}

// TypeScript lesson: By assigning a string to a readonly property it becomes a `literal type` and
// EventNames.inputChanged can be used both as a `string` (when creating a new CustomEvent()) and
// as a `keyof HTMLElementEventMap` (when calling `addEventListener()`).
// For some reason `public static readonly inputChanged: string = "inputchanged"` doesn't satisfy
// tsc (v4.6.3) when calling addEventListener. The type must be `keyof HTMLElementEventMap` and
// typing it as a string causes a compile time error
class EventNames {
  // Cue for the UI to rerender
  public static readonly inputChanged = "inputchanged";

  // Cue for the UI to tuck on a row at the end of the table
  public static readonly inputPushed = "inputpushed";

  // Input is Unicode code point escape sequence (ie "\u{FEFF}")
  public static readonly hexInput = "hexinput";
}

export default EventNames;
