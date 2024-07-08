export = FormData;
declare function FormData(): void;
declare class FormData {
    append: (name: any, value: any) => boolean;
    appendFile: (name: any, path: any, fileName: any) => boolean;
    getData: () => {
        contentType: string;
        buffer: ArrayBufferLike;
    };
}
//# sourceMappingURL=formData.d.ts.map