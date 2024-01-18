import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DailyWageForm } from '../../forms/daily-wage.form';
import { DailyWageModel } from '../../models/daily-wage-model';
import { DepartmentApiModel } from '../../models/department-api-model';
import { DepartmentViewModel } from '../../models/department-view-model';
import { HelperService } from '../../services/helper.service';

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
  protected departmentModels: DepartmentApiModel[]
  protected dailyWageModel: DailyWageModel

  constructor(private readonly helperService: HelperService) {
    this.departmentModels = this.helperService.getDepartment()
    this.dailyWageModel = this.helperService.getDailyWage()
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      amount: this.dailyWageModel.amount,
      total100: this.dailyWageModel.total100,
      total80: this.dailyWageModel.total80,
      total40: this.dailyWageModel.total40,
    })
    this.departments = this.departmentModels.sort((a, b) => a.id - b.id).map(x => new DepartmentViewModel(x.id, x.name, x.totalDay, Math.ceil(x.totalDay * this.dailyWageModel.amount)))
    this.loading = false
  }

  protected returnHome = (): void => {
    this.router.navigate([''])
  }
}
