import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, Query, collection, collectionData } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
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
    days: new FormControl(),
    isSameDepartment: new FormControl(false),
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
    this.formGroup.controls.days.valueChanges.subscribe({
      next: (value) => {
        
      }, error: (e) => {
        
        throw e
      }
    })
  }

  protected generateDays = () => {
    new Array(this.formGroup.controls.days.value).fill(null).forEach(x => {
      
    })
  }
}
