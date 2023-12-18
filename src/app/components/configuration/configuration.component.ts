import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Firestore, Query, collection, collectionData } from '@angular/fire/firestore';
import { DailyWageModel } from '../../models/daily-wage-model';
import { Observable, combineLatest } from 'rxjs';
import { DailyWageForm } from '../../forms/daily-wage.form';
import { DepartmentApiModel } from '../../models/department-api-model';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DepartmentViewModel } from '../../models/department-view-model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressBarModule,
    CommonModule,
    MatButtonModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  private firestore: Firestore = inject(Firestore)
  private router: Router = inject(Router)
  protected loading = true
  protected formGroup = new FormGroup<DailyWageForm>({
    id: new FormControl(),
    amount: new FormControl({ value: null, disabled: true }),
    total100: new FormControl({ value: null, disabled: true }),
    total40: new FormControl({ value: null, disabled: true }),
    total80: new FormControl({ value: null, disabled: true })
  })
  protected departments: DepartmentViewModel[] = []
  protected displayedColumns: string[] = ['id', 'name', 'totalDay', 'totalAmount'];
  protected mask = 'separator.0'
  protected thousandSeparator = '.'

  ngOnInit(): void {
    const departmentRef = collection(this.firestore, 'departments')
    const departments$: Observable<DepartmentApiModel[]> = collectionData<DepartmentApiModel>(departmentRef as Query<DepartmentApiModel>, { idField: 'id' })
    const dailyWageRef = collection(this.firestore, 'dailyWage')
    const dailyWages$: Observable<DailyWageModel[]> = collectionData<DailyWageModel>(dailyWageRef as Query<DailyWageModel>, { idField: 'id' })

    combineLatest([departments$, dailyWages$]).subscribe({
      next: ([departments, dailyWages]) => {
        const dailyWage = dailyWages.pop()
        this.formGroup.patchValue({
          amount: dailyWage?.amount,
          total100: dailyWage?.total100,
          total80: dailyWage?.total80,
          total40: dailyWage?.total40,
        })
        this.departments = departments.sort((a, b) => a.id - b.id).map(x => new DepartmentViewModel(x.id, x.name, x.totalDay, Math.ceil(x.totalDay * dailyWage!.amount)))
        this.loading = false
      }, error: (e) => {
        this.loading = false
        throw e
      }
    })
  }

  protected returnHome = () => {
    this.router.navigate([''])
  }
}
