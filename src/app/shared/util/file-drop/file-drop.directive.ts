import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[lcFileDrop]'
})
export class FileDropDirective {

    private enterLeaveCounter: number = 0;

    @Input() fileAcceptMultiple: boolean;
    @Output() fileDragOver: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() fileDropped: EventEmitter<Array<File>> = new EventEmitter<Array<File>>();

    @HostListener('dragenter', ['$event'])
    onDragEnter(event: Event): void {
        if (this.enterLeaveCounter === 0) {
            this.fileDragOver.emit(true);
        }
        this.enterLeaveCounter++;
        this.preventAndStopEventPropagation(event);
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event: Event): void {
        if (this.enterLeaveCounter === 1) {
            this.fileDragOver.emit(false);
        }
        this.enterLeaveCounter = Math.max(0, this.enterLeaveCounter - 1);
        this.preventAndStopEventPropagation(event);
    }

    @HostListener('drop', ['$event'])
    onDrop(event: Event): void {
        if (this.enterLeaveCounter > 0) {
            this.enterLeaveCounter = 0;
            this.fileDragOver.emit(false);
            this.fileDropped.emit(this.fileListToArray(this.getDataTransferObject(event).files));
        }
        this.preventAndStopEventPropagation(event);
    }

    private fileListToArray(fileList: FileList): Array<File> {
        return fileList ? Array.prototype.map.call(fileList, (file: File) => file) : [];
    }

    private preventAndStopEventPropagation(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    private getDataTransferObject(event: Event | any): DataTransfer {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    }
}
