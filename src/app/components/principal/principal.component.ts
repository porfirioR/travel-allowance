import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CalculateForm } from '../../forms/calculate.form';
import { DayItemForm } from '../../forms/day-item.form';
import { DailyWageModel } from '../../models/daily-wage-model';
import { DepartmentApiModel } from '../../models/department-api-model';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss',
})
export class PrincipalComponent implements OnInit {
  protected departmentModels: DepartmentApiModel[]
  protected days: number[] = new Array(5).fill(null).map((x, i) => i + 1)
  protected formGroup = new FormGroup<CalculateForm>({
    days: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
    isSameDepartment: new FormControl(false),
    departmentId: new FormControl(),
    totalDays: new FormArray<FormGroup<DayItemForm>>([]),
    totalAmount: new FormControl(0),
    amountToBeRendered: new FormControl(0)
  })
  protected loading = true
  protected dailyWageModel: DailyWageModel | undefined
  protected mask = 'separator.0'
  protected thousandSeparator = '.'

  constructor(private readonly helperService: HelperService) {
    this.departmentModels = this.helperService.getDepartment()
    this.dailyWageModel = this.helperService.getDailyWage()
    this.loading = false
  }

  ngOnInit(): void {
    this.formGroup.controls.isSameDepartment.valueChanges.pipe(debounceTime(1)).subscribe({
      next: (value) => {
        if (value) {
          this.formGroup.controls.departmentId.addValidators(Validators.required)
          this.formGroup.controls.totalDays.controls.forEach(x => x.controls.departmentId.disable())
        } else {
          this.formGroup.controls.totalDays.controls.forEach(x => x.controls.departmentId.enable())
          this.formGroup.controls.departmentId.removeValidators(Validators.required)
        }
        this.formGroup.controls.departmentId.setValue(null)
      }, error: (e) => {
        throw e
      }
    })
    this.formGroup.controls.totalDays.valueChanges.pipe(debounceTime(1)).subscribe({
      next: (value) => {
        if (!this.formGroup.value.isSameDepartment!) {
          const length = this.formGroup.controls.totalDays.length
          value.forEach((x, i) => {
            const amount = this.getReturnAmount(x.departmentId ?? null, (length -1) === i, length === 1)
            this.formGroup.controls.totalDays.at(i).controls.amount.setValue(amount, { onlySelf: false, emitEvent: false, emitModelToViewChange: true, emitViewToModelChange: true })
          })
        }
        this.calculateTotalAmount()
      }, error: (e) => {
        throw e
      }
    })
  }

  protected generateDays = (): void => {
    this.formGroup.controls.totalDays.clear()
    const isSameDepartment = this.formGroup.value.isSameDepartment!
    const amount = this.getReturnAmount(this.formGroup.value.departmentId ?? null)
    const formGroups = new Array(this.formGroup.controls.days.value).fill(null).map((x, i) => {
      const formGroup = new FormGroup<DayItemForm>({
        id: new FormControl(i),
        departmentId: new FormControl({ value: this.formGroup.value.departmentId ?? null, disabled: isSameDepartment }),
        amount: new FormControl({value: amount, disabled: true}),
        capitalDistrictAmount: new FormControl({value: 0, disabled: true}),
        isCapitalDistrict: new FormControl(false)
      })

      formGroup.valueChanges.pipe(debounceTime(50)).subscribe({
        next: (dayItem) => {
          const formGroup = this.formGroup.controls.totalDays.controls.find(x => x.value.id === dayItem.id)
          if (formGroup) {
            const capitalDistrictAmount = dayItem.isCapitalDistrict ? formGroup.controls.amount.value! / 2 : 0
            formGroup.controls.capitalDistrictAmount.setValue(Math.ceil(capitalDistrictAmount), {onlySelf: true, emitEvent: false})
          }
          this.calculateAmountToBeRendered()
        }, error: (e) => {
          throw e
        }
      })
      return formGroup
    })
    formGroups.at(formGroups.length -1)?.controls.amount.setValue(this.getReturnAmount(this.formGroup.value.departmentId ?? null, true, formGroups.length === 1))
    formGroups.forEach(x => this.formGroup.controls.totalDays.push(x))
    this.calculateTotalAmount()
  }

  private getReturnAmount = (departmentId: number | null, isLastItem = false, isSingleOne = false): number | null => {
    if (!departmentId) {
      return null
    }
    const department = this.departmentModels.find(y => y.id === departmentId)
    const percentage = isLastItem ? isSingleOne ? this.dailyWageModel!.total60 : this.dailyWageModel!.total40 : this.dailyWageModel!.total80
    const amount = this.dailyWageModel!.amount * department!.totalDay * percentage
    return Math.ceil(amount)
  }

  private calculateTotalAmount = (): void => {
    const totalAmount = this.formGroup.controls.totalDays.getRawValue().reduce((a, b) => (b.amount ?? 0) + a, 0)
    this.formGroup.controls.totalAmount.setValue(totalAmount)
  }

  private calculateAmountToBeRendered = (): void => {
    const amountPayable = this.formGroup.controls.totalDays.getRawValue().reduce((a, b) => (b.capitalDistrictAmount ?? 0) + a, 0)
    this.formGroup.controls.amountToBeRendered.setValue(amountPayable)
  }
}
