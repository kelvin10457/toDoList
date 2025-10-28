export class Task {
    id;
    title;
    description;
    status;

    constructor(id,title,description,status){
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }
}
