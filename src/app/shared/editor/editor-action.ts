
type CallbackFn = () => void;

export class EditorAction {

  constructor(
    private title: string,
    private enabled: boolean,
    private callbackFn: CallbackFn
  ) {
  }

  getTitle(): string {
    return this.title;
  }

  isDisabled(): boolean {
    return !this.enabled;
  }

  call(): void {
    this.callbackFn();
  }
}
