import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, Query, collection, collectionData } from '@angular/fire/firestore';
import { Observable, combineLatest, debounceTime } from 'rxjs';
import { CalculateForm } from '../../forms/calculate.form';
import { DayItemForm } from '../../forms/day-item.form';
import { DailyWageModel } from '../../models/daily-wage-model';
import { DepartmentApiModel } from '../../models/department-api-model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss',
})
export class PrincipalComponent implements OnInit {
  private firestore: Firestore = inject(Firestore)
  protected departmentModels: DepartmentApiModel[] = []
  protected formGroup = new FormGroup<CalculateForm>({
    days: new FormControl(null, [Validators.required, Validators.min(1)]),
    isSameDepartment: new FormControl(false),
    departmentId: new FormControl(),
    totalDays: new FormArray<FormGroup<DayItemForm>>([])
  })
  protected loading = true
  protected dailyWageModel: DailyWageModel | undefined

  ngOnInit(): void {
    const departmentRef = collection(this.firestore, 'departments')
    const departments$: Observable<DepartmentApiModel[]> = collectionData<DepartmentApiModel>(departmentRef as Query<DepartmentApiModel>, { idField: 'id' })

    const dailyWageRef = collection(this.firestore, 'dailyWage')
    const dailyWages$: Observable<DailyWageModel[]> = collectionData<DailyWageModel>(dailyWageRef as Query<DailyWageModel>, { idField: 'id' })

    combineLatest([departments$, dailyWages$]).subscribe({
      next: ([departments, dailyWages]) => {
        this.departmentModels = departments.sort((a, b) => a.id - b.id)
        this.dailyWageModel = dailyWages.pop()
        this.loading = false
      }, error: (e) => {
        this.loading = false
        throw e
      }
    })
    this.formGroup.controls.isSameDepartment.valueChanges.pipe(debounceTime(1)).subscribe({
      next: (value) => {
        if (value) {
          this.formGroup.controls.departmentId.addValidators(Validators.required)
        } else {
          this.formGroup.controls.departmentId.removeValidators(Validators.required)
          this.formGroup.controls.departmentId.setValue(null)
        }
      }, error: (e) => {
        throw e
      }
    })
  }

  protected generateDays = () => {
    this.formGroup.controls.totalDays.clear()
    const isSameDepartment = this.formGroup.value.isSameDepartment!
    const amount = this.getReturnAmount(this.formGroup.value.departmentId ?? null)
    const formGroups = new Array(this.formGroup.controls.days.value).fill(null).map(x => {
      const formGroup = new FormGroup<DayItemForm>({
        departmentId: new FormControl({ value: this.formGroup.value.departmentId ?? null, disabled: isSameDepartment }),
        amount: new FormControl(amount)
      })
      return formGroup
    })
    formGroups.at(formGroups.length -1)?.controls.amount.setValue(this.getReturnAmount(this.formGroup.value.departmentId ?? null, true))
  }

  private getReturnAmount = (departmentId: number | null, isLastItem = false) => {
    if (!departmentId) {
      return null
    }
    const department = this.departmentModels.find(y => y.id === departmentId)
    const percentage = isLastItem ? department!.total80 : department!.total40
    const amount = this.dailyWageModel!.amount * department!.totalDay * percentage
    return amount
  }
}
