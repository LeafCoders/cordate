export interface FilesCheckConfig {
    maxFileSizeInBytes?: number;
    fileNameFilters?: Array<RegExp>;
    mimeTypeFilters?: Array<RegExp>;
}

export interface RejectReason {
    file: File;
    fileSizeTooLarge?: boolean;
    fileNameNotValid?: boolean;
    mimeTypeNotValid?: boolean;
}

export interface FilesCheckResult {
    accepted: Array<File>;
    rejected: Array<RejectReason>;
}

export function checkFiles(files: Array<File>, checkConfig: FilesCheckConfig): FilesCheckResult {
    return files.reduce<FilesCheckResult>((result: FilesCheckResult, file: File): FilesCheckResult => {
        if (checkConfig.maxFileSizeInBytes && file.size > checkConfig.maxFileSizeInBytes ) {
            result.rejected.push({ file, fileSizeTooLarge: true });
        } else if (checkConfig.fileNameFilters && !inStringList(file.name, checkConfig.fileNameFilters)) {
            result.rejected.push({ file, fileNameNotValid: true });
        } else if (checkConfig.mimeTypeFilters && !inStringList(file.type, checkConfig.mimeTypeFilters)) {
            result.rejected.push({ file, mimeTypeNotValid: true });
        } else {
            result.accepted.push(file);
        }
        return result;
    }, {
        accepted: [],
        rejected: []
    });
}

export function getAcceptedFiles(files: Array<File>, checkConfig: FilesCheckConfig): Array<File> {
    return checkFiles(files, checkConfig).accepted;
}

export function getRejectedReasons(files: Array<File>, checkConfig: FilesCheckConfig): Array<RejectReason> {
    return checkFiles(files, checkConfig).rejected;
}

function inStringList(text: string, stringList: Array<RegExp>): boolean {
    return stringList.some((match: RegExp): boolean => {
        return !!text.match(match);
    });
}
