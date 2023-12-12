import { Component, OnInit, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DepartmentModel } from '../../models/department-model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CalculateForm } from '../../forms/calculate.form';
import { DayItemForm } from '../../forms/day-item.form';
import { Firestore, Query, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    MatSidenavModule
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss',
})
export class PrincipalComponent implements OnInit {
  protected departmentModels: DepartmentModel[] = []
  protected formGroup = new FormGroup<CalculateForm>({
    days: new FormControl(),
    isSameDepartment: new FormControl(),
    totalDays: new FormArray<FormGroup<DayItemForm>>([])
  })
  private firestore: Firestore = inject(Firestore);

  ngOnInit(): void {
    const ref = collection(this.firestore, 'departments');
    collectionData<DepartmentModel>(ref as Query<DepartmentModel>, { idField: 'id' }).subscribe({
      next: (departments) => {
        this.departmentModels = departments
        console.log(this.departmentModels);
        
      }, error: (e) => {
        throw e
      }
    })
  }
}
