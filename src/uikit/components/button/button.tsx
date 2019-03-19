import * as React from 'react';
import { arrayToClass } from '../../libs/array-to-class';
import { BaseComponent } from '../base.component';
import { Spinner } from '../spinner/spinner';

export class Button extends React.Component<any, any> {
    public render(): React.ReactNode {
        const classes = arrayToClass([
            'uikit-button',
            'button-like',
            this.props.loading && 'loading',
            this.props.className
        ]);

        return <BaseComponent className={classes} element="button">
            {this.renderTitle()}
            {this.renderSpinner()}
        </BaseComponent>;
    }

    private renderTitle() {
        return <span className="content">
            {this.props.title}
            {this.props.children}
        </span>;
    }

    private renderSpinner(): React.ReactNode {
        if (this.props.loading) {
            return <Spinner className="absolute-zero display-flex justify-content-center align-items-center"/>;
        }

        return null;
    }
}
