import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mount } from '@jscutlery/cypress-angular/mount';
import { JNetworkBootstrap4FormModule } from '../form/form.module';
import { JNetworkBootstrap4InputModule } from './input.module';

@Component({
  template: `<form>
    <ngInputDecimal
      name="field"
      label="My Label"
      [maxvalue]="maxvalue"
      [minvalue]="minvalue"
      [allownegativ]="allownegativ"
      [(ngModel)]="value"
    ></ngInputDecimal>
  </form>`,
})
export class NgInputDecimalComponentTest {
  private _value = '';

  @Input()
  public set value(v) {
    this._value = v;
    this.valueChange.emit(v);
  }
  public get value() {
    return this._value;
  }

  @Output()
  public valueChange = new EventEmitter<string>();

  @Input()
  public minvalue = undefined;
  @Input()
  public maxvalue = undefined;
  @Input()
  public allownegativ = false;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    JNetworkBootstrap4FormModule,
    JNetworkBootstrap4InputModule,
  ],
  declarations: [NgInputDecimalComponentTest],
  exports: [NgInputDecimalComponentTest],
})
export class NgInputDecimalModuleTest {}

function createComponent(markup: string) {
  mount('<form>' + markup + '</form>', {
    imports: [
      FormsModule,
      JNetworkBootstrap4FormModule,
      JNetworkBootstrap4InputModule,
    ],
    stylesheet:
      'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css',
  });
}

function createComponentObject(inputs: any, outputs: any) {
  cy.spy(outputs, 'valueChange').as('valueChange');

  mount(NgInputDecimalComponentTest, {
    imports: [NgInputDecimalModuleTest],
    inputs: inputs,
    outputs: outputs,
    stylesheet:
      'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css',
  });
}

describe('NgInputDecimalComponent', () => {
  it('should show label and text', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [ngModel]="\'1.33\'"></ngInputDecimal>'
    );

    cy.shouldHaveLabel('My Label');
    cy.get('input').should('have.value', '1.33');
  });

  it('should show required', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [isrequired]="true" [ngModel]="\'\'"></ngInputDecimal>'
    );

    cy.shouldHaveLabel('My Label');
    cy.shouldBeInvalid();

    cy.get('input').should('have.value', '');
    cy.get('input').type('145.54');

    cy.shouldBeValid();

    cy.get('input').should('have.value', '145.54');
  });

  it('should hide label', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [disablelabel]="true" [ngModel]="\'\'"></ngInputDecimal>'
    );

    cy.shouldNotHaveLabel();
    cy.get('input').should('exist');
  });

  it('should have placeholder', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" placeholder="My Placeholder" [ngModel]="\'\'"></ngInputDecimal>'
    );

    cy.shouldHavePlaceholder('My Placeholder');
  });

  it('should have be readonly', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" readonly="true" [ngModel]="\'MyValue\'"></ngInputDecimal>'
    );

    cy.shouldBeReadonly();
  });

  it('should have be disabled', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [disabled]="true" [ngModel]="\'MyValue\'"></ngInputDecimal>'
    );

    cy.shouldBeDisabled();
  });

  it('should handle model binding', () => {
    let inputs = { value: '15' };
    let outputs = { valueChange(v) {} };
    createComponentObject(inputs, outputs);

    cy.get('input').should('have.value', '15');
    cy.get('input').clear().type('2355');
    cy.get('input').should('have.value', '2355');
    cy.validateValueChanged('2355'.length + 1);
  });

  it('should use maxvalue', () => {
    let inputs = { value: 4, maxvalue: 6 };
    let outputs = { valueChange(v) {} };
    createComponentObject(inputs, outputs);

    cy.shouldBeValid();

    cy.get('input').clear().type('10');
    cy.get('input').should('have.value', '10');

    cy.validateValueChanged('10'.length + 1);
    cy.shouldBeInvalid();
  });

  it('should use minvalue', () => {
    let inputs = { value: 8, minvalue: 6 };
    let outputs = { valueChange(v) {} };
    createComponentObject(inputs, outputs);

    cy.shouldBeValid();

    cy.get('input').clear().type('4');
    cy.get('input').should('have.value', '4');

    cy.validateValueChanged('4'.length + 1);
    cy.shouldBeInvalid();
  });

  it('should allow negativ numbers', () => {
    let inputs = { value: 8, allownegativ: true };
    let outputs = { valueChange(v) {} };
    createComponentObject(inputs, outputs);

    cy.shouldBeValid();

    cy.get('input').clear().type('-4');
    cy.get('input').should('have.value', '-4');

    cy.validateValueChanged('-4'.length + 1);
    cy.shouldBeValid();
  });

  it('should allow only positiv numbers', () => {
    let inputs = { value: 8, allownegativ: false };
    let outputs = { valueChange(v) {} };
    createComponentObject(inputs, outputs);

    cy.shouldBeValid();

    cy.get('input').clear().type('-4');
    cy.get('input').should('have.value', '4');

    cy.validateValueChanged('4'.length + 1);
    cy.shouldBeValid();
  });

  it('should not allow chars', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [ngModel]="\'0\'"></ngInputDecimal>'
    );

    cy.shouldHaveLabel('My Label');

    cy.get('input').should('have.value', '0');
    cy.get('input').type('abc');
    cy.get('input').should('have.value', '0');
  });

  it('should allow decimal char', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [ngModel]="\'0\'"></ngInputDecimal>'
    );

    cy.shouldHaveLabel('My Label');

    cy.get('input').should('have.value', '0');
    cy.get('input').type('1.4');
    cy.get('input').should('have.value', '1.4');
  });

  it('should not allow multiple decimal char', () => {
    createComponent(
      '<ngInputDecimal name="field" label="My Label" [ngModel]="\'0\'"></ngInputDecimal>'
    );

    cy.shouldHaveLabel('My Label');

    cy.get('input').should('have.value', '0');
    cy.get('input').type('1.4.4');
    cy.get('input').should('have.value', '1.44');
  });
});
