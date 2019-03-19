import { clone } from 'lodash';
import { Subject } from 'rxjs';
import { randomId } from '../../uikit/libs/random-id';
import { Form } from './form';
import { ValidatorResponseInterface } from './validator/validator-response.interface';

export class Field {
    public id = randomId();
    public value$ = new Subject();
    public validate$ = new Subject();
    public options$ = new Subject();
    public placeholder: string;
    public label: string;
    public hint: string;
    public value: string;
    public validators: any[];
    public options: any[];
    public errors: ValidatorResponseInterface[] = [];
    public dirty: boolean = false;
    public multi: boolean = false;
    public parentForm: Form;

    constructor(obj: Field | any = {}) {
        this.placeholder = obj.placeholder || '';
        this.label = obj.label || '';
        this.hint = obj.hint || '';
        this.validators = obj.validators || [];
        this.options = obj.options || [];
        this.multi = obj.multi || false;

        if (obj.value !== undefined) {
            this.setValue(obj.value);
        }

        if (obj.options !== undefined) {
            this.setOptions(obj.options);
        }
    }

    public setParentForm(parent: Form) {
        this.parentForm = parent;
    }

    public async validate() {
        const response = await Promise.all(this.validators.map(async (validator: any) => {
            return validator(this);
        }));

        this.errors = response.filter((r: ValidatorResponseInterface) => !r.valid);

        this.validate$.next();
        return Promise.resolve(response);
    }

    public async setOptions(options: any[]) {
        this.options = options;
        this.options$.next();
    }

    public async setValue(value: any) {
        this.dirty = true;
        this.value = value;
        await this.validate();
        this.value$.next(value);
    }

    public getValue(): any {
        return clone(this.value);
    }
}
