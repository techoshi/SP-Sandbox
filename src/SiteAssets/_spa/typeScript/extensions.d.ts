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
    type: string;
    Description: string;
    hasSequence: boolean,
    hasActive: boolean,
    Columns: {
        type: string;
        Title: string;
        MaxLength: number;
        AllowMultipleValues: boolean;
        LookupFieldName: string;
        LookupListId: {
            listName: string
        }
    }[];
}

interface spaRepeatableOverload {
    html: string,
    bind: any
}

interface spaRepeatable {
    enable: boolean,
    hasSequence: boolean,
    hasActive: boolean,
    overloads: spaRepeatableOverload[]
}

interface spaLoadListStruct {
    id: string;
    name: string;
    tabTitle: string;
    path: string;
    search: string[],
    singular: string;
    columns: {
        visible: string[],
        hidden: string[],
        readOnly: string[]
    },
    table: any,
    children: spaLoadListStruct[],
    hidden: boolean,
    sectionName: string,
    condition: string,
    repeatable: spaRepeatable,
    metaDataVisible: boolean,
    wholeForm: boolean,
    dataEditable: boolean,
    form: any,
    config: boolean,
    availableParent: string[],
    relationships: any[]
    formType: string;
    action: string;
    selectedRow: any;
    actionData: any;
    lastSelectedRecord: any;
    baseTemplate: any;
    formSelector: any;
    queryFilter: any;
    dataPresent: any;

    thisVar: string;
    thisObjectLower: string;
    owner: string;
    source: string;
    loaded: boolean;
    title: string;
    spType: string;
    loadActionButtons: boolean;

}

interface spaAjax {
    method: string;
    url: string;
    data: any;
    d: any;
    async: boolean,
    processData: boolean;
    headers: any;
    retryLimit: number;
    tryCount: number;
    done: any;
    fail : any;
    always: any;
    promise: boolean;
}