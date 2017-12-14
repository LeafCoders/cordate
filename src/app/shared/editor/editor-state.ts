
export class EditorState {
  createMode: boolean = false; // Editor should not show any save control because the parent editor has the save control
  editable: boolean = false;   // Editor has permission to edit the data
  editing: boolean = false;    // Editor is editing the value
  saving: boolean = false;     // Parent of editor is saving the data the the editor is viewing/editing

  static setAllCreateMode(states: Array<EditorState>, createMode: boolean) {
    states.forEach(state => state.createMode = createMode);
  }

  static setAllEditable(states: Array<EditorState>) {
    states.forEach(state => state.editable = true);
  }

  static setEditable(state: EditorState, editable: boolean = true) {
    state.editable = editable;
  }

  static resetAll(states: Array<EditorState>) {
    states.forEach(state => state.reset());
  }

  reset(): void {
    this.createMode = false;
    this.editable = false;
    this.editing = false;
    this.saving = false;
  }
}
