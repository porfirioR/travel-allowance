import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DepartmentModel } from '../../models/department-model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CalculateForm } from '../../forms/calculate.form';
import { DayItemForm } from '../../forms/day-item.form';
import { Firestore, Query, collection, collectionData } from '@angular/fire/firestore';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavComponent } from '../nav/nav.component';
import { DailyWageModel } from '../../models/daily-wage-model';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatProgressBarModule,

    NavComponent,
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss',
})
export class PrincipalComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  protected departmentModels: DepartmentModel[] = []
  protected formGroup = new FormGroup<CalculateForm>({
    days: new FormControl(),
    isSameDepartment: new FormControl(),
    totalDays: new FormArray<FormGroup<DayItemForm>>([])
  })
  protected loading = true
  protected dailyWageModel: DailyWageModel | undefined

  ngOnInit(): void {
    const departmentRef = collection(this.firestore, 'departments')
    const departments$: Observable<DepartmentModel[]> = collectionData<DepartmentModel>(departmentRef as Query<DepartmentModel>, { idField: 'id' })

    const dailyWageRef = collection(this.firestore, 'dailyWage')
    const dailyWages$: Observable<DailyWageModel[]> = collectionData<DailyWageModel>(dailyWageRef as Query<DailyWageModel>, { idField: 'id' })

    combineLatest([departments$, dailyWages$]).subscribe({
      next: ([departments, dailyWages]) => {
        this.departmentModels = departments
        this.dailyWageModel = dailyWages.pop()
        console.log(this.departmentModels)
        console.log(this.dailyWageModel)
        this.loading = false
      }, error: (e) => {
        this.loading = false
        throw e
      }
    })
  }
}
