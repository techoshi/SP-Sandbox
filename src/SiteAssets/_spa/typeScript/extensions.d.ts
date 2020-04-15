// declare module "handlebars" {
//     var __switch_stack__: any[];
// }

// interface handlebars { __switch_stack__: any[]; }
interface Handlebars {
    __switch_stack__: any[];
    // __switch_stack__: any[]; 
}

interface Math {
    uuid: any,
    uuidFast: any,
    uuidCompact: any
}

declare namespace SP {
    interface BasePermissions extends SP.ClientValueObject {
        initPropertiesFromJson: any;
    }

    // enum PermissionKind {
    //     prototype 
    // }

}

interface JQuery {
    getType: any;
    moveDown: any;
    moveUp: any
}

interface SharePointListStruct { 
    url: string; 
    Title: string;
    type : string; 
    Description: string;
    Columns : {
        type : string; 
        Title : string;
        MaxLength : number;
        AllowMultipleValues: boolean;
        LookupFieldName: string;
        LookupListId : {
            listName : string
        }
    }[];
}
