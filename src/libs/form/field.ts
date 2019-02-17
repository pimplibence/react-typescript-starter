import { Subject } from 'rxjs';
import { Form } from './form';
import { ValidatorResponseInterface } from './validator/validator-response.interface';

export class Field {
    public value$ = new Subject();
    public validate$ = new Subject();

    public placeholder: string;
    public label: string;
    public hint: string;
    public value: string;
    public validators: any[];
    public errors: ValidatorResponseInterface[] = [];
    public dirty: boolean = false;
    public parentForm: Form;

    constructor(obj: Field | any = {}) {
        this.placeholder = obj.placeholder || '';
        this.label = obj.label || '';
        this.hint = obj.hint || '';
        this.value = obj.value || '';
        this.validators = obj.validators || [];

        if (this.value) {
            this.dirty = true;
        }
    }

    public setParentForm(parent: Form) {
        this.parentForm = parent;
    }

    public async validate() {
        this.dirty = true;

        const response = await Promise.all(this.validators.map(async (validator: any) => {
            return validator(this);
        }));

        this.errors = response.filter((r: ValidatorResponseInterface) => !r.valid);

        this.validate$.next();
        return Promise.resolve(response);
    }

    public async setValue(value: any) {
        this.dirty = true;
        this.value = value;
        await this.validate();
        this.value$.next(value);
    }

    public getValue(): any {
        return this.value;
    }
}
