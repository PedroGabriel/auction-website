import { Injectable, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';



@Injectable()
export class CriaturoEvtService {
    public event$: EventEmitter<any>;

    constructor() {
        this.event$ = new EventEmitter;
    }

    broadcast(name: string, data: any) {
        this.event$.emit({ name: name, data: data });
    }
}
