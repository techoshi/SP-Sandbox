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
    hasSequence: boolean,
    hasActive: boolean,
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

interface spaLoadListStruct {
    name : string;
    tabTitle : string;
    path : string;
    search: string[],
    singular : string;
    columns: {
        visible : string[],
        hidden : string[],
        readOnly: string[]
    },
    table : any,
    children : spaLoadListStruct[],
    hidden: boolean,
    sectionName: string,
    condition: string,
    repeatable : any,
    metaDataVisible : boolean,
    wholeForm : boolean,
    dataEditable : boolean,
    form : any,
    config : boolean,
    availableParent : string[],
    relationships : any[]
    formType : string;
    
    thisVar: string;
    thisObjectLower: string;
    owner: string;
    source : string;
    loaded: boolean;
    title: string;
    spType: string;
    loadActionButtons: boolean;
}