import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild('input', { static: true }) input: ElementRef | undefined;
  @Input() type = 'text';
  @Input() label = '';

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
  
    if (control) {
      const validators = control.validator ? [control.validator] : [];
      const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];
  
      control.setValidators(validators);
      control.setAsyncValidators(asyncValidators);
  
      // Instead of calling updateValueAndValidity, you can mark the control as dirty
      control.markAsDirty();
    }
  }

  writeValue(obj: any): void {
    if (this.input) {
      this.input.nativeElement.value = obj || '';
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.input) {
      this.input.nativeElement.disabled = isDisabled;
    }
  }

  onChange = (value: any) => {};

  onTouched = () => {};
  controlHasErrors(): boolean |null{
    const control = this.controlDir.control;
    return control && control.touched && !control.valid;
  }
}
