declare global {
  interface HTMLElementEventMap {
    bitflipped: CustomEvent,
  }
}

export default class EventNames {
  // Cue for the input field to update its value
  public static readonly bitFlipped = "bitflipped";
}
