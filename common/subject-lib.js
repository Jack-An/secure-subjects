


export class SubjectLib {

    lib = [];

    loadSubjectLib = (type)=> {
        if(type === 'single') {
            this.lib = require("./single.json")
        }else if(type === 'multiple') {
            this.lib = require("./multiple.json")
        }else if(type === 'judge') {
            this.lib = require("./judge.json")
        }else{
            this.lib = require("./sample.json")
        }
    }
}